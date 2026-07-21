from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import select, func
from database import SessionLocal
from models.material import Material


bp_materials = Blueprint('materials', __name__, url_prefix='/api/materials')


@bp_materials.route('', methods=['GET'])
@login_required
def get_materials():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = select(func.count()).select_from(Material).where(Material.user_id == current_user.id)
        stmt = (
            select(Material)
            .where(Material.user_id == current_user.id)
            .offset(cursor)
            .limit(limit)
            .order_by(Material.created_at.desc())
        )
        total = session.execute(count_stmt).scalar() or 0
        materials = session.execute(stmt).scalars().all()

        return jsonify(
            {
                'ok': True,
                'total': int(total),
                'materials': [
                    {
                        'id': material.id,
                        'title': material.subject,
                        'discipline': material.discipline,
                        'difficulty': material.difficulty.value if hasattr(material, 'difficulty') else None,  # type: ignore
                        'amount': material.amount if hasattr(material, 'amount') else None,  # type: ignore
                        'datetime': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200
