from config.db import connection
from services.user_id_generator import format_user_id


def find_by_email(email):
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE email = %s LIMIT 1", (email,))
        row = cur.fetchone()
        cur.close()
        return row


def find_by_phone(phone):
    if not phone:
        return None
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE phone = %s LIMIT 1", (phone,))
        row = cur.fetchone()
        cur.close()
        return row


def find_by_user_id(user_id):
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE user_id = %s LIMIT 1", (user_id,))
        row = cur.fetchone()
        cur.close()
        return row


def find_by_id(numeric_id):
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE id = %s LIMIT 1", (numeric_id,))
        row = cur.fetchone()
        cur.close()
        return row


def create(name, email, phone, password_hash, role="user"):
    with connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute(
                "INSERT INTO users (user_id, name, email, phone, password_hash, role) VALUES (%s,%s,%s,%s,%s,%s)",
                ("PENDING", name, email, phone, password_hash, role),
            )
            numeric_id = cur.lastrowid
            user_id = format_user_id(numeric_id)
            cur.execute("UPDATE users SET user_id = %s WHERE id = %s", (user_id, numeric_id))
            conn.commit()
            cur.close()
            return find_by_id(numeric_id)
        except Exception:
            conn.rollback()
            cur.close()
            raise


def update_profile(user_id, name):
    with connection() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE users SET name = %s WHERE user_id = %s", (name, user_id))
        conn.commit()
        cur.close()
    return find_by_user_id(user_id)


def to_public_user(row):
    if not row:
        return None
    return {
        "user_id": row["user_id"],
        "name": row["name"],
        "email": row["email"],
        "phone": row.get("phone"),
        "role": row["role"],
    }
