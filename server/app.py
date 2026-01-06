from flask import Flask
from controllers.auth import bp_auth
from config import config_app


app = Flask(__name__)
config_app(app)

app.register_blueprint(bp_auth)
