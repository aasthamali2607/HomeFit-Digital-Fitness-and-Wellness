import json
from flask import request, jsonify, g
from utils.api_error import ApiError
from models import user_model
from config.db import connection


def get_profile():
    return jsonify(success=True, user=user_model.to_public_user(g.current_user))


def update_profile():
    name = str((request.get_json(silent=True) or {}).get("name", "")).strip()
    if not name or len(name) > 255: raise ApiError(400, "Invalid profile data")
    user = user_model.update_profile(g.auth["userId"], name)
    return jsonify(success=True, message="Profile updated", user=user_model.to_public_user(user))


def get_onboarding():
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT data, completed FROM onboarding WHERE user_id = %s", (g.auth["userId"],))
        row = cur.fetchone(); cur.close()
    if not row: return jsonify(success=True, data={}, completed=False)
    data = row["data"]
    if isinstance(data, str): data = json.loads(data)
    return jsonify(success=True, data=data, completed=bool(row["completed"]))


def update_onboarding():
    body = request.get_json(silent=True) or {}
    data = body.get("data", {})
    completed = bool(body.get("completed", False))
    if not isinstance(data, dict): raise ApiError(400, "Invalid onboarding data")
    with connection() as conn:
        cur = conn.cursor()
        cur.execute("""INSERT INTO onboarding (user_id, data, completed) VALUES (%s,%s,%s)
        ON DUPLICATE KEY UPDATE data=VALUES(data), completed=VALUES(completed)""", (g.auth["userId"], json.dumps(data), completed))
        conn.commit(); cur.close()
    return jsonify(success=True, message="Onboarding saved")
