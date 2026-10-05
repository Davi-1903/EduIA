from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, select

from database import SessionLocal
from models.formularios import Formulario
from models.historico import Historico
from models.material import Difficulty


bp_materials_formulario = Blueprint(
    'formularios',
    __name__,
    url_prefix='/formulario'
)


@bp_materials_formulario.route('/', methods=['GET'])
@login_required
def get_formularios():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)

    with SessionLocal() as session:
        count_stmt = (
            select(func.count())
            .select_from(Formulario)
            .where(Formulario.user_id == current_user.id)
            .where(Formulario.deleted_at.is_(None))
        )

        statement = (
            select(Formulario)
            .where(Formulario.user_id == current_user.id)
            .where(Formulario.deleted_at.is_(None))
            .order_by(Formulario.created_at.desc())
            .offset(cursor)
            .limit(limit)
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
        material = session.scalar(
            select(Formulario)
            .where(Formulario.id == id)
            .where(Formulario.user_id == current_user.id)
            .where(Formulario.deleted_at.is_(None))
        )

        if material is None:
            return jsonify(
                {
                    'ok': False,
                    'message': 'Formulario não encontrado',
                }
            ), 404

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
            }
        ), 200


@bp_materials_formulario.route('/', methods=['POST'])
@login_required
def create_formulario():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify(
            {
                'ok': False,
                'message': 'Dados não recebidos',
            }
        ), 400

    with SessionLocal() as session:
        try:
            formulario = Formulario(
                user_id=current_user.id,
                discipline=data['discipline'],
                subject=data['subject'],
                content=data['content'],
                difficulty=Difficulty(data['difficulty']),
                amount=data['amount'],
                note=data['note'] if data['note'] != '' else None,
            )

            historico = Historico(material=formulario)

            session.add(formulario)
            session.add(historico)

            session.commit()

            return jsonify(
                {
                    'ok': True,
                    'redirect': '/materials',
                }
            ), 201

        except Exception as e:
            session.rollback()

            print(f'ERRO AO CRIAR FORMULÁRIO: {e}')

            return jsonify(
                {
                    'ok': False,
                    'message': 'Ocorreu um erro interno',
                }
            ), 500


@bp_materials_formulario.route(
    '/<int:id>/respostas',
    methods=['POST']
)
@login_required
def responder_formulario(id: int):
    data = request.get_json(silent=True)

    if data is None:
        return jsonify(
            {
                'ok': False,
                'message': 'Dados não recebidos',
            }
        ), 400

    answers = data.get('answers')

    if not isinstance(answers, dict) or not answers:
        return jsonify(
            {
                'ok': False,
                'message': 'Nenhuma resposta foi enviada',
            }
        ), 400

    with SessionLocal() as session:
        try:
            formulario = session.scalar(
                select(Formulario)
                .where(Formulario.id == id)
                .where(Formulario.user_id == current_user.id)
                .where(Formulario.deleted_at.is_(None))
            )

            if formulario is None:
                return jsonify(
                    {
                        'ok': False,
                        'message': 'Formulário não encontrado',
                    }
                ), 404

            historico = session.scalar(
                select(Historico)
                .where(Historico.material_id == formulario.id)
            )

            if historico is None:
                return jsonify(
                    {
                        'ok': False,
                        'message': 'Histórico do formulário não encontrado',
                    }
                ), 404

            historico.answer = str(answers)

            session.commit()

            return jsonify(
                {
                    'ok': True,
                    'message': 'Respostas enviadas com sucesso',
                }
            ), 200

        except Exception as e:
            session.rollback()

            print(f'ERRO AO RESPONDER FORMULÁRIO: {e}')

            return jsonify(
                {
                    'ok': False,
                    'message': 'Ocorreu um erro interno',
                }
            ), 500