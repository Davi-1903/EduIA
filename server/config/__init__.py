import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from models.connection import SessionLocal, init_database
from models.database import User


def config_app(app: Flask):
    load_dotenv()

    SECRET_KEY = os.getenv('SECRET_KEY')
    if SECRET_KEY is None or SECRET_KEY == '':
        raise RuntimeError('A variável de ambiente SECRET_KEY não foi definida')

    app.secret_key = SECRET_KEY
    CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

    login_config(app)
    init_database()


def login_config(app: Flask):
    login_manager = LoginManager(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id: int):
        with SessionLocal() as session:
            return session.get(User, int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized(error: str):
        return jsonify({'ok': False, 'message': 'Permissão negada'}), 401
