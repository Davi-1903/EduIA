from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.quizzes import Quiz
from models.material import Difficulty
from models.historico import Historico


bp_materials_quiz = Blueprint('quiz', __name__, url_prefix='/quiz')


@bp_materials_quiz.route('/', methods=['GET'])
@login_required
def get_quizzes():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Quiz)
            .where(Quiz.user_id == current_user.id)
            .where(Quiz.deleted_at.is_(None))
        )
        statement = (
            select(Quiz)
            .where(Quiz.user_id == current_user.id)
            .where(Quiz.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Quiz.created_at.desc())
        )

        total = session.scalar(count_stmt) or 0
        materials = session.scalars(statement).all()

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
                        'timer_per_question': material.time_per_question,
                        'amount': material.amount,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_quiz.route('/<int:id>', methods=['GET'])
@login_required
def get_quiz(id: int):
    with SessionLocal() as session:
        material = session.get(Quiz, id)
        if material is None or material is not None:
            return jsonify({'ok': False, 'message': 'Quiz não encontradas'}), 404

        return jsonify(
            {
                'ok': True,
                'material': {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'difficulty': material.difficulty.value,
                    'timer_per_question': material.time_per_question,
                    'amount': material.amount,
                    'content': material.content,
                    'created_at': material.created_at,
                    'type': material.type.value,
                },
            }
        ), 200


@bp_materials_quiz.route('/', methods=['POST'])
@login_required
def create_quiz():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    # Lógica da IA...

    with SessionLocal() as session:
        try:
            quiz = Quiz(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},  # Respota da IA
                difficulty=Difficulty(data['difficulty']),
                time_per_question=data['time_per_question'],
                amount=data['amount'],
                note=data['note'] if data['note'] != '' else None,
            )
            historico = Historico(material=quiz)
            session.add(quiz)
            session.add(historico)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
