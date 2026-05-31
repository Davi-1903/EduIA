from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user, logout_user, current_user
from flask_wtf.csrf import generate_csrf
from models.user import UserType, Usuario, Aluno, Professor
from database import SessionLocal
from utils import create_hash, verify_hash


bp_auth = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp_auth.route('/register', methods=['POST'])
def register():
    with SessionLocal() as session:
        try:
            data = request.get_json()
            if not data:
                return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400
            
            user = session.query(Usuario).filter_by(email=data['email']).first()
            if user:
                return jsonify({'ok': False, 'message': 'Credenciais inválidas'}), 401
            
            if data['type'] == UserType.ALUNO.value:
                new_user = Aluno(name=data['nome'], email=data['email'], password=create_hash(data['password']))
            elif data['type'] == UserType.PROFESSOR.value:
                new_user = Professor(name=data['nome'], email=data['email'], password=create_hash(data['password']))
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

        except:
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
            if not user_exist or not verify_hash(user_exist.password, data['senha']):
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

        except Exception as e:
            print(e)
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500


@bp_auth.route('/check')
@login_required
def check():
    return jsonify({
        'ok': True,
        'user': {
            'id': current_user.id,
            'nome': current_user.name,
            'email': current_user.email,
            'tipo': current_user.type.value
        }
    }), 200


@bp_auth.route('/csrf')
def get_csrf():
    return jsonify({'csrfToken': generate_csrf()}), 200


@bp_auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'ok': True, 'redirect': '/auth'}), 200
