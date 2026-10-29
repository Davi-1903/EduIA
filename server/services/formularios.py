from flask_login import current_user
from sqlalchemy import func, select

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError
from models.formularios import Formulario
from models.historico import Historico
from models.material import Difficulty


def get_formularios_service(cursor: int, limit: int):
    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Formulario)
            .where(Formulario.user_id == current_user.id)
            .where(Formulario.deleted_at.is_(None))
        )
        statement = (
            select(Formulario)
            .where(Formulario.user_id == current_user.id)
            .where(Formulario.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Formulario.created_at.desc())
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


def get_formulario_service(id: int):
    with SessionLocal() as session:
        material = session.get(Formulario, id)
        if material is None or material.deleted_at is not None:
            return MaterialNotFoundError('Formulário não encontrados')

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
        


def create_formulario_service(data: dict):
    with SessionLocal() as session:
        try:
            formularios = Formulario(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'], 
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
            )
            historico = Historico(material=formularios)
            session.add(formularios)
            session.add(historico)
            session.commit()

        except Exception as exc:
            session.rollback()
            raise MaterialServiceError('Ocorreu um erro interno') from exc
