from flask import Blueprint
from controllers.workout_controller import (
    list_workouts,
    create_workout,
    remove_workout
)
from middleware.auth import require_auth

workout_bp = Blueprint("workouts", __name__)

workout_bp.get("")(require_auth(list_workouts))
workout_bp.post("")(require_auth(create_workout))
workout_bp.delete("/<id>")(require_auth(remove_workout))