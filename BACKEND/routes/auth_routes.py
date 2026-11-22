from flask import Blueprint

from controllers.auth_controller import (
    register,
    login,
    logout,
    me
)

from middleware.auth import require_auth

auth_bp = Blueprint("auth", __name__)

auth_bp.post("/register")(register)
auth_bp.post("/login")(login)
auth_bp.post("/logout")(require_auth(logout))
auth_bp.get("/me")(require_auth(me))