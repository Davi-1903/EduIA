from flask_login import current_user
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import (
    MaterialNotFoundError,
    MaterialServiceError,
    MaterialValidationError,
)
from models.desafios import Desafio
from models.historico import Historico
from models.material import Difficulty


def get_desafio_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Desafio)
            .where(Desafio.user_id == current_user.id)
            .where(Desafio.deleted_at.is_(None))
        )
        statement = (
            select(Desafio)
            .where(Desafio.user_id == current_user.id)
            .where(Desafio.deleted_at.is_(None))
            .order_by(Desafio.created_at.desc(), Desafio.id.desc())
            .offset(cursor)
            .limit(limit)
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
                    'created_at': material.created_at,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }


def get_desafios_service(id: int):
    with SessionLocal() as session:
        material = session.get(Desafio, id)
        if (
            material is None
            or material.deleted_at is not None
            or material.user_id != current_user.id
        ):
            raise MaterialNotFoundError('Desafio não encontrado')

        return {
            'id': material.id,
            'title': material.subject,
            'discipline': material.discipline,
            'difficulty': material.difficulty.value,
            'content': material.content,
            'created_at': material.created_at,
            'type': material.type.value,
        }


def create_desafio_service(data: dict):
    with SessionLocal() as session:
        try:
            desafios = Desafio(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
            )
            historico = Historico(material=desafios)
            session.add(desafios)
            session.add(historico)
            session.commit()

        except (KeyError, ValueError) as exc:
            session.rollback()
            raise MaterialValidationError('Dados inválidos') from exc

        except Exception as exc:
            session.rollback()
            raise MaterialServiceError('Ocorreu um erro interno') from exc