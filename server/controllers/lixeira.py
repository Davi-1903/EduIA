from flask import Blueprint, jsonify, request
from flask_login import login_required

from services.lixeira import get_lixeira_service


bp_lixeira = Blueprint('lixeira', __name__, url_prefix='/api/trash')


@bp_lixeira.route('/', methods=['GET'])
@login_required
def get_deleted_materials():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        lixeira = get_lixeira_service(cursor, limit)
        return jsonify({'ok': True, **lixeira}), 200

    except Exception as error:
        return jsonify({'ok': False, 'message': str(error)}), 500
