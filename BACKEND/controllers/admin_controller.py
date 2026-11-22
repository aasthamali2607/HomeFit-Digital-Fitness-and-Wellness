import uuid, json
from flask import request, jsonify
from utils.api_error import ApiError
from config.db import connection


def stats():
    with connection() as conn:
        cur=conn.cursor(dictionary=True)
        cur.execute("SELECT COUNT(*) AS count FROM users"); members=cur.fetchone()["count"]
        cur.execute("SELECT COUNT(*) AS sessions, COALESCE(SUM(duration_min),0) AS minutes FROM workout_logs"); row=cur.fetchone()
        cur.execute("SELECT COUNT(*) AS count FROM goals"); goals=cur.fetchone()["count"]; cur.close()
    return jsonify(success=True,metrics={"members":members,"sessions":row["sessions"],"minutes":int(row["minutes"]),"goals":goals})


def list_content():
    with connection() as conn:
        cur=conn.cursor(dictionary=True); cur.execute("SELECT id,kind,slug,payload,hidden FROM content_overrides ORDER BY updated_at DESC"); rows=cur.fetchall(); cur.close()
    for r in rows:
        if isinstance(r.get("payload"), str):
            try:r["payload"]=json.loads(r["payload"])
            except Exception:pass
    return jsonify(success=True,overrides=rows)


def upsert_content():
    d=request.get_json(silent=True) or {}; kind=str(d.get("kind","")).strip(); slug=str(d.get("slug","")).strip(); payload=d.get("payload",{}); hidden=bool(d.get("hidden",False))
    if not kind or not slug or not isinstance(payload,dict): raise ApiError(400,"Invalid content data")
    cid=str(uuid.uuid4())
    with connection() as conn:
        cur=conn.cursor(); cur.execute("""INSERT INTO content_overrides (id,kind,slug,payload,hidden) VALUES (%s,%s,%s,%s,%s)
        ON DUPLICATE KEY UPDATE payload=VALUES(payload),hidden=VALUES(hidden)""",(cid,kind,slug,json.dumps(payload),hidden)); conn.commit(); cur.close()
    return jsonify(success=True,message="Content updated"),201


def remove_content(id):
    with connection() as conn:
        cur=conn.cursor(); cur.execute("DELETE FROM content_overrides WHERE id=%s",(id,)); n=cur.rowcount; conn.commit(); cur.close()
    if not n: raise ApiError(404,"Content override not found")
    return jsonify(success=True,message="Content override removed")
