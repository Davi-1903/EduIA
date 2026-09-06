from flask_login import current_user
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.historico import Historico
from models.material import Difficulty
from models.quizzes import Quiz


def get_quizzes_service(cursor: int, limit: int):
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

        return {
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


def get_quiz_service(id: int):
    with SessionLocal() as session:
        material = session.get(Quiz, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Quiz não encontrado')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'difficulty': material.difficulty.value,
            'timer_per_question': material.time_per_question,
            'amount': material.amount,
            'content': material.content,
            'created_at': material.created_at,
            'type': material.type.value,
        }


def create_quiz_service(data: dict):
    with SessionLocal() as session:
        try:
            quiz = Quiz(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                difficulty=Difficulty(data['difficulty']),
                time_per_question=data['time_per_question'],
                amount=data['amount'],
                note=data['note'] if data['note'] != '' else None,
            )
            historico = Historico(material=quiz)
            session.add(quiz)
            session.add(historico)
            session.commit()

        except Exception as exc:
            session.rollback()
            raise MaterialServiceError('Ocorreu um erro interno') from exc
