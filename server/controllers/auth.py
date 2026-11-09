import secrets
from pathlib import Path

from flask import Blueprint, current_app, jsonify, redirect, request, session
from flask_login import login_required, login_user, logout_user
from flask_wtf.csrf import generate_csrf
from loguru import logger

from errors.user import UserAlreadyExistsError, UserCredentialsError, UserServiceError, UserTypeError
from services.suap import SuapAuthenticationError, authenticate_suap_code, build_suap_authorization_url
from services.user import create_user_service, get_user_service
from utils import setup_logger


bp_auth = Blueprint('auth', __name__, url_prefix='/api/auth')
setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'auth.log')


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
    except Exception as error:
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


@bp_auth.route('/suap/login')
def suap_login():
    required_settings = ('SUAP_CLIENT_ID', 'SUAP_CLIENT_SECRET', 'SUAP_REDIRECT_URI')
    if any(not current_app.config.get(setting) for setting in required_settings):
        logger.error('Configuração OAuth do SUAP incompleta')
        return redirect('/login?suap_error=unavailable')

    state = secrets.token_urlsafe(32)
    session['suap_oauth_state'] = state
    return redirect(build_suap_authorization_url(state))


@bp_auth.route('/suap/callback')
def suap_callback():
    expected_state = session.pop('suap_oauth_state', '')
    received_state = request.args.get('state', '')
    if not expected_state or not received_state or not secrets.compare_digest(expected_state, received_state):
        return redirect('/login?suap_error=invalid_state')

    if request.args.get('error'):
        return redirect('/login?suap_error=denied')

    code = request.args.get('code', '').strip()
    if not code:
        return redirect('/login?suap_error=invalid_response')

    try:
        user = authenticate_suap_code(code)
    except SuapAuthenticationError as error:
        logger.warning('Autenticação SUAP recusada: {}', error.code)
        return redirect(f'/login?suap_error={error.code}')

    session.clear()
    login_user(user)
    return redirect('/dash')


@bp_auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'ok': True, 'redirect': '/auth'}), 200
