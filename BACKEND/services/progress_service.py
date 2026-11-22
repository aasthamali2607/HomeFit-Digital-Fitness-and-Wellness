from datetime import timedelta


def _seconds(row):
    # Prefer the exact elapsed seconds; fall back to whole minutes for older rows.
    sec = row.get("duration_sec")
    return int(sec) if sec is not None else int(row.get("duration_min") or 0) * 60


def compute_progress(rows, today):
    """Derive streak / weekly / totals ONLY from recorded, completed sessions.

    rows  : dicts with log_date (date), is_completed, duration_min, duration_sec, calories
    today : the client's local calendar date (datetime.date)

    Definitions
    - A "day" is active when it has >= 1 completed session.
    - Current streak: consecutive active days ending today; if today has no session yet,
      the streak is still alive when yesterday was active (it only breaks after a full missed day).
    - Week: Monday..Sunday containing `today`.
    """
    days = {}
    for r in rows:
        if not r.get("is_completed"):
            continue
        d = days.setdefault(r["log_date"], {"sessions": 0, "seconds": 0, "calories": 0})
        d["sessions"] += 1
        d["seconds"] += _seconds(r)
        d["calories"] += int(r.get("calories") or 0)

    active = sorted(x for x in days if x <= today)

    anchor = today if today in days else today - timedelta(days=1)
    current = 0
    cursor = anchor
    while cursor in days:
        current += 1
        cursor -= timedelta(days=1)

    longest = run = 0
    prev = None
    for d in active:
        run = run + 1 if prev is not None and d - prev == timedelta(days=1) else 1
        longest = max(longest, run)
        prev = d

    week_start = today - timedelta(days=today.weekday())
    week_days = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        v = days.get(day, {"sessions": 0, "seconds": 0, "calories": 0})
        week_days.append({"date": day, "sessions": v["sessions"],
                          "minutes": round(v["seconds"] / 60), "calories": v["calories"]})
    in_week = week_days
    week_seconds = sum(days[week_start + timedelta(days=i)]["seconds"]
                       for i in range(7) if (week_start + timedelta(days=i)) in days)

    total_seconds = sum(v["seconds"] for v in days.values())
    return {
        "today": today,
        "streak": {"current": current, "longest": longest,
                   "lastActiveDate": active[-1] if active else None},
        "weekly": {
            "start": week_start, "end": week_start + timedelta(days=6),
            "sessions": sum(v["sessions"] for v in in_week),
            "minutes": round(week_seconds / 60),
            "calories": sum(v["calories"] for v in in_week),
            "activeDays": sum(1 for v in in_week if v["sessions"] > 0),
            "days": week_days,
        },
        "totals": {
            "sessions": sum(v["sessions"] for v in days.values()),
            "seconds": total_seconds,
            "minutes": round(total_seconds / 60),
            "calories": sum(v["calories"] for v in days.values()),
            "activeDays": len(days),
        },
    }
