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
                            'amount': getattr(item.material, 'amount', None),
                            'time': getattr(item.material, 'time', getattr(item.material, 'duration', None)),
                            'grade': getattr(item.material, 'grade', None),
                            'chalkboard': getattr(item.material, 'chalkboard', None),
                            'projector': getattr(item.material, 'projector', None),
                            'printed': getattr(item.material, 'printed', None),
                            'digital': getattr(item.material, 'digital', None),
                            'objective': getattr(item.material, 'objective', None),
                            'multiple_choice': getattr(item.material, 'multiple_choice', None),
                            'true_or_false': getattr(item.material, 'true_or_false', None),
                            'discursive': getattr(item.material, 'discursive', None),
                            'note': getattr(item.material, 'note', None),
                            'questions': getattr(item.material, 'questions', None),
                            'created_at': item.material.created_at,
                            'type': item.material.type.value,
                        },
                    }
                    for item in historico
                ],
            }
        ), 200  # fmt: skip
