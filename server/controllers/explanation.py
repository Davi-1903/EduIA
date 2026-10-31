from flask import Blueprint, jsonify, request
from flask_login import login_required

from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from services.explanation import create_explanation_service, get_explanation_service, get_explanations_service


bp_materials_explicacao = Blueprint('explicacoes', __name__, url_prefix='/explicacoes')


@bp_materials_explicacao.route('/', methods=['GET'])
@login_required
def get_explanations():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        explanations = get_explanations_service(cursor, limit)
        return jsonify({'ok': True, **explanations}), 200
    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_explicacao.route('/<int:id>', methods=['GET'])
@login_required
def get_explanation(id: int):
    try:
        explanation = get_explanation_service(id)
        return jsonify({'ok': True, 'material': explanation}), 200

    except MaterialNotFoundError as error:
        return jsonify({'ok': False, 'message': str(error)}), 404

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_explicacao.route('/', methods=['POST'])
@login_required
def create_explanation():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    content = '# Opa!\n\nConteúdo de teste'

    try:
        create_explanation_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
