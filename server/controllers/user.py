from flask import Blueprint, jsonify
from flask_login import current_user, login_required, logout_user
from sqlalchemy import select, func

from database import SessionLocal
from models.material import Material
from models.user import Usuario

from errors.user import UserServiceError
from services.user import get_progress_service

bp_user = Blueprint('user', __name__, url_prefix='/api/user')


@bp_user.route('', methods=['GET'])
@login_required
def get_user():
    with SessionLocal() as session:
        rows = session.execute(
            select(Material.type, func.count(Material.id))
            .where(
                Material.user_id == current_user.id,
                Material.deleted_at.is_(None),
            )
            .group_by(Material.type)
        ).all()

    material_por_tipo = {type_.value: total for type_, total in rows}

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

@bp_user.route('', methods=['DELETE'])
@login_required
def delete_user():
    user_id = current_user.id
    try:
        with SessionLocal() as session:
            user = session.get(Usuario, user_id)
            if user is None:
                return jsonify({'ok': False, 'message': 'Usuário não encontrado'}), 404
            session.delete(user)
            session.commit()
    except Exception:
        return jsonify({'ok': False, 'message': 'Não foi possível excluir o perfil'}), 500

    logout_user()
    return jsonify({'ok': True}), 200
