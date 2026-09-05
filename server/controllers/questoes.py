from flask import Blueprint, jsonify, request
from flask_login import login_required

from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from ia import get_chain
from ia.prompts.questoes import prompt_template, parser
from services.questoes import (
    create_question_service,
    get_question_service,
    get_questions_service,
)


bp_materials_questoes = Blueprint('questoes', __name__, url_prefix='/questoes')


@bp_materials_questoes.route('/', methods=['GET'])
@login_required
def get_questions():
    try:
        cursor = request.args.get('cursor', 0, type=int)
        limit = request.args.get('limit', 50, type=int)

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


@bp_materials_questoes.route('/', methods=['POST'])
@login_required
def create_questions():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        chain = get_chain(prompt_template, parser)
        resposta_json = chain.invoke(
            {
                'disciplina': data['discipline'],
                'quantidade': data['amount'],
                'dificuldade': data['difficulty'],
                'assunto': data['subject'],
                'observacoes': data['note'] if data.get('note') not in (None, '') else 'Não há observações',
            }
        )
    except (KeyError, TypeError, ValueError):
        return jsonify({'ok': False, 'message': 'Dados inválidos para geração de questões'}), 400
    except Exception:
        return jsonify({'ok': False, 'message': 'A geração de questões ainda não foi iniciada'}), 501

    try:
        create_question_service(data, resposta_json)
        return jsonify({'ok': True, 'redirect': '/materials'}), 201

    except MaterialValidationError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
