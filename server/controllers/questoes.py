from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.questoes import Questoes
from models.material import Difficulty


bp_materials_questoes = Blueprint('questoes', __name__, url_prefix='/questoes')


@bp_materials_questoes.route('/', methods=['GET'])
@login_required
def get_questions():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = select(func.count()).select_from(Questoes).where(Questoes.user_id == current_user.id)
        statement = (
            select(Questoes)
            .where(Questoes.user_id == current_user.id)
            .offset(cursor)
            .limit(limit)
            .order_by(Questoes.created_at.desc())
        )

        total = session.execute(count_stmt).scalar() or 0
        materials = session.execute(statement).scalars().all()

        return jsonify(
            {
                'ok': True,
                'total': total,
                'materials': [
                    {
                        'id': material.id,
                        'title': material.subject,
                        'discipline': material.discipline,
                        'difficulty': material.difficulty.value,
                        'amount': material.amount,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_questoes.route('/<int:id>', methods=['GET'])
@login_required
def get_question(id: int):
    with SessionLocal() as session:
        material = session.get(Questoes, id)
        if material is None:
            return jsonify({'ok': False, 'message': 'Questões não encontradas'}), 404

        return jsonify(
            {
                'ok': True,
                'material': {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'difficulty': material.difficulty.value,
                    'content': material.content,
                    'amount': material.amount,
                    'created_at': material.created_at,
                    'type': material.type.value,
                },
            }
        ), 200


@bp_materials_questoes.route('/', methods=['POST'])
@login_required
def create_questions():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    # Lógica da IA...

    with SessionLocal() as session:
        try:
            questions = Questoes(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},  # Respota da IA
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
                note=data['note'] if data['note'] != '' else None,
            )
            session.add(questions)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
