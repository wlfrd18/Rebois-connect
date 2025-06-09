from flask import Flask
from flask_restx import Api

from app.extensions import db, jwt, bcrypt, migrate, mail
from app.config import Config

# Import des namespaces
from app.routes.auth import api as auth_ns
from app.routes.lands import api as lands_ns
from app.routes.projects import api as projects_ns


# Tu ajouteras plus tard : from app.routes.lands import api as lands_ns, etc.

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialiser les extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # Swagger API instance
    api = Api(
        app,
        version="1.0",
        title="Rebois Connect API",
        description="API pour la gestion de reboisement participatif",
        doc="/api/v1/docs"  # Swagger UI sera disponible ici
    )

    # Enregistrer les namespaces RESTX
    api.add_namespace(auth_ns, path='/api/v1/auth')
    api.add_namespace(lands_ns, path='/api/v1/lands')
    api.add_namespace(projects_ns, path='/api/v1/projects')
    # Tu ajouteras ensuite :
    # api.add_namespace(messages_ns, path='/api/v1/messages')

    return app
