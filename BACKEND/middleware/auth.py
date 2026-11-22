from functools import wraps
from flask import request, jsonify, g
from utils.jwt import verify_token
from models.user_model import find_by_user_id


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        parts = header.split(" ", 1)
        if len(parts) != 2 or parts[0] != "Bearer" or not parts[1]:
            return jsonify(success=False, message="Unauthorized: no token provided"), 401
        try:
            decoded = verify_token(parts[1])
        except Exception:
            return jsonify(success=False, message="Unauthorized: invalid or expired token"), 401
        user = find_by_user_id(decoded.get("userId"))
        if not user:
            return jsonify(success=False, message="Unauthorized: user no longer exists"), 401
        g.auth = {"userId": user["user_id"], "id": user["id"], "role": user["role"]}
        g.current_user = user
        return fn(*args, **kwargs)
    return wrapper


def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not getattr(g, "auth", None) or g.auth["role"] != "admin":
            return jsonify(success=False, message="Forbidden: admin access required"), 403
        return fn(*args, **kwargs)
    return wrapper
