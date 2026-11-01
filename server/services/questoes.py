from pathlib import Path

from flask_login import current_user
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.historico import Historico
from models.material import Difficulty
from models.questoes import Questoes
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'questions.log')


def get_questions_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Questoes)
            .where(Questoes.user_id == current_user.id)
            .where(Questoes.deleted_at.is_(None))
        )
        statement = (
            select(Questoes)
            .where(Questoes.user_id == current_user.id)
            .where(Questoes.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Questoes.created_at.desc())
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
                    'amount': material.amount,
                    'created_at': material.created_at,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }


def get_question_service(id: int):
    with SessionLocal() as session:
        material = session.get(Questoes, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Questões não encontradas')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'difficulty': material.difficulty.value,
            'content': material.content,
            'amount': material.amount,
            'created_at': material.created_at,
            'type': material.type.value,
        }


def create_question_service(data: dict):
    with SessionLocal() as session:
        try:
            questions = Questoes(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
                note=data.get('note') if data.get('note') not in (None, '') else None,
            )
            historico = Historico(material=questions)
            session.add(questions)
            session.add(historico)
            session.commit()
            logger.info('Material de questões salvo no banco de dados')

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar material de questões no banco de dados')
            raise MaterialServiceError('Ocorreu um erro interno') from exc
