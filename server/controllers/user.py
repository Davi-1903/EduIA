from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from sqlalchemy import select

from database import SessionLocal
from models.material import Material

from errors.user import UserServiceError
from services.user import get_progress_service

bp_user = Blueprint('user', __name__, url_prefix='/api/user')


@bp_user.route('', methods=['GET'])
@login_required
def get_user():
    with SessionLocal() as session:
        materiais = session.scalars(
            select(Material).where(Material.user_id == current_user.id)
        ).all()

        materiais_recentes = session.scalars(
            select(Material)
            .where(Material.user_id == current_user.id)
            .order_by(Material.created_at.desc())
            .limit(3)
        ).all()


    material_por_tipo = {}
    for material in materiais:
        type_ = material.type.value
        material_por_tipo[type_] = material_por_tipo.get(type_, 0) + 1

    atividades = []
    for material in materiais_recentes:
        atividades.append({
            'id': material.id,
            'tipo': material.type.value,
            'assunto': material.subject,
            'data': material.created_at.isoformat(),
        })
    return jsonify(
        {
            'ok': True,
            'user': {
                'id': current_user.id,
                'nome': current_user.name,
                'email': current_user.email,
                'email_escolar': current_user.email_escolar,
                'email_academico': current_user.email_academico,
                'tipo': current_user.type.value,
                'foto': current_user.foto,
                'matricula': current_user.matricula,
                'campus': current_user.campus,
                'nascimento': current_user.nascimento.isoformat() if current_user.nascimento else None,
                'materiais': material_por_tipo,
                'atividades': atividades
            },
        }
    ), 200


@bp_user.route('/progresso', methods=['GET'])
@login_required
def get_progresso():
    try:
        progress = get_progress_service(current_user.id, current_user.type)
        return jsonify(progress), 200

    except UserServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500
