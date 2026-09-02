from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from sqlalchemy import select

from database import SessionLocal
from models.material import Material, MaterialType


bp_user = Blueprint('user', __name__, url_prefix='/api/user')


@bp_user.route('', methods=['GET'])
@login_required
def get_user():
    return jsonify(
        {
            'ok': True,
            'user': {
                'id': current_user.id,
                'nome': current_user.name,
                'email': current_user.email,
                'tipo': current_user.type.value,
            },
        }
    ), 200


@bp_user.route('/progresso', methods=['GET'])
@login_required
def get_progresso():
    session = SessionLocal()
    try:
        materiais = session.scalars(select(Material.type).where(Material.user_id == current_user.id).distinct()).all()
        tipos_utilizados = set()
        for material in materiais:
            tipos_utilizados.add(material.value)
        progresso = {}
        for material_type in MaterialType:
            nome = material_type.name.lower()
            utilizado = material_type.value in tipos_utilizados
            progresso[nome] = utilizado
        return jsonify(progresso), 200

    finally:
        session.close()
