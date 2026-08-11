from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from sqlalchemy import select, func
from database import SessionLocal
from models.explicacoes import Explicacao


bp_materials_explicacao = Blueprint('explicacoes', __name__, url_prefix='/explicacoes')

@bp_materials_explicacao.route('/', methods=['GET'])
@login_required
def get_explanations():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = select(func.count()).select_from(Explicacao).where(Explicacao.user_id == current_user.id)
        statement = (
            select(Explicacao)
            .where(Explicacao.user_id == current_user.id)
            .offset(cursor)
            .limit(limit)
            .order_by(Explicacao.created_at.desc())
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
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200
    
@bp_materials_explicacao.route('/<int:id>', methods=['GET'])
@login_required
def get_explanation(id: int):
    with SessionLocal() as session:
        material = session.get(Explicacao, id)
        if material is None:
            return jsonify({'ok': False, 'message': 'Explicação não encontrada'}), 404

        return jsonify(
            {
                'ok': True,
                'material': [
                    {
                        'id': material.id,
                        'title': material.subject,
                        'discipline': material.discipline,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                ],
            }
        ), 200

@bp_materials_explicacao.route('/', methods=['POST'])
@login_required
def create_explanation():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    with SessionLocal() as session:
        try:
            explanation = Explicacao(
                user_id = current_user.id,
                discipline = data['discipline'],
                questions = data['questions'],
                subject = data['subject'],
                content={'content': 1}
            )
            session.add(explanation)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500