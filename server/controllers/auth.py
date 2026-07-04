from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user, logout_user
from flask_wtf.csrf import generate_csrf
from pwdlib import PasswordHash
from sqlalchemy.exc import IntegrityError
from models.user import UserType, Usuario
from models.professor import Professor
from models.aluno import Aluno
from database import SessionLocal


bp_auth = Blueprint('auth', __name__, url_prefix='/api/auth')
ph = PasswordHash.recommended()


@bp_auth.route('/register', methods=['POST'])
def register():
    with SessionLocal() as session:
        try:
            data = request.get_json()
            if not data:
                return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400
            
            if data['type'] == UserType.ALUNO.value:
                new_user = Aluno(name=data['nome'], email=data['email'], password=ph.hash(data['password']))
            elif data['type'] == UserType.PROFESSOR.value:
                new_user = Professor(name=data['nome'], email=data['email'], password=ph.hash(data['password']))
            else:
                return jsonify({'ok': False, 'message': 'Tipo inválido'}), 400
            
            session.add(new_user)
            session.commit()
            login_user(new_user)

            return jsonify({
                'ok': True,
                'redirect': '/dash',
                'user': {
                    'id': new_user.id,
                    'nome': new_user.name,
                    'email': new_user.email,
                    'tipo': new_user.type.value
                }
            }), 201

        except IntegrityError:
            return jsonify({'ok': False, 'message': 'Credenciais inválidas'}), 401

        except Exception:
            session.rollback()
            return jsonify({'ok': False, 'message': 'Erro interno'}), 500


@bp_auth.route('/login', methods=['POST'])
def login():
    with SessionLocal() as session:
        try:
            data = request.get_json()
            if not data:
                return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

            user_exist = session.query(Usuario).filter_by(email=data['email']).first()
            if not user_exist or not ph.verify(data['senha'], user_exist.password):
                return jsonify({'ok': False, 'message': 'Credenciais inválidas'}), 401

            login_user(user_exist)
            return jsonify({
                'ok': True,
                'redirect': '/dash',
                'user': {
                    'id': user_exist.id,
                    'nome': user_exist.name,
                    'email': user_exist.email,
                    'tipo': user_exist.type.value
                }
            }), 200

        except Exception:
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500


@bp_auth.route('/csrf')
def get_csrf():
    return jsonify({'csrfToken': generate_csrf()}), 200


@bp_auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'ok': True, 'redirect': '/auth'}), 200
