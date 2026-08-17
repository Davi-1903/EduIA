from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select
from sqlalchemy.orm import with_polymorphic

from database import SessionLocal
from models.material import Material


bp_lixeira = Blueprint('lixeira', __name__, url_prefix='/api/trash')


@bp_lixeira.route('/', methods=['GET'])
@login_required
def get_deleted_materials():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

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

        return jsonify(
            {
                'ok': True,
                'total': total,
                'materials': [
                    {
                        'id': material.id,
                        'title': material.subject,
                        'discipline': material.discipline,
                        'difficulty': material.difficulty.value if hasattr(material, 'difficulty') else None,  # type: ignore
                        'amount': material.amount if hasattr(material, 'amount') else None,  # type: ignore
                        'grade': material.grade if hasattr(material, 'grade') else None,  # type: ignore
                        'chalkboard': material.chalkboard if hasattr(material, 'chalkboard') else None,  # type: ignore
                        'projector': material.projector if hasattr(material, 'projector') else None,  # type: ignore
                        'printed': material.printed if hasattr(material, 'printed') else None,  # type: ignore
                        'digital': material.digital if hasattr(material, 'digital') else None,  # type: ignore
                        'created_at': material.created_at,
                        'deleted_at': material.deleted_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200
