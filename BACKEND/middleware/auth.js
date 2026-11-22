const { verifyToken } = require('../utils/jwt');
const userModel = require('../models/userModel');

// Verifies the bearer token and attaches the AUTHENTICATED user's
// identity to req.auth. Every downstream controller must read the
// user id from req.auth.userId — never from a body/query param the
// client sent — so one user can never fetch or mutate another
// user's data by simply changing an id in the request.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: no token provided' });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ success: false, message: 'Unauthorized: invalid or expired token' });
    }

    const user = await userModel.findByUserId(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: user no longer exists' });
    }

    req.auth = { userId: user.user_id, id: user.id, role: user.role };
    req.currentUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: admin access required' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
