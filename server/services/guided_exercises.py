from pathlib import Path

from flask_login import current_user
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.exercicios_guiados import ExercicioGuiado
from models.historico import Historico
from models.material import Difficulty
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'guided-exercises.log')


def get_guided_exercises_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(ExercicioGuiado)
            .where(ExercicioGuiado.user_id == current_user.id)
            .where(ExercicioGuiado.deleted_at.is_(None))
        )
        statement = (
            select(ExercicioGuiado)
            .where(ExercicioGuiado.user_id == current_user.id)
            .where(ExercicioGuiado.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(ExercicioGuiado.created_at.desc())
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


def get_guided_exercise_service(id: int):
    with SessionLocal() as session:
        material = session.get(ExercicioGuiado, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Exercício guiado não encontrado')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'difficulty': material.difficulty.value,
            'amount': material.amount,
            'resolution': material.resolution,
            'theory': material.theory,
            'multiple_choice': material.multiple_choice,
            'true_or_false': material.true_or_false,
            'discursive': material.discursive,
            'interpretation': material.interpretation,
            'code': material.code,
            'note': material.note,
            'content': material.content,
            'created_at': material.created_at,
            'type': material.type.value,
        }


def create_guided_exercise_service(data: dict):
    with SessionLocal() as session:
        try:
            tipo = data['content']['type']
            guided_exercise = ExercicioGuiado(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
                resolution=data['resolution'],
                theory=data['theory'],
                multiple_choice=tipo == 'multiple_choice',
                true_or_false=tipo == 'true_or_false',
                discursive=tipo == 'discursive',
                interpretation=data['interpretation'],
                code=data['code'],
                note=data.get('note') if data.get('note') not in (None, '') else None,
            )
            historico = Historico(material=guided_exercise)
            session.add(guided_exercise)
            session.add(historico)
            session.commit()
            logger.info('Exercício guiado salvo no banco de dados')

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar exercício guiado no banco de dados')
            raise MaterialServiceError('Ocorreu um erro interno') from exc
