from flask import Blueprint, jsonify, request
from flask_login import login_required

from errors.ai import (
    AiInvalidData,
    AiInvalidResponse,
    AiProviderUnavailable,
    AiServiceError,
    AiTimeout,
)
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from ai.services.questoes import generate_questions
from services.questoes import (
    create_question_service,
    get_question_service,
    get_questions_service,
)


bp_materials_questoes = Blueprint('questoes', __name__, url_prefix='/questoes')


@bp_materials_questoes.route('/', methods=['GET'])
@login_required
def get_questions():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        questions = get_questions_service(cursor, limit)
        return jsonify({'ok': True, **questions}), 200

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_questoes.route('/<int:id>', methods=['GET'])
@login_required
def get_question(id: int):
    try:
        questions = get_question_service(id)
        return jsonify({'ok': True, 'material': questions}), 200

    except MaterialNotFoundError as erro:
        return jsonify({'ok': False, 'message': str(erro)}), 404

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_questoes.route('/', methods=['POST'])
@login_required
def create_questions():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        content = generate_questions(data)
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
        create_question_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
