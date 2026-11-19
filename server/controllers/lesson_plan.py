from flask import Blueprint, jsonify, request
from flask_login import login_required

from ai.services.lesson_plan import generate_plano_de_aula
from errors.ai import AiInvalidData, AiInvalidResponse, AiProviderUnavailable, AiServiceError, AiTimeout
from errors.materials import MaterialNotFoundError, MaterialServiceError
from services.lesson_plan import (
    create_plano_de_aula_service,
    get_plano_de_aula_service,
    get_planos_de_aula_service,
)


bp_materials_plano_de_aula = Blueprint('plano_de_aula', __name__, url_prefix='/plano_de_aula')


@bp_materials_plano_de_aula.route('/', methods=['GET'])
@login_required
def get_lesson_plans():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        lesson_plans = get_planos_de_aula_service(cursor, limit)
        return jsonify({'ok': True, **lesson_plans}), 200

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_plano_de_aula.route('/<int:id>', methods=['GET'])
@login_required
def get_lesson_plan(id: int):
    try:
        lesson_plan = get_plano_de_aula_service(id)
        return jsonify({'ok': True, 'material': lesson_plan}), 200

    except MaterialNotFoundError as error:
        return jsonify({'ok': False, 'message': str(error)}), 404

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_plano_de_aula.route('/', methods=['POST'])
@login_required
def create_lesson_plan():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        content = generate_plano_de_aula(data)
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
        create_plano_de_aula_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500