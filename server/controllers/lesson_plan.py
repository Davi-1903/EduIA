from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.historico import Historico
from models.planos_de_aula import PlanoDeAula


bp_materials_plano_de_aula = Blueprint('plano_de_aula', __name__, url_prefix='/plano_de_aula')


@bp_materials_plano_de_aula.route('/', methods=['GET'])
@login_required
def get_lesson_plans():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(PlanoDeAula)
            .where(PlanoDeAula.user_id == current_user.id)
            .where(PlanoDeAula.deleted_at.is_(None))
        )
        statement = (
            select(PlanoDeAula)
            .where(PlanoDeAula.user_id == current_user.id)
            .where(PlanoDeAula.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(PlanoDeAula.created_at.desc())
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
                        'grade': material.grade,
                        'duration': material.duration,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_plano_de_aula.route('/<int:id>', methods=['GET'])
@login_required
def get_lesson_plan(id: int):
    with SessionLocal() as session:
        material = session.get(PlanoDeAula, id)
        if material is None or material.deleted_at is not None:
            return jsonify({'ok': False, 'message': 'Plano de aula não encontrado'}), 404

        return jsonify(
            {
                'ok': True,
                'material': {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'grade': material.grade,
                    'objective': material.objective,
                    'duration': material.duration,
                    'chalkboard': material.chalkboard,
                    'projector': material.projector,
                    'printed': material.printed,
                    'digital': material.digital,
                    'note': material.note,
                    'content': material.content,
                    'created_at': material.created_at,
                    'type': material.type.value,
                },
            }
        ), 200


@bp_materials_plano_de_aula.route('/', methods=['POST'])
@login_required
def create_lesson_plan():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    # Lógica da IA...

    with SessionLocal() as session:
        try:
            lesson_plan = PlanoDeAula(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},  # Resposta da IA
                grade=data['grade'],
                objective=data['objective'],
                duration=data['duration'],
                chalkboard=data['chalkboard'],
                projector=data['projector'],
                printed=data['printed'],
                digital=data['digital'],
                note=data['note'] if data['note'] != '' else None,
            )
            historico = Historico(material=lesson_plan)
            session.add(lesson_plan)
            session.add(historico)
            session.commit()
            return jsonify({'ok': True, 'redirect': '/materials'}), 201

        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
