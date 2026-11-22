import uuid
from flask import request, jsonify, g
from utils.api_error import ApiError
from utils.parsing import parse_date
from config.db import connection


def list_notes():
    day = request.args.get("date")
    sql = "SELECT id,note_date,title,body,mood FROM notes WHERE user_id=%s"
    params = [g.auth["userId"]]
    if day:
        sql += " AND note_date=%s"; params.append(parse_date(day))
    sql += " ORDER BY note_date DESC, created_at DESC"
    with connection() as conn:
        cur=conn.cursor(dictionary=True); cur.execute(sql, tuple(params)); rows=cur.fetchall(); cur.close()
    return jsonify(success=True,notes=rows)


def create_note():
    d=request.get_json(silent=True) or {}; date=str(d.get("date","")); title=str(d.get("title","")).strip(); body=str(d.get("body","")).strip(); mood=d.get("mood")
    if not date or not body: raise ApiError(400,"Write a few words first")
    date=parse_date(date)
    nid=str(uuid.uuid4())
    with connection() as conn:
        cur=conn.cursor(); cur.execute("INSERT INTO notes (id,user_id,note_date,title,body,mood) VALUES (%s,%s,%s,%s,%s,%s)",(nid,g.auth["userId"],date,title,body,mood or None)); conn.commit(); cur.close()
    return jsonify(success=True,message="Note saved",id=nid),201


def update_note(id):
    d=request.get_json(silent=True) or {}; title=str(d.get("title","")).strip(); body=str(d.get("body","")).strip(); mood=d.get("mood")
    if not body: raise ApiError(400,"Write a few words first")
    with connection() as conn:
        cur=conn.cursor(); cur.execute("UPDATE notes SET title=%s,body=%s,mood=%s WHERE id=%s AND user_id=%s",(title,body,mood or None,id,g.auth["userId"])); n=cur.rowcount; conn.commit(); cur.close()
    if not n: raise ApiError(404,"Note not found")
    return jsonify(success=True,message="Note updated")


def remove_note(id):
    with connection() as conn:
        cur=conn.cursor(); cur.execute("DELETE FROM notes WHERE id=%s AND user_id=%s",(id,g.auth["userId"])); n=cur.rowcount; conn.commit(); cur.close()
    if not n: raise ApiError(404,"Note not found")
    return jsonify(success=True,message="Note removed")
