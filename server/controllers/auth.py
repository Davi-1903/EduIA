from flask import Blueprint, jsonify, request
from flask_login import login_user
from argon2.exceptions import VerifyMismatchError
from argon2 import PasswordHasher
from models.database import User
from models.connection import SessionLocal


bp_auth = Blueprint('api', __name__, url_prefix='/api/auth')
senha_hasher = PasswordHasher()

@bp_auth.route('/login', methods=['POST'])
def login():
    with SessionLocal() as session:
        try:
            data = request.get_json()

            email = data.get('email')
            senha = data.get('senha')

            user_exist = session.query(User).filter_by(email=email).first()

            if not user_exist:
                return jsonify({'ok': False, 'message': 'Este email não está cadastrado no sistema'}), 401

            senha_hasher.verify(user_exist.password, senha)
            login_user(user_exist)

            return jsonify({'ok': True}), 200

        except VerifyMismatchError:
            return jsonify({'ok': False, 'message': 'Senha incorreta'}), 401

        except Exception as e:
            print(e)  
            return jsonify({'ok': False, 'message': 'Ocorreu um erro interno'}), 500
