"""API tests against the REAL MySQL database configured in .env.

Each run registers its own throw-away users and deletes only those users in tearDown
(ON DELETE CASCADE removes their rows). Existing users/data are never touched.
Run:  python -m unittest discover -s tests -v
"""
import os
import unittest
import uuid

from dotenv import load_dotenv

load_dotenv()

from app import app  # noqa: E402
from config.db import connection, ensure_schema  # noqa: E402


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.c = app.test_client()
        self.emails = []
        self.a = self.make_user("a")
        self.b = self.make_user("b")

    def tearDown(self):
        with connection() as conn:
            cur = conn.cursor()
            for e in self.emails:
                cur.execute("DELETE FROM users WHERE email=%s", (e,))
            conn.commit(); cur.close()

    def make_user(self, label):
        email = f"test_{label}_{uuid.uuid4().hex[:8]}@homefit.test"
        self.emails.append(email)
        r = self.c.post("/api/auth/register", json=dict(name=label, email=email, password="secret1"))
        self.assertEqual(r.status_code, 201, r.get_json())
        j = r.get_json()
        return dict(h={"Authorization": "Bearer " + j["token"]}, uid=j["user"]["user_id"], email=email)

    def post_workout(self, who, **kw):
        body = dict(date="2026-10-20", name="Sun Salutation", duration=5, calories=20)
        body.update(kw)
        return self.c.post("/api/user/workouts", headers=who["h"], json=body)

    def logs(self, who):
        return self.c.get("/api/user/workouts", headers=who["h"]).get_json()["logs"]


class WorkoutTests(ApiTestCase):
    def test_session_saved_and_survives_refresh_and_relogin(self):
        self.assertEqual(self.post_workout(self.a, date="2026-10-20", duration=7, calories=33).status_code, 201)
        self.assertEqual(len(self.logs(self.a)), 1)                      # "refresh"
        r = self.c.post("/api/auth/login", json=dict(identifier=self.a["email"], password="secret1"))
        h2 = {"Authorization": "Bearer " + r.get_json()["token"]}        # "login again"
        row = self.c.get("/api/user/workouts", headers=h2).get_json()["logs"][0]
        self.assertEqual((row["duration_min"], row["calories"], row["log_date"]), (7, 33, "2026-10-20"))

    def test_exact_elapsed_seconds_persisted(self):
        self.post_workout(self.a, durationSeconds=45, duration=30)       # planned 30 min, actually 45 s
        row = self.logs(self.a)[0]
        self.assertEqual((row["duration_sec"], row["duration_min"]), (45, 1))

    def test_fractional_minutes_keep_seconds_and_round_minutes(self):
        self.post_workout(self.a, duration=12.6)
        row = self.logs(self.a)[0]
        self.assertEqual((row["duration_sec"], row["duration_min"]), (756, 13))

    def test_whole_minutes_leave_seconds_null(self):
        self.post_workout(self.a, duration=30)
        row = self.logs(self.a)[0]
        self.assertEqual((row["duration_sec"], row["duration_min"]), (None, 30))

    def test_calories_stored_and_rounded(self):
        self.post_workout(self.a, calories=37.5)
        self.post_workout(self.a, calories="41.2", name="x")
        self.assertEqual(sorted(r["calories"] for r in self.logs(self.a)), [38, 41])

    def test_iso_timestamp_date_accepted_without_shift(self):
        self.assertEqual(self.post_workout(self.a, date="2026-10-20T00:00:00.000Z").status_code, 201)
        self.assertEqual(self.logs(self.a)[0]["log_date"], "2026-10-20")

    def test_bad_input_is_400_not_500(self):
        for bad in (dict(date="nope"), dict(date="2026-13-45"), dict(duration="abc"), dict(duration=-1),
                    dict(calories=None), dict(source="weird"), dict(planDay=9), dict(name="  ")):
            self.assertEqual(self.post_workout(self.a, **bad).status_code, 400, bad)

    def test_is_completed_false_string_is_false(self):
        self.post_workout(self.a, isCompleted="false")
        self.assertEqual(self.logs(self.a)[0]["is_completed"], 0)

    def test_requires_auth(self):
        self.assertEqual(self.c.get("/api/user/workouts").status_code, 401)
        self.assertEqual(self.c.get("/api/user/progress").status_code, 401)


class NoteTests(ApiTestCase):
    def test_note_round_trip_correct_date_and_user(self):
        nid = self.c.post("/api/user/notes", headers=self.a["h"],
                          json=dict(date="2026-10-20", title="t", body="hello")).get_json()["id"]
        self.c.post("/api/user/notes", headers=self.a["h"], json=dict(date="2026-10-21", body="tomorrow"))
        mine = self.c.get("/api/user/notes?date=2026-10-20", headers=self.a["h"]).get_json()["notes"]
        self.assertEqual([(n["id"], n["note_date"], n["body"]) for n in mine], [(nid, "2026-10-20", "hello")])
        self.assertEqual(len(self.c.get("/api/user/notes", headers=self.a["h"]).get_json()["notes"]), 2)
        self.assertEqual(self.c.get("/api/user/notes", headers=self.b["h"]).get_json()["notes"], [])

    def test_update_with_unchanged_text_is_200_not_404(self):
        nid = self.c.post("/api/user/notes", headers=self.a["h"], json=dict(date="2026-10-20", body="same")).get_json()["id"]
        r = self.c.put(f"/api/user/notes/{nid}", headers=self.a["h"], json=dict(title="", body="same"))
        self.assertEqual(r.status_code, 200)

    def test_bad_note_date_is_400(self):
        r = self.c.post("/api/user/notes", headers=self.a["h"], json=dict(date="31/12/2026", body="x"))
        self.assertEqual(r.status_code, 400)


class IsolationTests(ApiTestCase):
    def test_user_b_cannot_read_change_or_delete_user_a_data(self):
        wid = self.post_workout(self.a).get_json()["id"]
        nid = self.c.post("/api/user/notes", headers=self.a["h"], json=dict(date="2026-10-20", body="private")).get_json()["id"]
        gid = self.c.post("/api/user/goals", headers=self.a["h"],
                          json=dict(title="g", description="d", startDate="2026-10-20", targetDays=21)).get_json()["id"]
        h = self.b["h"]
        self.assertEqual(self.logs(self.b), [])
        self.assertEqual(self.c.delete(f"/api/user/workouts/{wid}", headers=h).status_code, 404)
        self.assertEqual(self.c.put(f"/api/user/notes/{nid}", headers=h, json=dict(body="hacked")).status_code, 404)
        self.assertEqual(self.c.delete(f"/api/user/notes/{nid}", headers=h).status_code, 404)
        self.assertEqual(self.c.delete(f"/api/user/goals/{gid}", headers=h).status_code, 404)
        self.assertEqual(self.c.post(f"/api/user/goals/{gid}/checkins", headers=h, json=dict(date="2026-10-20")).status_code, 404)
        self.assertEqual(self.c.get("/api/user/goals", headers=h).get_json()["goals"], [])
        p = self.c.get("/api/user/progress?today=2026-10-20", headers=h).get_json()["progress"]
        self.assertEqual(p["totals"]["sessions"], 0)
        # ...and A's data is intact
        self.assertEqual(len(self.logs(self.a)), 1)
        self.assertEqual(self.c.get("/api/user/notes", headers=self.a["h"]).get_json()["notes"][0]["body"], "private")

    def test_non_admin_cannot_use_admin_routes(self):
        self.assertEqual(self.c.get("/api/admin/stats", headers=self.a["h"]).status_code, 403)

    def test_admin_stats_minutes_is_a_number(self):
        self.post_workout(self.a, duration=9)
        with connection() as conn:
            cur = conn.cursor(); cur.execute("UPDATE users SET role='admin' WHERE user_id=%s", (self.a["uid"],)); conn.commit(); cur.close()
        m = self.c.get("/api/admin/stats", headers=self.a["h"]).get_json()["metrics"]
        self.assertIsInstance(m["minutes"], int)


class ProgressConsistencyTests(ApiTestCase):
    def test_progress_matches_saved_sessions_and_workout_list(self):
        for d, kw in [("2026-10-20", dict(duration=10, calories=50)),
                      ("2026-10-19", dict(durationSeconds=90, calories=20)),
                      ("2026-10-18", dict(duration=5, calories=10)),
                      ("2026-10-15", dict(duration=5, calories=10)),
                      ("2026-10-20", dict(duration=60, calories=999, isCompleted=False))]:
            self.assertEqual(self.post_workout(self.a, date=d, **kw).status_code, 201)
        p = self.c.get("/api/user/progress?today=2026-10-20", headers=self.a["h"]).get_json()["progress"]
        self.assertEqual(p["streak"]["current"], 3)           # 20, 19, 18 (incomplete + the 15th ignored)
        self.assertEqual(p["weekly"]["sessions"], 2)          # Mon 19 + Tue 20
        self.assertEqual(p["weekly"]["calories"], 70)
        self.assertEqual(p["totals"]["sessions"], 4)
        self.assertEqual(p["totals"]["calories"], 90)
        self.assertEqual(p["totals"]["seconds"], 600 + 90 + 300 + 300)
        listed_completed = [r for r in self.logs(self.a) if r["is_completed"]]
        self.assertEqual(len(listed_completed), p["totals"]["sessions"])
        self.assertEqual(sum(r["calories"] for r in listed_completed), p["totals"]["calories"])

    def test_bad_today_param_is_400(self):
        self.assertEqual(self.c.get("/api/user/progress?today=xx", headers=self.a["h"]).status_code, 400)


class MigrationTests(unittest.TestCase):
    def test_ensure_schema_is_idempotent_and_preserves_rows(self):
        ensure_schema(); ensure_schema()
        with connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() "
                        "AND TABLE_NAME='workout_logs' AND COLUMN_NAME='duration_sec'")
            self.assertEqual(cur.fetchone()[0], 1)
            cur.close()


if __name__ == "__main__":
    unittest.main()
