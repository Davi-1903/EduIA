from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.formularios import Formulario

bp_materials_formulario = Blueprint('formularios', __name__, url_prefix='/formularios')


@bp_materials_formulario.route('/', methods=['GET'])
@login_required
def get_formularios():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = select(func.count()).select_from(Formulario).where(Formulario.user_id == current_user.id)
        statement = (
            select(Formulario)
            .where(Formulario.user_id == current_user.id)
            .order_by(Formulario.created_at.desc())
            .offset(cursor)
            .limit(limit)
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
                        'difficulty': material.difficulty.value,
                        'amount': material.amount,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_formulario.route('/<int:id>', methods=['GET'])
@login_required
def get_formulario(id: int):
    with SessionLocal() as session:
        material = session.get(Formulario, id)
        if material is None:
            return jsonify({'ok': False, 'message': 'Formulario não encontrado'}), 404

        return jsonify(
            {
                'ok': True,
                'material': {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'content': material.content,
                    'note': material.note,
                    'difficulty': material.difficulty.value,
                    'amount': material.amount,
                    'created_at': material.created_at,
                    'type': material.type.value,
                },
            },
        ), 200


@bp_materials_formulario.route('/', methods=['POST'])
@login_required
def create_formulario():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    with SessionLocal() as session:
        try:
            formulario = Formulario(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                difficulty=data['difficulty'],
                amount=data['amount'],
                note=data['note'] if data['note'] != '' else None,
            )

            session.add(formulario)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception as e:
            session.rollback()
            print('ERRO AO CRIAR FORMULARIO:', e)
            return jsonify({'ok': False, 'message': str(e)}), 500