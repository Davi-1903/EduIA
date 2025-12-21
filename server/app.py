from flask import Flask, send_from_directory
from controllers.auth import bp_auth
import os, config


app = Flask(__name__, static_folder='../client/dist')
config.config_app(app)

# Blueprints
app.register_blueprint(bp_auth)


# Rota "Catch-All" para o React
@app.route('/')
@app.route('/<path:route>')
def serve_react(route: str = ''):
    if app.static_folder is None:
        raise RuntimeError('A pasta estática não foi definida')
    if route and not route.startswith('/api') and os.path.exists(os.path.join(app.static_folder, route)):
        return send_from_directory(app.static_folder, route)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
