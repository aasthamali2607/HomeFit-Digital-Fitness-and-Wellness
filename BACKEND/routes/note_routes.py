from flask import Blueprint
from controllers.note_controller import (
    list_notes,
    create_note,
    update_note,
    remove_note
)
from middleware.auth import require_auth

note_bp = Blueprint("notes", __name__)

note_bp.get("")(require_auth(list_notes))
note_bp.post("")(require_auth(create_note))
note_bp.put("/<id>")(require_auth(update_note))
note_bp.delete("/<id>")(require_auth(remove_note))