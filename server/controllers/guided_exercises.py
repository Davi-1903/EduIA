from flask import Blueprint, jsonify, request
from flask_login import login_required

from ai.services.guided_exercises import generate_guided_exercises
from errors.ai import AiInvalidData, AiInvalidResponse, AiProviderUnavailable, AiServiceError, AiTimeout
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from services.guided_exercises import (
    create_guided_exercise_service,
    get_guided_exercise_service,
    get_guided_exercises_service,
)


bp_materials_exercicio_guiado = Blueprint('exercicio_guiado', __name__, url_prefix='/exercicio_guiado')

TIPOS = ('multiple_choice', 'true_or_false', 'discursive')


@bp_materials_exercicio_guiado.route('/', methods=['GET'])
@login_required
def get_guided_exercises():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        exercises = get_guided_exercises_service(cursor, limit)
        return jsonify({'ok': True, **exercises}), 200

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_exercicio_guiado.route('/<int:id>', methods=['GET'])
@login_required
def get_guided_exercise(id: int):
    try:
        exercise = get_guided_exercise_service(id)
        return jsonify({'ok': True, 'material': exercise}), 200

    except MaterialNotFoundError as error:
        return jsonify({'ok': False, 'message': str(error)}), 404

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_exercicio_guiado.route('/', methods=['POST'])
@login_required
def create_guided_exercise():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    tipos = [tipo for tipo in TIPOS if data.get(tipo)]
    if len(tipos) != 1:
        return jsonify({'ok': False, 'message': 'Selecione um único tipo de exercício'}), 400

    try:
        content = generate_guided_exercises({**data, 'type': tipos[0]})
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
        create_guided_exercise_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500