import bcrypt
from flask import request, jsonify, g
from utils.api_error import ApiError
from utils.jwt import sign_token
from models import user_model
from config.db import connection


def _data():
    return request.get_json(silent=True) or {}


def _session(user):
    return sign_token({"userId": user["user_id"]}), user_model.to_public_user(user)


def register():
    data = _data()
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    phone = str(data.get("phone", "")).strip() or None
    if not name: raise ApiError(400, "Name is required")
    if "@" not in email: raise ApiError(400, "Enter a valid email")
    if len(password) < 6: raise ApiError(400, "Password must be at least 6 characters")
    if len(password) > 72: raise ApiError(400, "Password must be at most 72 characters")
    if user_model.find_by_email(email): raise ApiError(409, "An account with this email already exists")
    if phone and user_model.find_by_phone(phone): raise ApiError(409, "An account with this phone number already exists")
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()
    user = user_model.create(name, email, phone, password_hash, "user")
    with connection() as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO onboarding (user_id, data, completed) VALUES (%s, JSON_OBJECT(), FALSE)", (user["user_id"],))
        conn.commit(); cur.close()
    token, public_user = _session(user)
    return jsonify(success=True, message="Registration successful", token=token, user=public_user), 201


def login():
    data = _data()
    identifier = str(data.get("identifier", "")).strip()
    password = str(data.get("password", ""))
    if not identifier: raise ApiError(400, "Email or User ID is required")
    if not password: raise ApiError(400, "Password is required")
    user = user_model.find_by_email(identifier.lower()) if "@" in identifier else user_model.find_by_user_id(identifier.upper())
    if not user or not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        return jsonify(success=False, message="Invalid email/User ID or password"), 401
    token, public_user = _session(user)
    return jsonify(success=True, message="Login successful", token=token, user=public_user)


def logout():
    return jsonify(success=True, message="Logged out")


def me():
    return jsonify(success=True, user=user_model.to_public_user(g.current_user))
