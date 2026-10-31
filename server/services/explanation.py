from pathlib import Path

from flask_login import current_user
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.explicacoes import Explicacao
from models.historico import Historico
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'explanations.log')


def get_explanations_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Explicacao)
            .where(Explicacao.user_id == current_user.id)
            .where(Explicacao.deleted_at.is_(None))
        )
        statement = (
            select(Explicacao)
            .where(Explicacao.user_id == current_user.id)
            .where(Explicacao.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Explicacao.created_at.desc())
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
                    'content': material.content,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }


def get_explanation_service(id: int):
    with SessionLocal() as session:
        material = session.get(Explicacao, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Explicação não encontrada')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'content': material.content,
            'created_at': material.created_at,
            'type': material.type.value,
        }


def create_explanation_service(data: dict):
    with SessionLocal() as session:
        try:
            explanation = Explicacao(
                user_id=current_user.id,
                discipline=data['discipline'],
                questions=data['questions'],
                subject=data['subject'],
                content={'content': 1},
            )
            historico = Historico(material=explanation)
            session.add(explanation)
            session.add(historico)
            session.commit()
            logger.info('Explicação salva no banco de dados')

        except Exception as exc:
            session.rollback()
            logger.error('Falha ao salvar explicação no banco de dados')
            raise MaterialServiceError('Ocorreu um erro interno') from exc
