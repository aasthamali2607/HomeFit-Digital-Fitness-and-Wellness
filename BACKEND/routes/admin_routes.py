from flask import Blueprint
from controllers.admin_controller import stats, list_content, upsert_content, remove_content
from middleware.auth import require_auth, require_admin
admin_bp=Blueprint("admin",__name__)
admin_bp.get("/stats")(require_auth(require_admin(stats)))
admin_bp.get("/content")(require_auth(require_admin(list_content)))
admin_bp.put("/content")(require_auth(require_admin(upsert_content)))
admin_bp.delete("/content/<id>")(require_auth(require_admin(remove_content)))
