from flask import Blueprint, jsonify, request
from flask_login import login_required

from services.historico import get_historico_service


bp_historico = Blueprint('historico', __name__, url_prefix='/api/historico')


@bp_historico.route('/', methods=['GET'])
@login_required
def get_historico():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        historico = get_historico_service(cursor, limit)
        return jsonify({'ok': True, **historico}), 200

    except Exception as error:
        return jsonify({'ok': False, 'message': str(error)}), 500
