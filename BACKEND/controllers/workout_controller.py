import uuid
from flask import request, jsonify, g
from utils.api_error import ApiError
from utils.parsing import parse_date, parse_number, round_half_up, parse_bool
from config.db import connection

INVALID = "Invalid workout data"


def list_workouts():
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("""SELECT id, log_date, name, kind, category_id, source, plan_day, is_completed,
        duration_min, duration_sec, calories, poses_completed FROM workout_logs WHERE user_id=%s
        ORDER BY log_date DESC, created_at DESC""", (g.auth["userId"],))
        rows = cur.fetchall(); cur.close()
    return jsonify(success=True, logs=rows)


def _parse_duration(d):
    """Return (duration_min, duration_sec) for the ACTUAL elapsed time the client reports.

    - `durationSeconds` (or `elapsedSeconds`) is exact: stored as seconds, minutes = nearest minute.
    - `duration` is minutes. A fractional value (12.6) also yields exact seconds (756).
      A whole number leaves duration_sec NULL (the client gave no finer precision).
    """
    for key in ("durationSeconds", "elapsedSeconds"):
        if d.get(key) is not None:
            seconds = round_half_up(parse_number(d[key], INVALID))
            if seconds < 0: raise ApiError(400, INVALID)
            return (seconds + 30) // 60, seconds
    if d.get("duration") is None: raise ApiError(400, INVALID)
    minutes = parse_number(d["duration"], INVALID)
    if minutes < 0: raise ApiError(400, INVALID)
    seconds = round_half_up(minutes * 60) if minutes != int(minutes) else None
    return round_half_up(minutes), seconds


def create_workout():
    d = request.get_json(silent=True) or {}
    try:
        name = str(d["name"]).strip()
        log_date = parse_date(d.get("date"), INVALID)
    except KeyError:
        raise ApiError(400, INVALID)
    duration_min, duration_sec = _parse_duration(d)
    calories = round_half_up(parse_number(d.get("calories"), INVALID))
    if not name or calories < 0: raise ApiError(400, INVALID)
    kind = str(d.get("kind", "yoga")).strip() or "yoga"
    category_id = d.get("categoryId") or None
    poses = round_half_up(parse_number(d.get("posesCompleted", 0), INVALID))
    source = d.get("source", "free")
    plan_day = d.get("planDay")
    plan_day = round_half_up(parse_number(plan_day, INVALID)) if plan_day not in (None, "") else None
    completed = parse_bool(d.get("isCompleted"), True)
    if source not in ("plan", "free"): raise ApiError(400, "Invalid workout source")
    if poses < 0 or (plan_day is not None and not 1 <= plan_day <= 7): raise ApiError(400, INVALID)
    wid = str(uuid.uuid4())
    with connection() as conn:
        cur = conn.cursor()
        cur.execute("""INSERT INTO workout_logs
        (id,user_id,log_date,name,kind,category_id,source,plan_day,is_completed,duration_min,duration_sec,calories,poses_completed)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (wid,g.auth["userId"],log_date,name,kind,category_id,source,plan_day,completed,duration_min,duration_sec,calories,poses))
        conn.commit(); cur.close()
    return jsonify(success=True, message="Workout logged", id=wid), 201


def remove_workout(id):
    with connection() as conn:
        cur = conn.cursor(); cur.execute("DELETE FROM workout_logs WHERE id=%s AND user_id=%s", (id,g.auth["userId"]))
        affected = cur.rowcount; conn.commit(); cur.close()
    if affected == 0: raise ApiError(404, "Workout log not found")
    return jsonify(success=True, message="Workout log removed")
