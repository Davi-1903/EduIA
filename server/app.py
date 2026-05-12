from flask import Flask
from controllers.auth import bp_auth
import config


app = Flask(__name__)
config.config_app(app)

app.register_blueprint(bp_auth)
