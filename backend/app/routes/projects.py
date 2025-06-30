from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.facade import project_facade, user_facade
from app.schemas.project_schema import ProjectSchema
from .auth import require_superuser
from app.extensions import db

project_schema = ProjectSchema()

api = Namespace('projects', description='Operations related to projects')

project_model = api.model('Project', {
    'id': fields.String(readonly=True, description='Project ID'),
    'land_id': fields.String(required=True, description='Associated land ID'),
    'sponsor_id': fields.String(readonly=True, description='Project sponsor ID'),
    'volunteer_id': fields.String(required=True, description='Volunteer ID'),
    'tech_structure_id': fields.String(description='Tech structure in charge'),
    'start_date': fields.Date(description='Start date'),
    'end_date': fields.Date(description='End date'),
    'status': fields.String(description='Project status'),
    'report': fields.String(description='Project report'),
})

# Résumé court des utilisateurs
user_short_model = api.model('UserShort', {
    'id': fields.String,
    'first_name': fields.String,
    'last_name': fields.String,
})

# Résumé court des terres
land_short_model = api.model('LandShort', {
    'id': fields.String,
    'country': fields.String,
    'status': fields.String,
    'area': fields.Float,
    'photo_url': fields.String,
})

# Nouveau modèle enrichi de projet
project_detailed_model = api.model('ProjectDetailed', {
    'id': fields.String,
    'status': fields.String,
    'start_date': fields.Date,
    'end_date': fields.Date,
    'report': fields.String,
    'photo_url': fields.String,

    'land': fields.Nested(land_short_model),
    'sponsor': fields.Nested(user_short_model),
    'volunteer': fields.Nested(user_short_model),
    'tech_structure': fields.Nested(user_short_model, allow_null=True),
})

# === ROUTES ===

@api.route('/')
class ProjectList(Resource):
    @api.doc('list_projects_detailed')
    def get(self):
        projects = project_facade.get_all_projects_detailed()
        return projects


    @api.doc('create_project')
    @api.expect(project_model)
    @jwt_required()
    def post(self):
        require_superuser()
        raw_data = request.get_json()
        # Le sponsor_id peut venir dans le payload ou tu peux forcer à admin
        # Ici on suppose qu'on accepte sponsor_id dans le payload pour admin
        schema = ProjectSchema()
        try:
            validated_data = schema.load(raw_data)
        except ValidationError as err:
            return {'message': 'Validation error', 'errors': err.messages}, 400

        new_project = project_facade.create_project(validated_data)
        return new_project, 201

@api.route('/<string:project_id>')
@api.param('project_id', 'The project identifier')
class Project(Resource):
    @api.doc('get_project')
    @api.marshal_with(project_model)
    @jwt_required()
    def get(self, project_id):
        project = project_facade.get_project_by_id(project_id)
        if not project:
            api.abort(404, "Project not found")
        return project

    @api.doc('update_project')
    @api.expect(project_model)
    @jwt_required()
    def put(self, project_id):
        raw_data = request.get_json()
        schema = ProjectSchema()
        try:
            validated_data = schema.load(raw_data, partial=True)
        except ValidationError as err:
            return {'message': 'Validation error', 'errors': err.messages}, 400

        # Récupérer l'utilisateur connecté
        current_user_id = get_jwt_identity()
        current_user = user_facade.get_user_by_id(current_user_id)
        if not current_user:
            api.abort(401, "Utilisateur non authentifié")

        # Récupérer le projet
        project = project_facade.get_project_by_id(project_id)
        if not project:
            api.abort(404, "Project not found")

        # Vérification des droits
        # L'utilisateur doit être soit le sponsor du projet,
        # soit la structure technique en charge,
        # soit un superuser
        allowed_user_ids = [
            project.sponsor_id,
            project.tech_structure_id
        ]
        if current_user.role != "superuser" and current_user_id not in allowed_user_ids:
            api.abort(403, "Accès refusé : vous n'êtes pas autorisé à modifier ce projet")

        # Mise à jour partielle (typiquement le champ 'report')
        updated_project = project_facade.update_project(project_id, validated_data)
        if not updated_project:
            api.abort(404, "Project not found")

        return updated_project

    @api.doc('delete_project')
    @jwt_required()
    def delete(self, project_id):
        require_superuser()
        success = project_facade.delete_project(project_id)
        if success:
            return {'message': 'Project deleted'}, 200
        api.abort(404, "Project not found")


@api.route('/only')
class ProjectList(Resource):
    @api.doc('list_projects')
    @jwt_required()
    def get(self):
        return project_facade.get_all_projects()