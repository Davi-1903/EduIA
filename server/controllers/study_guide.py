from flask import Blueprint, jsonify, request
from flask_login import login_required

from ai.services.study_guide import generate_study_guide
from errors.ai import AiInvalidData, AiInvalidResponse, AiProviderUnavailable, AiServiceError, AiTimeout
from errors.materials import MaterialNotFoundError, MaterialServiceError
from services.study_guide import (
    create_study_guide_service,
    get_study_guide_service,
    get_study_guides_service,
)


bp_study_guide = Blueprint('roteiro_estudos', __name__, url_prefix='/roteiro')


@bp_study_guide.route('/', methods=['GET'])
@login_required
def get_studys_guides():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        guides = get_study_guides_service(cursor, limit)
        return jsonify({'ok': True, **guides}), 200

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_study_guide.route('/<int:id>', methods=['GET'])
@login_required
def get_study_guide(id: int):
    try:
        guide = get_study_guide_service(id)
        return jsonify({'ok': True, 'status': 200, 'material': guide}), 200

    except MaterialNotFoundError as error:
        return jsonify({'ok': False, 'message': str(error)}), 404

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_study_guide.route('/', methods=['POST'])
@login_required
def create_study_guide():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        content = generate_study_guide(data)
    except AiInvalidData as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except AiInvalidResponse as error:
        return jsonify({'ok': False, 'message': str(error)}), 502
    except AiTimeout as error:
        return jsonify({'ok': False, 'message': str(error)}), 503
    except AiProviderUnavailable as error:
        return jsonify({'ok': False, 'message': str(error)}), 503
    except AiServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500

    try:
        create_study_guide_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500