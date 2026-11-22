const db = require('../config/db');
const { formatUserId } = require('../services/userIdGenerator');

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function findByPhone(phone) {
  if (!phone) return null;
  const [rows] = await db.query('SELECT * FROM users WHERE phone = ? LIMIT 1', [phone]);
  return rows[0] || null;
}

async function findByUserId(userId) {
  const [rows] = await db.query('SELECT * FROM users WHERE user_id = ? LIMIT 1', [userId]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

// Creates the user in two steps inside one transaction:
// 1) insert a placeholder row to obtain the atomic AUTO_INCREMENT id
// 2) stamp the row with the derived USR000001-style public user_id
// This guarantees the generated user_id can never collide, even
// under concurrent registrations.
async function create({ name, email, phone, passwordHash, role = 'user' }) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      'INSERT INTO users (user_id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['PENDING', name, email, phone || null, passwordHash, role],
    );
    const numericId = result.insertId;
    const userId = formatUserId(numericId);

    await connection.query('UPDATE users SET user_id = ? WHERE id = ?', [userId, numericId]);

    await connection.commit();
    return findById(numericId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function updateProfile(userId, { name }) {
  await db.query('UPDATE users SET name = ? WHERE user_id = ?', [name, userId]);
  return findByUserId(userId);
}

async function countAll() {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM users');
  return rows[0].count;
}

function toPublicUser(row) {
  if (!row) return null;
  return {
    user_id: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
  };
}

module.exports = {
  findByEmail,
  findByPhone,
  findByUserId,
  findById,
  create,
  updateProfile,
  countAll,
  toPublicUser,
};
