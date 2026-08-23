from datetime import datetime, timezone
import re

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func, or_, select
from sqlalchemy.orm import with_polymorphic
from sqlalchemy.dialects.mysql import match

from controllers.questoes import bp_materials_questoes
from controllers.quiz import bp_materials_quiz
from controllers.explanation import bp_materials_explicacao
from controllers.resumos import bp_materials_resumo
from controllers.desafios import bp_materials_desafio
from controllers.formulario import bp_materials_formulario
from controllers.lesson_plan import bp_materials_plano_de_aula
from controllers.guided_exercises import bp_materials_exercicio_guiado
from controllers.study_guide import bp_study_guide
from database import SessionLocal
from models.material import Difficulty, Material, MaterialType


bp_materials = Blueprint('materials', __name__, url_prefix='/api/materials')
bp_materials.register_blueprint(bp_materials_questoes)
bp_materials.register_blueprint(bp_materials_quiz)
bp_materials.register_blueprint(bp_materials_explicacao)
bp_materials.register_blueprint(bp_materials_resumo)
bp_materials.register_blueprint(bp_materials_desafio)
bp_materials.register_blueprint(bp_materials_formulario)
bp_materials.register_blueprint(bp_materials_plano_de_aula)
bp_materials.register_blueprint(bp_materials_exercicio_guiado)
bp_materials.register_blueprint(bp_study_guide)


def to_boolean_prefix_search(term: str) -> str:
    sanitized = re.sub(r'[+\-<>()~*"@]', ' ', term)
    words = sanitized.split()
    return ' '.join(f'+{w}*' for w in words)


@bp_materials.route('/', methods=['GET'])
@login_required
def get_materials():
    cursor = request.args.get('cursor', 0, type=int)
    limit = request.args.get('limit', 50, type=int)
    search = request.args.get('search', '')
    discipline = request.args.get('discipline', 'all')
    difficulty = request.args.get('difficulty', 'all')
    type_ = request.args.get('type', 'all')

    with SessionLocal() as session:
        MaterialPoly = with_polymorphic(Material, '*')

        count_stmt = (
            select(func.count())
            .select_from(MaterialPoly)
            .where(MaterialPoly.user_id == current_user.id)
            .where(MaterialPoly.deleted_at.is_(None))
        )
        statement = (
            select(MaterialPoly)
            .where(MaterialPoly.user_id == current_user.id)
            .where(MaterialPoly.deleted_at.is_(None))
            .offset(cursor)
            .limit(limit)
            .order_by(MaterialPoly.created_at.desc())
        )

        # ========================= FILTROS =========================
        if type_ != 'all':
            try:
                material_type = MaterialType(type_)
                statement = statement.where(MaterialPoly.type == material_type)
                count_stmt = count_stmt.where(MaterialPoly.type == material_type)
            except ValueError:
                return jsonify({'ok': False, 'message': f'Tipo inválido: {type_}'}), 400

        if difficulty != 'all':
            try:
                conditions = []
                for mapper in Material.__mapper__.self_and_descendants:
                    cls = mapper.class_
                    if hasattr(cls, 'difficulty'):
                        conditions.append(getattr(MaterialPoly, cls.__name__).difficulty == Difficulty(difficulty))
                statement = statement.where(or_(*conditions))
                count_stmt = count_stmt.where(or_(*conditions))
            except ValueError:
                return jsonify({'ok': False, 'message': f'Dificuldade inválida: {difficulty}'}), 400

        if discipline != 'all':
            statement = statement.where(MaterialPoly.discipline == discipline)
            count_stmt = count_stmt.where(MaterialPoly.discipline == discipline)

        if search != '':
            search_term = to_boolean_prefix_search(search)
            if search_term:
                score = match(MaterialPoly.discipline, MaterialPoly.subject, against=search_term, in_boolean_mode=True)
                statement = statement.where(score).order_by(score.desc())
                count_stmt = count_stmt.where(score)

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
                        'difficulty': material.difficulty.value if hasattr(material, 'difficulty') else None,  # type: ignore
                        'amount': getattr(material, 'amount', None),
                        'grade': getattr(material, 'grade', None),
                        'time': getattr(material, 'time_per_question', None),
                        'chalkboard': getattr(material, 'chalkboard', None),
                        'projector': getattr(material, 'projector', None),
                        'printed': getattr(material, 'printed', None),
                        'digital': getattr(material, 'digital', None),
                        'created_at': material.created_at,
                        'type': material.type.value,
                    }
                    for material in materials
                ],
            }
        ), 200


@bp_materials.route('/<int:id>', methods=['DELETE'])
@login_required
def soft_delete_material(id: int):
    with SessionLocal() as session:
        material = session.get(Material, id)
        if material is None or material.deleted_at is not None:
            return jsonify({'ok': False, 'message': 'Material não encontrado'}), 404

        material.deleted_at = datetime.now(timezone.utc)
        session.commit()

        return jsonify({'ok': True}), 200


@bp_materials.route('/<int:id>/restore', methods=['PATCH'])
@login_required
def restore_material(id: int):
    with SessionLocal() as session:
        material = session.get(Material, id)
        if material is None or material.deleted_at is None:
            return jsonify({'ok': False, 'message': 'Material não encontrado'}), 404

        material.deleted_at = None
        session.commit()

        return jsonify({'ok': True}), 200


@bp_materials.route('/<int:id>/trash', methods=['DELETE'])
@login_required
def hard_delete_material(id: int):
    with SessionLocal() as session:
        material = session.get(Material, id)
        if material is None or material.deleted_at is None:
            return jsonify({'ok': False, 'message': 'Material não encontrado'}), 404

        session.delete(material)
        session.commit()

        return jsonify({'ok': True}), 200
