from flask import Blueprint, jsonify, request
from flask_login import login_required

from ai.services.formularios import generate_formularios
from errors.ai import AiInvalidData, AiInvalidResponse, AiProviderUnavailable, AiServiceError, AiTimeout
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from services.formularios import create_formulario_service, get_formulario_service, get_formularios_service


bp_materials_formulario = Blueprint('formularios', __name__, url_prefix='/formulario')


@bp_materials_formulario.route('/', methods=['GET'])
@login_required
def get_formularios():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    try:
        formularios = get_formularios_service(cursor, limit)
        return jsonify({'ok': True, **formularios}), 200
    except MaterialServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500


@bp_materials_formulario.route('/<int:id>', methods=['GET'])
@login_required
def get_formulario(id: int):
    try:
        formularios = get_formulario_service(id)
        return jsonify({'ok': True, 'material': formularios}), 200

    except MaterialNotFoundError as erro:
        return jsonify({'ok': False, 'message': str(erro)}), 404

    except MaterialServiceError as erro:
        return jsonify({'ok': False, 'message': str(erro)}), 500


@bp_materials_formulario.route('/', methods=['POST'])
@login_required
def create_formularios():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        content = generate_formularios(data)
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
        create_formulario_service({**data, 'content': content})
        return jsonify({'ok': True, 'redirect': '/materials'}), 201
    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
