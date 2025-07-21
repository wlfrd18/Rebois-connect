from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, url_for
from app.facade import user_facade
from .auth import require_superuser

api = Namespace('admin', description='Operations related to authentication')

@api.route('/')
class AdminOnlyResource(Resource):
    @jwt_required()
    def get(self):
        require_superuser()
        return {"message": "Bienvenue super utilisateur"}, 200

@api.route('/delete/<int:user_id>')
class DeleteUser(Resource):
    @jwt_required()
    def delete(self, user_id):
        require_superuser()  # Vérifie que l'utilisateur est superuser

        user_to_delete = user_facade.get_user_by_id(user_id)

        if user_facade.delete_user(user_to_delete.id):
            return {'message': f'User {user_id} deleted successfully'}, 200
        else:
            return {'message': 'User not found'}, 404
