from datetime import date
from flask import request, jsonify, g
from config.db import connection
from services.progress_service import compute_progress
from utils.parsing import parse_date


def get_progress():
    # `today` should be the client's local date (?today=YYYY-MM-DD); falls back to the server date.
    today = parse_date(request.args["today"]) if request.args.get("today") else date.today()
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("""SELECT log_date, is_completed, duration_min, duration_sec, calories
        FROM workout_logs WHERE user_id=%s AND is_completed=TRUE""", (g.auth["userId"],))
        rows = cur.fetchall(); cur.close()
    return jsonify(success=True, progress=compute_progress(rows, today))
