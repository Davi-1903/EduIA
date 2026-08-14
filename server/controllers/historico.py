from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select
from sqlalchemy.orm import with_polymorphic

from database import SessionLocal
from models.historico import Historico
from models.material import Material


bp_historico = Blueprint('historico', __name__, url_prefix='/api/historico')


@bp_historico.route('/', methods=['GET'])
@login_required
def get_historico():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        MaterialPoly = with_polymorphic(Material, '*')

        count_stmt = (
            select(func.count())
            .select_from(Historico)
            .join(Historico.material)
            .where(MaterialPoly.user_id == current_user.id)
        )
        statement = (
            select(Historico)
            .join(Historico.material)
            .where(MaterialPoly.user_id == current_user.id)
            .offset(cursor)
            .limit(limit)
            .order_by(MaterialPoly.created_at.desc())
        )

        total = session.scalar(count_stmt) or 0
        historico = session.scalars(statement).all()

        return jsonify(
            {
                'ok': True,
                'total': total,
                'historico': [
                    {
                        'id': item.id,
                        'material': {
                            'id': item.material.id,
                            'title': item.material.subject,
                            'discipline': item.material.discipline,
                            'difficulty': item.material.difficulty.value if hasattr(item.material, 'difficulty') else None,  # type: ignore
                            'amount': item.material.amount if hasattr(item.material, 'amount') else None,  # type: ignore
                            'time': item.material.time_per_question if hasattr(item.material, 'time_per_question') else None,  # type: ignore
                            'grade': item.material.grade if hasattr(item.material, 'grade') else None,  # type: ignore
                            'chalkboard': item.material.chalkboard if hasattr(item.material, 'chalkboard') else None,  # type: ignore
                            'projector': item.material.projector if hasattr(item.material, 'projector') else None,  # type: ignore
                            'printed': item.material.printed if hasattr(item.material, 'printed') else None,  # type: ignore
                            'digital': item.material.digital if hasattr(item.material, 'digital') else None,  # type: ignore
                            'note': item.material.note if hasattr(item.material, 'note') else None,  # type: ignore
                            'created_at': item.material.created_at,
                            'type': item.material.type.value,
                        },
                    }
                    for item in historico
                ],
            }
        ), 200  # fmt: skip
