from pathlib import Path

from flask_login import current_user
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.historico import Historico
from models.resumos import Resumo
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'summaries.log')


def get_resumes_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Resumo)
            .where(Resumo.user_id == current_user.id)
            .where(Resumo.deleted_at.is_(None))
        )
        statement = (
            select(Resumo)
            .where(Resumo.user_id == current_user.id)
            .where(Resumo.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Resumo.created_at.desc())
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
                    'created_at': material.created_at,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }


def get_resume_service(id: int):
    with SessionLocal() as session:
        material = session.get(Resumo, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Resumo não encontrado')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'content': material.content,
            'created_at': material.created_at,
            'type': material.type.value,
        }


def create_resume_service(data: dict):
    with SessionLocal() as session:
        try:
            resume = Resumo(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},
                note=data['note'] if data['note'] != '' else None,
            )
            historico = Historico(material=resume)
            session.add(resume)
            session.add(historico)
            session.commit()
            logger.info('Resumo salvo no banco de dados')
        
        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar resumo no banco de dados')
            raise MaterialServiceError('Ocorreu um erro interno') from exc
