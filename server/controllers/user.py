from flask import Blueprint, jsonify
from flask_login import current_user, login_required

from errors.user import UserServiceError
from services.user import get_progress_service


bp_user = Blueprint('user', __name__, url_prefix='/api/user')


@bp_user.route('', methods=['GET'])
@login_required
def get_user():
    return jsonify(
        {
            'ok': True,
            'user': {
                'id': current_user.id,
                'nome': current_user.name,
                'email': current_user.email,
                'tipo': current_user.type.value,
                'foto': current_user.foto,
            },
        }
    ), 200


@bp_user.route('/progresso', methods=['GET'])
@login_required
def get_progresso():
    try:
        progress = get_progress_service(current_user.id, current_user.type)
        return jsonify(progress), 200

    except UserServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500
