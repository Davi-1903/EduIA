from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

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
        count_stmt = (
            select(func.count())
            .select_from(Historico)
            .join(Historico.material)
            .where(Material.user_id == current_user.id)
        )
        statement = (
            select(Historico)
            .join(Historico.material)
            .where(Historico.user_id == current_user.id)
            .offset(cursor)
            .limit(limit)
            .order_by(Historico.created_at.desc())
        )

        total = session.execute(count_stmt).scalar() or 0
        historico = session.execute(statement).scalars().all()

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
                            'difficulty': item.material.difficulty.value if hasattr(item, 'difficulty') else None,  # type: ignore
                            'amount': item.material.amount if hasattr(item, 'amount') else None,  # type: ignore
                            'grade': item.material.grade if hasattr(item, 'grade') else None,  # type: ignore
                            'chalkboard': item.material.chalkboard if hasattr(item, 'chalkboard') else None,  # type: ignore
                            'projector': item.material.projector if hasattr(item, 'projector') else None,  # type: ignore
                            'printed': item.material.printed if hasattr(item, 'printed') else None,  # type: ignore
                            'digital': item.material.digital if hasattr(item, 'digital') else None,  # type: ignore
                            'created_at': item.material.created_at,
                            'type': item.material.type.value,
                        }
                    }
                    for item in historico
                ],
            }
        ), 200
