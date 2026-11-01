from pathlib import Path

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from loguru import logger
from sqlalchemy import func, select

from database import SessionLocal
from models.historico import Historico
from models.roteiros import Roteiro
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'study-guides.log')


bp_study_guide = Blueprint('roteiro_estudos', __name__, url_prefix='/roteiro_estudos')


@bp_study_guide.route('/', methods=['GET'])
@login_required
def get_studys_guides():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Roteiro)
            .where(Roteiro.user_id == current_user.id)
            .where(Roteiro.deleted_at.is_(None))
        )
        statement = (
            select(Roteiro)
            .where(Roteiro.user_id == current_user.id)
            .where(Roteiro.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(Roteiro.created_at.desc())
        )

        total = session.scalar(count_stmt) or 0
        materials = session.scalars(statement).all()

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


@bp_study_guide.route('/<int:id>', methods=['GET'])
@login_required
def get_study_guide(id: int):
    with SessionLocal() as session:
        material = session.get(Roteiro, id)
        if material is None or material.deleted_at is not None:
            return jsonify({'ok': False, 'message': 'Plano de aula não encontrado'}), 404

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


@bp_study_guide.route('/', methods=['POST'])
@login_required
def create_study_guide():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    with SessionLocal() as session:
        try:
            resume = Roteiro(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},
                note=data['note'],
            )
            historico = Historico(material=resume)
            session.add(resume)
            session.add(historico)
            session.commit()
            logger.info('Roteiro de estudos salvo no banco de dados')
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception:
            session.rollback()
            logger.error('Falha ao salvar roteiro de estudos no banco de dados')
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
