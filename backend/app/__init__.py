from flask import Flask, request
from flask_restx import Api
from flask_cors import CORS

from app.extensions import db, jwt, bcrypt, migrate, mail, socketio
from app.config import Config

# Import des namespaces
from app.routes.auth import api as auth_ns
from app.routes.lands import api as lands_ns
from app.routes.projects import api as projects_ns
from app.routes.users import api as users_ns
from app.routes.admins import api as admins_ns
from app.routes.news_routes import api as news_ns
from app.routes.upload import api as upload_ns
from app.routes.messages import api as messages_ns

import logging

logging.basicConfig(level=logging.INFO,  # niveau de logs affichés
                    format='%(asctime)s - %(levelname)s - %(message)s')


def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.config.from_object(config_class)
    app.debug = True
    app.static_folder = 'static'
    app.static_url_path = '/static'

    # CORS avec credentials supporté
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
        "https://127.0.0.1:3000"
    ])

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin in [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://localhost:3000",
            "https://127.0.0.1:3000"
        ]:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

    # Initialiser les extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)
    from app.models.twofacode import TwoFaCode
    migrate.init_app(app, db)
    mail.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    from app.sockets.message_socket import register_socketio_events
    register_socketio_events(socketio)

    # Swagger API instance
    api = Api(
        app,
        version="1.0",
        title="Rebois Connect API",
        description="API pour la gestion de reboisement participatif",
        doc="/api/v1/docs"
    )

    # Enregistrer les namespaces
    api.add_namespace(auth_ns, path='/api/v1/auth')
    api.add_namespace(lands_ns, path='/api/v1/lands')
    api.add_namespace(projects_ns, path='/api/v1/projects')
    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(admins_ns, path='/api/v1/admins')
    api.add_namespace(news_ns, path='/api/v1/news')
    api.add_namespace(upload_ns, path='/api/v1/upload')
    api.add_namespace(messages_ns, path='/api/v1/messages')

    @app.route('/')
    def index():
        return {"message": "Bienvenue sur Rebois Connect API"}, 200

    return app

