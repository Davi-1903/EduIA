from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.historico import Historico
from models.desafios import Desafio
from models.material import Difficulty


bp_materials_desafio = Blueprint('desafios', __name__, url_prefix='/desafios')


@bp_materials_desafio.route('/', methods=['GET'])
@login_required
def get_desafios():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = select(func.count()).select_from(Desafio).where(Desafio.user_id == current_user.id)
        statement = (
            select(Desafio)
            .where(Desafio.user_id == current_user.id)
            .offset(cursor)
            .limit(limit)
            .order_by(Desafio.created_at.desc())
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
                        'difficulty': material.difficulty,
                        'note': material.note,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_desafio.route('/<int:id>', methods=['GET'])
@login_required
def get_desafio(id: int):
    with SessionLocal() as session:
        material = session.get(Desafio, id)
        if material is None:
            return jsonify({'ok': False, 'message': 'Desafio não encontrado'}), 404

        return jsonify(
            {
                'ok': True,
                'material': {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'difficulty': material.difficulty,
                    'content': material.content,
                    'note': material.note,
                    'created_at': material.created_at,
                    'type': material.type.value,
                },
            },
        ), 200


@bp_materials_desafio.route('/', methods=['POST'])
@login_required
def create_desafio():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    # Lógica da IA...

    with SessionLocal() as session:
        try:
            desafio = Desafio(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},
                difficulty=Difficulty.MUITO_DIFICIL,
                note=data['note'] if data['note'] != '' else None,
            )
            historico = Historico(material=desafio)
            session.add(desafio)
            session.add(historico)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
