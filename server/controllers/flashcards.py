from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.flashcards import FlashCards
from models.historico import Historico
from models.material import Difficulty


bp_materials_flashcard = Blueprint('flashcard', __name__, url_prefix='/flashcard')


@bp_materials_flashcard.route('/', methods=['GET'])
@login_required
def get_flashcards():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(FlashCards)
            .where(FlashCards.user_id == current_user.id)
            .where(FlashCards.deleted_at.is_(None))
        )
        statement = (
            select(FlashCards)
            .where(FlashCards.user_id == current_user.id)
            .where(FlashCards.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(FlashCards.created_at.desc())
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
                        'amount': material.amount,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_flashcard.route('/<int:id>', methods=['GET'])
@login_required
def get_flashcard(id: int):
    with SessionLocal() as session:
        material = session.get(FlashCards, id)
        if material is None or material.deleted_at is not None:
            return jsonify({'ok': False, 'message': 'Flashcard não encontrado'}), 404

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


@bp_materials_flashcard.route('/', methods=['POST'])
@login_required
def create_flashcard():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    # Lógica da IA...

    with SessionLocal() as session:
        try:
            flashcards = FlashCards(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},  # Respota da IA
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
            )
            historico = Historico(material=flashcards)
            session.add(flashcards)
            session.add(historico)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
