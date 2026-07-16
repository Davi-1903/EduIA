from flask import Blueprint, jsonify
from flask_login import current_user, login_required


bp_user = Blueprint("user", __name__, url_prefix="/api/user")


@bp_user.route("", methods=["GET"])
@login_required
def get_user():
    return jsonify(
        {
            "ok": True,
            "user": {
                "id": current_user.id,
                "nome": current_user.name,
                "email": current_user.email,
                "tipo": current_user.type.value,
            },
        }
    ), 200
