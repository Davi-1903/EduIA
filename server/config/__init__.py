from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from flask_wtf import CSRFProtect
from database import SessionLocal, init_database
from models.user import Usuario
from utils import get_env


def config_app(app: Flask):
    SECRET_KEY = get_env('SECRET_KEY')

    app.config.update(
        SECRET_KEY=SECRET_KEY, SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SECURE=False, SESSION_COOKIE_SAMESITE='Lax'
    )
    CORS(app, supports_credentials=True, origins=['http://localhost:3000'])
    csrf = CSRFProtect()

    login_config(app)
    init_database()


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
