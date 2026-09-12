from flask import Blueprint, jsonify, request
from flask_login import login_required

from controllers.desafios import bp_materials_desafio
from controllers.explanation import bp_materials_explicacao
from controllers.flashcards import bp_materials_flashcard
from controllers.formulario import bp_materials_formulario
from controllers.guided_exercises import bp_materials_exercicio_guiado
from controllers.lesson_plan import bp_materials_plano_de_aula
from controllers.questoes import bp_materials_questoes
from controllers.quiz import bp_materials_quiz
from controllers.resumos import bp_materials_resumo
from controllers.study_guide import bp_study_guide
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from services.materials import (
    get_materials_service,
    hard_delete_material_service,
    restore_material_service,
    soft_delete_material_service,
)


bp_materials = Blueprint('materials', __name__, url_prefix='/api/materials')
bp_materials.register_blueprint(bp_materials_questoes)
bp_materials.register_blueprint(bp_materials_quiz)
bp_materials.register_blueprint(bp_materials_explicacao)
bp_materials.register_blueprint(bp_materials_resumo)
bp_materials.register_blueprint(bp_materials_desafio)
bp_materials.register_blueprint(bp_materials_formulario)
bp_materials.register_blueprint(bp_materials_plano_de_aula)
bp_materials.register_blueprint(bp_materials_exercicio_guiado)
bp_materials.register_blueprint(bp_study_guide)
bp_materials.register_blueprint(bp_materials_flashcard)


@bp_materials.route('/', methods=['GET'])
@login_required
def get_materials():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)
    search = request.args.get('search', '')
    discipline = request.args.get('discipline', 'all')
    difficulty = request.args.get('difficulty', 'all')
    type_ = request.args.get('type', 'all')

    try:
        materials = get_materials_service(cursor, limit, type_, difficulty, discipline, search)
        return jsonify({'ok': True, **materials}), 200

    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400

    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500


@bp_materials.route('/<int:id>', methods=['DELETE'])
@login_required
def soft_delete_material(id: int):
    try:
        soft_delete_material_service(id)
        return jsonify({'ok': True}), 200

    except MaterialNotFoundError:
        return jsonify({'ok': False, 'message': 'Material não encontrado'}), 404

    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500


@bp_materials.route('/<int:id>/restore', methods=['PATCH'])
@login_required
def restore_material(id: int):
    try:
        restore_material_service(id)
        return jsonify({'ok': True}), 200

    except MaterialNotFoundError:
        return jsonify({'ok': False, 'message': 'Material não encontrado'}), 404

    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500


@bp_materials.route('/<int:id>/trash', methods=['DELETE'])
@login_required
def hard_delete_material(id: int):
    try:
        hard_delete_material_service(id)
        return jsonify({'ok': True}), 200

    except MaterialNotFoundError:
        return jsonify({'ok': False, 'message': 'Material não encontrado'}), 404

    except MaterialServiceError:
        return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
