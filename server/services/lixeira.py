from flask_login import current_user
from sqlalchemy import func, select
from sqlalchemy.orm import with_polymorphic

from database import SessionLocal
from models.material import Material


def get_lixeira_service(cursor: int, limit: int):
    with SessionLocal() as session:
        MaterialPoly = with_polymorphic(Material, '*')

        count_stmt = (
            select(func.count())
            .select_from(MaterialPoly)
            .where(MaterialPoly.user_id == current_user.id)
            .where(MaterialPoly.deleted_at.is_not(None))
        )
        statement = (
            select(MaterialPoly)
            .where(MaterialPoly.user_id == current_user.id)
            .where(MaterialPoly.deleted_at.is_not(None))
            .offset(cursor)
            .limit(limit)
            .order_by(MaterialPoly.created_at.desc())
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
                    'difficulty': material.difficulty.value if hasattr(material, 'difficulty') else None,  # type: ignore
                    'amount': getattr(material, 'amount', None),
                    'grade': getattr(material, 'grade', None),
                    'chalkboard': getattr(material, 'chalkboard', None),
                    'projector': getattr(material, 'projector', None),
                    'printed': getattr(material, 'printed', None),
                    'digital': getattr(material, 'digital', None),
                    'created_at': material.created_at,
                    'deleted_at': material.deleted_at,
                    'type': material.type.value,
                }
                for material in materials
            ],
        }
