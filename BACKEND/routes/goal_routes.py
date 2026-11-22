from flask import Blueprint
from controllers.goal_controller import (
    list_goals,
    create_goal,
    remove_goal,
    add_checkin,
    remove_checkin
)
from middleware.auth import require_auth

goal_bp = Blueprint("goals", __name__)

goal_bp.get("")(require_auth(list_goals))
goal_bp.post("")(require_auth(create_goal))
goal_bp.delete("/<id>")(require_auth(remove_goal))
goal_bp.post("/<id>/checkins")(require_auth(add_checkin))
goal_bp.delete("/<id>/checkins")(require_auth(remove_checkin))
