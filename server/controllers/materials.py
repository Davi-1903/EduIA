from time import sleep

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import or_, select, func
from sqlalchemy.orm import with_polymorphic
from database import SessionLocal
from models.material import Difficulty, Material, MaterialType


bp_materials = Blueprint('materials', __name__, url_prefix='/api/materials')


@bp_materials.route('', methods=['GET'])
@login_required
def get_materials():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)
    search = request.args.get('search', '')
    discipline = request.args.get('discipline', 'all')
    difficulty = request.args.get('difficulty', 'all')
    type_ = request.args.get('type', 'all')

    with SessionLocal() as session:
        MaterialPoly = with_polymorphic(Material, '*')

        count_stmt = select(func.count()).select_from(MaterialPoly).where(MaterialPoly.user_id == current_user.id)
        statement = (
            select(MaterialPoly)
            .where(MaterialPoly.user_id == current_user.id)
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
            except ValueError:
                return jsonify({'ok': False, 'message': f'Tipo inválido: {type_}'}), 400

        if difficulty != 'all':
            try:
                conditions = []
                for mapper in Material.__mapper__.self_and_descendants:
                    cls = mapper.class_
                    if hasattr(cls, 'difficulty'):
                        conditions.append(getattr(MaterialPoly, cls.__name__).difficulty == Difficulty(difficulty))
                statement = statement.where(or_(*conditions))
                count_stmt = count_stmt.where(or_(*conditions))
            except ValueError:
                return jsonify({'ok': False, 'message': f'Dificuldade inválida: {type_}'}), 400

        if discipline != 'all':
            statement = statement.where(MaterialPoly.discipline == discipline)
            count_stmt = count_stmt.where(MaterialPoly.discipline == discipline)

        if search != '':
            statement = statement.where(MaterialPoly.subject.like(f'%{search}%'))
            count_stmt = count_stmt.where(MaterialPoly.subject.like(f'%{search}%'))

        total = session.execute(count_stmt).scalar() or 0
        materials = session.execute(statement).scalars().all()

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
                        'datetime': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200
