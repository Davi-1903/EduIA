from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required

from database import SessionLocal
from models.explicacoes import Explicacao


bp_materials_explicacao = Blueprint('explicacoes', __name__, url_prefix='/explicacoes')

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