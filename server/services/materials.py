import re
from datetime import datetime, timezone

from flask_login import current_user
from sqlalchemy import func, or_, select
from sqlalchemy.dialects.mysql import match
from sqlalchemy.orm import with_polymorphic

from database import SessionLocal
from errors.materials import MaterialNotFoundError, MaterialServiceError, MaterialValidationError
from models.material import Difficulty, Material, MaterialType


def to_boolean_prefix_search(term: str) -> str:
    sanitized = re.sub(r'[+\-<>()~*"@]', ' ', term)
    words = sanitized.split()
    return ' '.join(f'+{w}*' for w in words)


def get_materials_service(cursor: int, limit: int, type_: str, difficulty: str, discipline: str, search: str):
    with SessionLocal() as session:
        MaterialPoly = with_polymorphic(Material, '*')

        count_stmt = (
            select(func.count())
            .select_from(MaterialPoly)
            .where(MaterialPoly.user_id == current_user.id)
            .where(MaterialPoly.deleted_at.is_(None))
        )
        statement = (
            select(MaterialPoly)
            .where(MaterialPoly.user_id == current_user.id)
            .where(MaterialPoly.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(MaterialPoly.created_at.desc())
        )

        # ========================= FILTROS =========================
        if type_ != 'all':
            try:
                material_type = MaterialType(type_)
                statement = statement.where(MaterialPoly.type == material_type)
                count_stmt = count_stmt.where(MaterialPoly.type == material_type)
            except ValueError as exc:
                raise MaterialValidationError(f'Tipo inválido: {type_}') from exc

        if difficulty != 'all':
            try:
                conditions = []
                for mapper in Material.__mapper__.self_and_descendants:
                    cls = mapper.class_
                    if hasattr(cls, 'difficulty'):
                        conditions.append(getattr(MaterialPoly, cls.__name__).difficulty == Difficulty(difficulty))
                statement = statement.where(or_(*conditions))
                count_stmt = count_stmt.where(or_(*conditions))
            except ValueError as exc:
                raise MaterialValidationError(f'Dificuldade inválida: {difficulty}') from exc

        if discipline != 'all':
            statement = statement.where(MaterialPoly.discipline == discipline)
            count_stmt = count_stmt.where(MaterialPoly.discipline == discipline)

        if search != '':
            search_term = to_boolean_prefix_search(search)
            if search_term:
                score = match(MaterialPoly.discipline, MaterialPoly.subject, against=search_term, in_boolean_mode=True)
                statement = statement.where(score).order_by(score.desc())
                count_stmt = count_stmt.where(score)

        total = session.scalar(count_stmt) or 0
        materials = session.scalars(statement).all()

        return {
            'total': total,
            'materials': [
                {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'difficulty': material.difficulty.value if hasattr(material, 'difficulty') else None,  # type: ignore
                    'amount': getattr(material, 'amount', None),
                    'grade': getattr(material, 'grade', None),
                    'time': getattr(material, 'time_per_question', None),
                    'chalkboard': getattr(material, 'chalkboard', None),
                    'projector': getattr(material, 'projector', None),
                    'printed': getattr(material, 'printed', None),
                    'digital': getattr(material, 'digital', None),
                    'created_at': material.created_at,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }


def soft_delete_material_service(id: int):
    with SessionLocal() as session:
        material = session.get(Material, id)
        if material is None or material.deleted_at is not None:
            raise MaterialNotFoundError('Material não encontrado')

        try:
            material.deleted_at = datetime.now(timezone.utc)
            session.commit()

        except Exception as exc:
            session.rollback()
            raise MaterialServiceError('Ocorreu um erro interno') from exc


def restore_material_service(id: int):
    with SessionLocal() as session:
        material = session.get(Material, id)
        if material is None or material.deleted_at is None:
            raise MaterialNotFoundError('Material não encontrado')

        try:
            material.deleted_at = None
            session.commit()

        except Exception as exc:
            session.rollback()
            raise MaterialServiceError('Ocorreu um erro interno') from exc


def hard_delete_material_service(id: int):
    with SessionLocal() as session:
        material = session.get(Material, id)
        if material is None or material.deleted_at is None:
            raise MaterialNotFoundError('Material não encontrado')

        try:
            session.delete(material)
            session.commit()

        except Exception as exc:
            session.rollback()
            raise MaterialServiceError('Ocorreu um erro interno') from exc
