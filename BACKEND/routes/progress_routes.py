from flask import Blueprint
from controllers.progress_controller import get_progress
from middleware.auth import require_auth

progress_bp = Blueprint("progress", __name__)

progress_bp.get("")(require_auth(get_progress))
