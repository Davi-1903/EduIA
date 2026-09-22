from flask import Blueprint, jsonify, request
from flask_login import login_required

from ai.services.flashcards import generate_flashcards
from errors.ai import (
    AiInvalidData,
    AiInvalidResponse,
    AiProviderUnavailable,
    AiServiceError,
    AiTimeout,
)
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from services.flashcards import create_flashcard_service, get_flashcard_service, get_flashcards_service


bp_materials_flashcards = Blueprint('flashcards', __name__, url_prefix='/flashcards')


@bp_materials_flashcards.route('/', methods=['GET'])
@login_required
def get_flashcards():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        flashcards = get_flashcards_service(cursor, limit)
        return jsonify({'ok': True, **flashcards}), 200
    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_flashcards.route('/<int:id>', methods=['GET'])
@login_required
def get_flashcard(id: int):
    try:
        flashcards = get_flashcard_service(id)
        return jsonify({'ok': True, 'material': flashcards}), 200

    except MaterialNotFoundError as erro:
        return jsonify({'ok': False, 'message': str(erro)}), 404

    except MaterialServiceError as erro:
        return jsonify({'ok': False, 'message': str(erro)}), 500


@bp_materials_flashcards.route('/', methods=['POST'])
@login_required
def create_flashcards():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        content = generate_flashcards(data)
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
        create_flashcard_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
