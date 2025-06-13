from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.schemas.user_schema import UserSchema
from app.schemas.project_schema import ProjectSchema
from app.schemas.land_schema import LandSchema
from app.facade import user_facade, land_facade, project_facade
from .auth import require_superuser

api = Namespace('users', description='Opérations sur les utilisateurs')

user_schema = UserSchema()
project_schema = ProjectSchema()
land_schema = LandSchema()

user_model = api.model('User', {
    'id': fields.String(readonly=True),
    'email': fields.String,
    'first_name': fields.String,
    'last_name': fields.String,
    'phone': fields.String,
    'is_active': fields.Boolean,
})


@api.route('/')
class UserList(Resource):
    @api.doc('get_all_users')
    @api.marshal_list_with(user_model)
    @jwt_required()
    def get(self):
        """Récupérer la liste de tous les utilisateurs (réservé au superuser)"""
        users = user_facade.get_all_users()
        return user_schema.dump(users, many=True)


@api.route('/<string:user_id>')
@api.param('user_id', 'Identifiant de l’utilisateur')
class UserResource(Resource):

    @api.doc('get_user')
    @api.marshal_with(user_model)
    @jwt_required()
    def get(self, user_id):
        """Récupérer un utilisateur par ID"""
        user = user_facade.get_user_by_id(user_id)
        if not user:
            api.abort(404, "Utilisateur non trouvé")
        return user_schema.dump(user)

    @api.doc('update_user')
    @api.expect(api.model('UserUpdate', {
        'first_name': fields.String,
        'last_name': fields.String,
        'phone': fields.String,
        'photo_url': fields.String,
    }))
    @api.marshal_with(user_model)
    @jwt_required()
    def put(self, user_id):
        """Mettre à jour uniquement son propre profil (nom, prénom, téléphone, photo)"""
        current_user_id = get_jwt_identity()
        if str(current_user_id) != user_id:
            api.abort(403, "Vous ne pouvez modifier que votre propre profil.")

        raw_data = request.get_json()
        allowed_fields = {"first_name", "last_name", "phone", "photo_url"}
        filtered_data = {k: v for k, v in raw_data.items() if k in allowed_fields}

        try:
            validated_data = user_schema.load(filtered_data, partial=True)
        except ValidationError as err:
            return {'message': 'Erreur de validation', 'errors': err.messages}, 400

        updated_user = user_facade.update_user(user_id, validated_data)
        if not updated_user:
            api.abort(404, "Utilisateur non trouvé")
        return user_schema.dump(updated_user)

    @api.doc('delete_user')
    @jwt_required()
    def delete(self, user_id):
        """Supprimer un utilisateur (réservé au superuser)"""
        require_superuser()
        success = user_facade.delete_user(user_id)
        if success:
            return {'message': 'Utilisateur supprimé'}, 200
        api.abort(404, "Utilisateur non trouvé")

@api.route('/<string:user_id>/lands')
class UserLands(Resource):
    @api.doc('get_user_lands')
    @jwt_required()
    def get(self, user_id):
        """Récupérer toutes les terres postées par un utilisateur"""
        lands = land_facade.get_lands_by_user_id(user_id)
        return land_schema.dump(lands, many=True)


@api.route('/<string:user_id>/projects')
class UserProjects(Resource):
    @api.doc('get_user_projects')
    @jwt_required()
    def get(self, user_id):
        """Récupérer tous les projets liés à un utilisateur (volontaire/sponsor/tech)"""
        projects = project_facade.get_projects_by_user_id(user_id)
        return project_schema.dump(projects, many=True)