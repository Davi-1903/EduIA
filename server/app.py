from models import database
from flask import Flask, send_from_directory
from controllers.auth import bp_auth
from flask_cors import CORS
from flask_login import LoginManager
from models.database import User
from models.connection import SessionLocal
import os

app = Flask(__name__, static_folder='../client/dist')
app.secret_key = 'secret-key'

# Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# CORS
CORS(app, supports_credentials=True)

# Blueprints
app.register_blueprint(bp_auth)

# user_loader
@login_manager.user_loader
def load_user(user_id):
    with SessionLocal() as session:
        return session.get(User, int(user_id))

# Rota "Catch-All" para o React
@app.route('/')
@app.route('/<path:route>')
def serve_react(route: str = ''):
    if app.static_folder is None:
        raise RuntimeError('A pasta estática não foi definida')

    if route and not route.startswith('api') and os.path.exists(os.path.join(app.static_folder, route)):
        return send_from_directory(app.static_folder, route)

    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
