from pathlib import Path

from flask import Flask
from loguru import logger

from config import config_app
from controllers.auth import bp_auth
from controllers.historico import bp_historico
from controllers.lixeira import bp_lixeira
from controllers.materials import bp_materials
from controllers.user import bp_user
from utils import setup_logger


setup_logger(__name__, Path(__file__).resolve().parent / 'logs' / 'app.log')

app = Flask(__name__)
config_app(app)

app.register_blueprint(bp_auth)
app.register_blueprint(bp_user)
app.register_blueprint(bp_materials)
app.register_blueprint(bp_historico)
app.register_blueprint(bp_lixeira)
logger.info('Aplicação Flask configurada e blueprints registrados')
