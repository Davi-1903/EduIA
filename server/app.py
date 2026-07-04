from flask import Flask
from controllers.auth import bp_auth
from controllers.user import bp_user
import config


app = Flask(__name__)
config.config_app(app)

app.register_blueprint(bp_auth)
app.register_blueprint(bp_user)
