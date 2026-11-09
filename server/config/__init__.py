from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from flask_wtf import CSRFProtect

from ai import init_ai
from database import SessionLocal, init_database
from models.user import Usuario
from utils.database import get_env


__all__ = ['config_app']


def config_app(app: Flask):
    app.config.update(
        SECRET_KEY=get_env('SECRET_KEY'),
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=get_env('SESSION_COOKIE_SECURE', '0').lower() in {'1', 'true', 'yes'},
        SESSION_COOKIE_SAMESITE='Lax',
        SUAP_CLIENT_ID=get_env('SUAP_CLIENT_ID', ''),
        SUAP_CLIENT_SECRET=get_env('SUAP_CLIENT_SECRET', ''),
        SUAP_REDIRECT_URI=get_env('SUAP_REDIRECT_URI', ''),
        SUAP_AUTHORIZATION_URL=get_env('SUAP_AUTHORIZATION_URL', 'https://suap.ifrn.edu.br/o/authorize/'),
        SUAP_TOKEN_URL=get_env('SUAP_TOKEN_URL', 'https://suap.ifrn.edu.br/o/token/'),
        SUAP_PROFILE_URL=get_env('SUAP_PROFILE_URL', 'https://suap.ifrn.edu.br/api/rh/eu/'),
        SUAP_PROFILE_FALLBACK_URL=get_env('SUAP_PROFILE_FALLBACK_URL', 'https://suap.ifrn.edu.br/api/rh/meus-dados/'),
    )
    origins = get_env('CORS_ORIGINS', 'http://localhost:3000,http://localhost:4173').split(',')
    CORS(app, supports_credentials=True, origins=origins)
    csrf = CSRFProtect()
    csrf.init_app(app)

    login_config(app)
    init_database()
    init_ai(app)


def login_config(app: Flask):
    login_manager = LoginManager(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id: int):
        with SessionLocal() as session:
            return session.get(Usuario, int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'ok': False, 'message': 'Permissão negada'}), 401
