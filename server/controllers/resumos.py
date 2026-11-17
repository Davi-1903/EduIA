from flask import Blueprint, jsonify, request
from flask_login import login_required

from ai.services.resumos import generate_resumos
from errors.ai import AiInvalidData, AiInvalidResponse, AiProviderUnavailable, AiServiceError, AiTimeout
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from services.resumos import create_resume_service, get_resume_service, get_resumes_service


bp_materials_resumo = Blueprint('resumo', __name__, url_prefix='/resumo')


@bp_materials_resumo.route('/', methods=['GET'])
@login_required
def get_resumes():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        resumos = get_resumes_service(cursor, limit)
        return jsonify({'ok': True, **resumos}), 200

    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_resumo.route('/<int:id>', methods=['GET'])
@login_required
def get_resume(id: int):
    try:
        resume = get_resume_service(id)
        return jsonify({'ok': True, 'material': resume}), 200

    except MaterialNotFoundError as err:
        return jsonify({'ok': False, 'message': str(err)}), 404

    except MaterialServiceError as err:
        return jsonify({'ok': False, 'message': str(err)}), 500


@bp_materials_resumo.route('/', methods=['POST'])
@login_required
def create_resume():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        content = generate_resumos(data)
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
        create_resume_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
