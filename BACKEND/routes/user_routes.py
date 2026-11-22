from flask import Blueprint
from controllers.user_controller import get_profile, update_profile, get_onboarding, update_onboarding
from middleware.auth import require_auth
user_bp=Blueprint("user",__name__)
user_bp.get("/profile")(require_auth(get_profile))
user_bp.put("/profile")(require_auth(update_profile))
user_bp.get("/onboarding")(require_auth(get_onboarding))
user_bp.put("/onboarding")(require_auth(update_onboarding))
