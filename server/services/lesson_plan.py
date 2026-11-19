from pathlib import Path

from flask_login import current_user
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.historico import Historico
from models.plano_de_aula import PlanoDeAula
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'lesson-plans.log')


def get_planos_de_aula_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(PlanoDeAula)
            .where(PlanoDeAula.user_id == current_user.id)
            .where(PlanoDeAula.deleted_at.is_(None))
        )
        statement = (
            select(PlanoDeAula)
            .where(PlanoDeAula.user_id == current_user.id)
            .where(PlanoDeAula.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(PlanoDeAula.created_at.desc())
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
                    'grade': material.grade,
                    'time': material.duration,
                    'chalkboard': material.chalkboard,
                    'projector': material.projector,
                    'printed': material.printed,
                    'digital': material.digital,
                    'created_at': material.created_at,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }


def get_plano_de_aula_service(id: int):
    with SessionLocal() as session:
        material = session.get(PlanoDeAula, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Plano de aula não encontrado')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'grade': material.grade,
            'objective': material.objective,
            'duration': material.duration,
            'chalkboard': material.chalkboard,
            'projector': material.projector,
            'printed': material.printed,
            'digital': material.digital,
            'note': material.note,
            'content': material.content,
            'created_at': material.created_at,
            'type': material.type.value,
        }


def create_plano_de_aula_service(data: dict):
    with SessionLocal() as session:
        try:
            lesson_plan = PlanoDeAula(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                grade=data['grade'],
                objective=data['objective'],
                duration=data['duration'],
                chalkboard=data['chalkboard'],
                projector=data['projector'],
                printed=data['printed'],
                digital=data['digital'],
                note=data.get('note') if data.get('note') not in (None, '') else None,
            )
            historico = Historico(material=lesson_plan)
            session.add(lesson_plan)
            session.add(historico)
            session.commit()
            logger.info('Plano de aula salvo no banco de dados')

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar plano de aula no banco de dados')
            raise MaterialServiceError('Ocorreu um erro interno') from exc