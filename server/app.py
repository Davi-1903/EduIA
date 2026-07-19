from flask import Flask
from controllers.auth import bp_auth
from controllers.user import bp_user
from controllers.materials import bp_materials
from config import config_app


app = Flask(__name__)
config_app(app)

app.register_blueprint(bp_auth)
app.register_blueprint(bp_user)
app.register_blueprint(bp_materials)
