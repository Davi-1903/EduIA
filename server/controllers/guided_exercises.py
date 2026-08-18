from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.exercicios_guiados import ExercicioGuiado
from models.material import Difficulty


bp_materials_exercicio_guiado = Blueprint(
    'exercicio_guiado',
    __name__,
    url_prefix='/exercicio_guiado'
)


@bp_materials_exercicio_guiado.route('/', methods=['GET'])
@login_required
def get_guided_exercises():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(ExercicioGuiado)
            .where(ExercicioGuiado.user_id == current_user.id)
        )

        statement = (
            select(ExercicioGuiado)
            .where(ExercicioGuiado.user_id == current_user.id)
            .offset(cursor)
            .limit(limit)
            .order_by(ExercicioGuiado.created_at.desc())
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
                        'difficulty': material.difficulty.value,
                        'amount': material.amount,
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials_exercicio_guiado.route('/<int:id>', methods=['GET'])
@login_required
def get_guided_exercise(id: int):
    with SessionLocal() as session:
        material = session.get(ExercicioGuiado, id)

        if material is None:
            return jsonify({
                'ok': False,
                'message': 'Exercício guiado não encontrado'
            }), 404

        return jsonify(
            {
                'ok': True,
                'material': {
                    'id': material.id,
                    'title': material.subject,
                    'discipline': material.discipline,
                    'difficulty': material.difficulty.value,
                    'amount': material.amount,
                    'resolution': material.resolution,
                    'theory': material.theory,
                    'multiple_choice': material.multiple_choice,
                    'true_or_false': material.true_or_false,
                    'discursive': material.discursive,
                    'interpretation': material.interpretation,
                    'code': material.code,
                    'note': material.note,
                    'content': material.content,
                    'created_at': material.created_at,
                    'type': material.type.value,
                },
            }
        ), 200


@bp_materials_exercicio_guiado.route('/', methods=['POST'])
@login_required
def create_guided_exercise():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({
            'ok': False,
            'message': 'Dados não recebidos'
        }), 400

    # Lógica da IA...

    with SessionLocal() as session:
        try:
            guided_exercise = ExercicioGuiado(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content={'content': 1},  # Resposta da IA
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
                resolution=data['resolution'],
                theory=data['theory'],
                multiple_choice=data['multiple_choice'],
                true_or_false=data['true_or_false'],
                discursive=data['discursive'],
                interpretation=data['interpretation'],
                code=data['code'],
                note=data['note'] if data['note'] != '' else None,
            )

            session.add(guided_exercise)
            session.commit()

            return jsonify({
                'ok': True,
                'redirect': '/materials'
            }), 201

        except Exception:
            session.rollback()

            return jsonify({
                'ok': False,
                'message': 'Ocorreu um erro interno'
            }), 500