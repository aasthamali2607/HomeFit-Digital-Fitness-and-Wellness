import os
import datetime
import decimal
from flask import Flask, jsonify
from flask.json.provider import DefaultJSONProvider
from flask_cors import CORS
from dotenv import load_dotenv
from utils.api_error import ApiError

load_dotenv(override=True)


class HomeFitJSONProvider(DefaultJSONProvider):
    """MySQL DATE -> 'YYYY-MM-DD' (Flask's default is an RFC-822 string that date-keyed
    frontend logic cannot match); DECIMAL (e.g. SUM) -> number, as the Node backend returned."""

    @staticmethod
    def default(o):
        if isinstance(o, datetime.datetime):
            return o.isoformat(sep=" ")
        if isinstance(o, datetime.date):
            return o.isoformat()
        if isinstance(o, decimal.Decimal):
            return int(o) if o == o.to_integral_value() else float(o)
        return DefaultJSONProvider.default(o)


app = Flask(__name__)
app.json = HomeFitJSONProvider(app)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
    "http://localhost:8081",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://homefit-frontend-fx3g.onrender.com"
]
        }
    },
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)

from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.workout_routes import workout_bp
from routes.goal_routes import goal_bp
from routes.note_routes import note_bp
from routes.admin_routes import admin_bp
from routes.progress_routes import progress_bp
from config.db import ensure_schema

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(user_bp, url_prefix="/api/user")
app.register_blueprint(workout_bp, url_prefix="/api/user/workouts")
app.register_blueprint(goal_bp, url_prefix="/api/user/goals")
app.register_blueprint(note_bp, url_prefix="/api/user/notes")
app.register_blueprint(progress_bp, url_prefix="/api/user/progress")
app.register_blueprint(admin_bp, url_prefix="/api/admin")

print("DB HOST:", os.getenv("DB_HOST"))
print("DB PORT:", os.getenv("DB_PORT"))
print("DB USER:", os.getenv("DB_USER"))
print("DB NAME:", os.getenv("DB_NAME"))
print("DB PASSWORD LENGTH:", len(os.getenv("DB_PASSWORD", "")))

try:
    ensure_schema()
    print("DATABASE SCHEMA CHECK SUCCESSFUL")
except Exception:
    app.logger.exception("Could not apply the workout_logs.duration_sec migration")

@app.get("/api/health")
def health():
    return jsonify(
        success=True,
        message="HomeFit API is running"
    )


@app.errorhandler(ApiError)
def handle_api_error(err):
    return jsonify(
        success=False,
        message=err.message
    ), err.status


@app.errorhandler(404)
def not_found(_):
    return jsonify(
        success=False,
        message="Route not found"
    ), 404


@app.errorhandler(Exception)
def handle_error(err):
    app.logger.exception(err)

    return jsonify(
        success=False,
        message=str(err) or "Internal server error"
    ), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )