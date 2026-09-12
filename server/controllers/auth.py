from flask import Blueprint, jsonify, request
from flask_login import login_required, login_user, logout_user
from flask_wtf.csrf import generate_csrf

from errors.user import UserAlreadyExistsError, UserCredentialsError, UserServiceError, UserTypeError
from services.user import create_user_service, get_user_service


bp_auth = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp_auth.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        user = create_user_service(data)
    except UserTypeError as error:
        return jsonify({'ok': False, 'message': str(error)}), 400
    except UserAlreadyExistsError:
        return jsonify({'ok': False, 'message': 'Credenciais inválidas'}), 401
    except UserServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500

    login_user(user)
    return jsonify(
        {
            'ok': True,
            'redirect': '/dash',
            'user': {
                'id': user.id,
                'nome': user.name,
                'email': user.email,
                'tipo': user.type.value,
            },
        }
    )


@bp_auth.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'ok': False, 'message': 'Dados não recebidos'}), 400

    try:
        user = get_user_service(data['email'], data['senha'])
    except UserCredentialsError as error:
        return jsonify({'ok': False, 'message': str(error)}), 401
    except UserServiceError as error:
        return jsonify({'ok': False, 'message': str(error)}), 500

    login_user(user)
    return jsonify(
        {
            'ok': True,
            'redirect': '/dash',
            'user': {
                'id': user.id,
                'nome': user.name,
                'email': user.email,
                'tipo': user.type.value,
            },
        }
    ), 200


@bp_auth.route('/csrf')
def get_csrf():
    return jsonify({'csrfToken': generate_csrf()}), 200


@bp_auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'ok': True, 'redirect': '/auth'}), 200
