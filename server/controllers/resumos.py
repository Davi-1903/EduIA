from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from database import SessionLocal
from models.resumos import Resumo
from sqlalchemy import select, func


bp_materials_resumo = Blueprint('resumos', __name__, url_prefix='/resumos')


@bp_materials_resumo.route('/', methods=['GET'])
@login_required
def get_resumes():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Resumo)
            .where(Resumo.user_id == current_user.id)
            .where(Resumo.deleted_at.is_(None))
        )
        statement = (
            select(Resumo)
            .where(Resumo.user_id == current_user.id)
            .where(Resumo.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Resumo.created_at.desc())
        )

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
                        'note': material.note,
                        'created_at': material.created_at,
                        'content': material.content,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_resumo.route('/<int:id>', methods=['GET'])
@login_required
def get_resume(id: int):
    with SessionLocal() as session:
        material = session.get(Resumo, id)
        if material is None or material is not None:
            return jsonify({'ok': False, 'message': 'Resume não encontrado'}), 404

        return jsonify(
            {
                'ok': True,
                'materials': [
                    {
                        'id': material.id,
                        'title': material.subject,
                        'discipline': material.discipline,
                        'note': material.note,
                        'created_at': material.created_at,
                        'content': material.content,
                        'type': material.type.value,
                    }
                ],
            }
        ), 200


@bp_materials_resumo.route('/', methods=['POST'])
@login_required
def create_resume():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    with SessionLocal() as session:
        try:
            resume = Resumo(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},
                note=data['note'],
            )
            session.add(resume)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201
        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
