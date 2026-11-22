import unittest
from datetime import date
from services.progress_service import compute_progress

T = date(2026, 10, 20)  # a Tuesday


def log(d, completed=True, minutes=10, sec=None, cal=50):
    return dict(log_date=d, is_completed=completed, duration_min=minutes, duration_sec=sec, calories=cal)


class ProgressServiceTests(unittest.TestCase):
    def test_empty(self):
        p = compute_progress([], T)
        self.assertEqual(p["streak"], {"current": 0, "longest": 0, "lastActiveDate": None})
        self.assertEqual(p["weekly"]["sessions"], 0)

    def test_streak_counts_consecutive_days_ending_today(self):
        rows = [log(date(2026, 10, 20)), log(date(2026, 10, 19)), log(date(2026, 10, 18)), log(date(2026, 10, 15))]
        self.assertEqual(compute_progress(rows, T)["streak"]["current"], 3)

    def test_streak_alive_if_only_yesterday_done(self):
        rows = [log(date(2026, 10, 19)), log(date(2026, 10, 18))]
        self.assertEqual(compute_progress(rows, T)["streak"]["current"], 2)

    def test_streak_broken_after_full_missed_day(self):
        rows = [log(date(2026, 10, 18)), log(date(2026, 10, 17))]
        p = compute_progress(rows, T)
        self.assertEqual(p["streak"]["current"], 0)
        self.assertEqual(p["streak"]["longest"], 2)

    def test_incomplete_sessions_never_count(self):
        rows = [log(date(2026, 10, 20), completed=False), log(date(2026, 10, 19), completed=False)]
        p = compute_progress(rows, T)
        self.assertEqual(p["streak"]["current"], 0)
        self.assertEqual(p["totals"]["sessions"], 0)

    def test_two_sessions_same_day_is_one_streak_day(self):
        rows = [log(date(2026, 10, 20)), log(date(2026, 10, 20)), log(date(2026, 10, 19))]
        p = compute_progress(rows, T)
        self.assertEqual(p["streak"]["current"], 2)
        self.assertEqual(p["totals"]["sessions"], 3)

    def test_weekly_is_monday_to_sunday_of_today(self):
        rows = [log(date(2026, 10, 19)), log(date(2026, 10, 20)),   # Mon, Tue (this week)
                log(date(2026, 10, 18))]                              # Sun (previous week)
        w = compute_progress(rows, T)["weekly"]
        self.assertEqual((w["start"], w["end"]), (date(2026, 10, 19), date(2026, 10, 25)))
        self.assertEqual((w["sessions"], w["activeDays"], w["calories"]), (2, 2, 100))
        self.assertEqual(len(w["days"]), 7)

    def test_actual_seconds_preferred_over_whole_minutes(self):
        rows = [log(T, minutes=1, sec=45), log(T, minutes=10, sec=None)]
        p = compute_progress(rows, T)
        self.assertEqual(p["totals"]["seconds"], 45 + 600)
        self.assertEqual(p["totals"]["minutes"], round(645 / 60))

    def test_future_dated_rows_do_not_extend_streak(self):
        rows = [log(date(2026, 10, 21)), log(date(2026, 10, 20))]
        self.assertEqual(compute_progress(rows, T)["streak"]["current"], 1)


if __name__ == "__main__":
    unittest.main()
