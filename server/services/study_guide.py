from pathlib import Path

from flask_login import current_user
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.historico import Historico
from models.roteiros import Roteiro
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'study-guides.log')


def get_study_guides_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Roteiro)
            .where(Roteiro.user_id == current_user.id)
            .where(Roteiro.deleted_at.is_(None))
        )
        statement = (
            select(Roteiro)
            .where(Roteiro.user_id == current_user.id)
            .where(Roteiro.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Roteiro.created_at.desc())
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
                    'note': material.note,
                    'created_at': material.created_at,
                    'content': material.content,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }


def get_study_guide_service(id: int):
    with SessionLocal() as session:
        material = session.get(Roteiro, id)
        if material is None or material.deleted_at is not None or material.user_id != current_user.id:
            raise MaterialNotFoundError('Roteiro não encontrado')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'note': material.note,
            'created_at': material.created_at,
            'content': material.content,
            'type': material.type.value,
        }


def create_study_guide_service(data: dict):
    with SessionLocal() as session:
        try:
            study_guide = Roteiro(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                note=data.get('note') if data.get('note') not in (None, '') else None,
            )
            historico = Historico(material=study_guide)
            session.add(study_guide)
            session.add(historico)
            session.commit()
            logger.info('Roteiro de estudo salvo no banco de dados')

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar roteiro de estudo no banco de dados')
            raise MaterialServiceError('Ocorreu um erro interno') from exc