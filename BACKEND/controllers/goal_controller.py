import uuid
from flask import request, jsonify, g
from utils.api_error import ApiError
from config.db import connection


def list_goals():
    with connection() as conn:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id,title,description,target_days,start_date,archived FROM goals WHERE user_id=%s ORDER BY created_at DESC", (g.auth["userId"],)); goals=cur.fetchall()
        cur.execute("SELECT goal_id,check_date FROM goal_checkins WHERE user_id=%s", (g.auth["userId"],)); checkins=cur.fetchall(); cur.close()
    return jsonify(success=True, goals=goals, checkins=checkins)


def create_goal():
    d=request.get_json(silent=True) or {}
    title=str(d.get("title","")).strip(); description=str(d.get("description","")).strip(); start_date=str(d.get("startDate", ""))
    target=int(d.get("targetDays",30))
    if not title or not start_date or not 1<=target<=365: raise ApiError(400,"Invalid goal data")
    gid=str(uuid.uuid4())
    with connection() as conn:
        cur=conn.cursor(); cur.execute("INSERT INTO goals (id,user_id,title,description,target_days,start_date) VALUES (%s,%s,%s,%s,%s,%s)",(gid,g.auth["userId"],title,description,target,start_date)); conn.commit(); cur.close()
    return jsonify(success=True,message="Goal created",id=gid),201


def remove_goal(id):
    with connection() as conn:
        cur=conn.cursor(); cur.execute("DELETE FROM goals WHERE id=%s AND user_id=%s",(id,g.auth["userId"])); n=cur.rowcount; conn.commit(); cur.close()
    if not n: raise ApiError(404,"Goal not found")
    return jsonify(success=True,message="Goal removed")


def add_checkin(id):
    date=str((request.get_json(silent=True) or {}).get("date", ""))
    if not date: raise ApiError(400,"A valid date is required")
    with connection() as conn:
        cur=conn.cursor(dictionary=True); cur.execute("SELECT id FROM goals WHERE id=%s AND user_id=%s",(id,g.auth["userId"])); goal=cur.fetchone()
        if not goal: cur.close(); raise ApiError(404,"Goal not found")
        cur.execute("INSERT INTO goal_checkins (id,goal_id,user_id,check_date) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE id=id",(str(uuid.uuid4()),id,g.auth["userId"],date)); conn.commit(); cur.close()
    return jsonify(success=True,message="Checked in"),201


def remove_checkin(id):
    date=request.args.get("date")
    if not date: raise ApiError(400,"A date query parameter is required")
    with connection() as conn:
        cur=conn.cursor(); cur.execute("DELETE FROM goal_checkins WHERE goal_id=%s AND user_id=%s AND check_date=%s",(id,g.auth["userId"],date)); n=cur.rowcount; conn.commit(); cur.close()
    if not n: raise ApiError(404,"Check-in not found")
    return jsonify(success=True,message="Check-in removed")
