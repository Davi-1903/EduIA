from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from flask_wtf.csrf import generate_csrf
from models.user import User, Aluno, Professor
from database import SessionLocal


bp_auth = Blueprint('auth', __name__, url_prefix='/api/auth')
senha_hasher = PasswordHasher()


@bp_auth.route('/register', methods=['POST'])
def register():
    with SessionLocal() as session:
        try:
            data = request.get_json()
            if not data:
                return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400
            
            user = session.query(User).filter_by(email=data['email']).first()

            if user:
                return jsonify({'ok': False, 'message': 'Usuário já existe'}), 409
            
            if data['type'] == 'Student':
                new_user = Aluno(name=data['nome'], email=data['email'], password=senha_hasher.hash(data['password']))
            elif data['type'] == 'Teacher':
                new_user = Professor(name=data['nome'], email=data['email'], password=senha_hasher.hash(data['password']))
            else:
                return jsonify({'ok': False, 'message': 'Tipo inválido'}), 400
            
            session.add(new_user)
            session.commit()
            login_user(new_user)

            return jsonify({'ok': True, 'redirect': '/dash'}), 201

        except Exception:
            return jsonify({'ok': False, 'message': 'Erro interno'}), 500


@bp_auth.route('/login', methods=['POST'])
def login():
    with SessionLocal() as session:
        try:
            data = request.get_json()
            if not data:
                return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

            user_exist = session.query(User).filter_by(email=data['email']).first()

            if not user_exist:
                return jsonify({'ok': False, 'message': 'Este email não está cadastrado no sistema'}), 401

            senha_hasher.verify(user_exist.password, data['senha'])
            login_user(user_exist)

            return jsonify({'ok': True, 'redirect': '/dash'}), 200

        except VerifyMismatchError:
            return jsonify({'ok': False, 'message': 'Senha incorreta'}), 401

        except Exception:
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500


@bp_auth.route('/check')
@login_required
def check():
    return jsonify({'ok': False}), 200


@bp_auth.route('/csrf')
def get_csrf():
    return jsonify({'csrfToken': generate_csrf()}), 200