# HomeFit Python Backend

Python/Flask replacement for the original Express/Node backend. The frontend API contract is intentionally kept the same, so `src/lib/api-client.ts` does not need to change.

## Stack
- Flask
- MySQL Connector/Python
- PyJWT
- bcrypt
- Flask-CORS
- python-dotenv

## Run on Windows PowerShell
```powershell
cd "C:\path\to\HomeFit\backend"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# edit .env with your MySQL credentials
py run.py
```

API: http://localhost:5000/api/health

Keep the existing `database/schema.sql` from HomeFit and the existing `homefit_db` database. This Python backend uses the same tables and endpoint contracts as the original backend.

## Tests
```powershell
python -m unittest discover -s tests -t . -v
```
API tests use the MySQL in `.env`, create their own throw-away users and delete only those users afterwards.

## Notes
- `GET /api/user/progress?today=YYYY-MM-DD` (new, read-only): streak / weekly / totals computed from saved completed sessions.
- `POST /api/user/workouts` also accepts optional `durationSeconds` (exact elapsed time). `GET` now also returns `duration_sec`.
- `GET /api/user/notes?date=YYYY-MM-DD` filters notes to one day (optional).
- Dates are returned as `YYYY-MM-DD`.
- `workout_logs.duration_sec` is added automatically at startup (or run `database/migrations/001_add_workout_duration_seconds.sql`).
