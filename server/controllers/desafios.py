from flask import Blueprint, jsonify, request
from flask_login import login_required

from ai.services.desafio import generate_desafios
from errors.ai import (
    AiInvalidData,
    AiInvalidResponse,
    AiProviderUnavailable,
    AiServiceError,
    AiTimeout,
)
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from services.desafio import create_desafio_service, get_desafio_service, get_desafios_service


bp_materials_desafio = Blueprint('desafios', __name__, url_prefix='/desafios')


@bp_materials_desafio.route('/', methods=['GET'])
@login_required
def get_desafio():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        desafio = get_desafio_service(cursor, limit)
        return jsonify({'ok': True, **desafio}), 200
    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_desafio.route('/<int:id>', methods=['GET'])
@login_required
def get_flashcard(id: int):
    try:
        desafio = get_desafios_service(id)
        return jsonify({'ok': True, 'material': desafio}), 200

    except MaterialNotFoundError as erro:
        return jsonify({'ok': False, 'message': str(erro)}), 404

    except MaterialServiceError as erro:
        return jsonify({'ok': False, 'message': str(erro)}), 500


@bp_materials_desafio.route('/', methods=['POST'])
@login_required
def create_desafio():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        content = generate_desafios(data)
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
        create_desafio_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500