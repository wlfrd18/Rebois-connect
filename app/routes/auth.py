from flask_restx import Namespace, Resource, fields
from flask import request, session, url_for
from app.facade import UserFacade
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta
from app.schemas.user_schema import UserRegisterSchema, UserLoginSchema, User2FASchema
from marshmallow import ValidationError
from app.services.auth_service import generate_2fa_code, send_2fa_code_email, verify_2fa_code
from app.services.token_service import generate_activation_token, verify_activation_token
from app.services.mail_service import send_activation_email

api = Namespace('auth', description='Operations related to authentication')

user_register_model = api.model('UserRegister', {
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True),
    'phone': fields.String(required=True),
    'role': fields.String(required=True, enum=['volunteer', 'sponsor', 'tech_structure', 'superuser'])
})

user_login_model = api.model('UserLogin', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
})

user_2fa_model = api.model('User2FA', {
    'email': fields.String(required=True),
    'code': fields.String(required=True)
})

def require_superuser():
    user_id = get_jwt_identity()
    user = UserFacade.get_user_by_id(user_id)
    if not user or user.role != 'superuser':
        api.abort(403, "Accès réservé au super utilisateur")

@api.route('/admin-only')
class AdminOnlyResource(Resource):
    @jwt_required()
    def get(self):
        require_superuser()
        return {"message": "Bienvenue super utilisateur"}, 200


@api.route('/register')
class Register(Resource):
    @api.expect(user_register_model)
    def post(self):
        """Register a new user"""
        try:
            data = api.payload
            validated_data = UserRegisterSchema().load(data)

            if UserFacade.get_user_by_email(validated_data['email']):
                return {'message': 'User already exists'}, 409

            # Créer un nouvel utilisateur sans 2FA
            new_user = UserFacade.create_user(data)
            print(type(new_user))
            token = generate_activation_token(new_user['email'])
            activation_link = url_for('auth_activateuser', token=token, _external=True)
            send_activation_email(new_user.email, activation_link)

            return {'message': 'User registered successfully', 'user_id': new_user.id}, 201

        except ValidationError as err:
            return {'errors': err.messages}, 400
        except Exception as e:
            return {'message': str(e)}, 400

@api.route('/login')
class Login(Resource):
    @api.expect(user_login_model)
    def post(self):
        """Login step 1: Check credentials and send email code"""
        try:
            data = request.get_json()
            validated_data = UserLoginSchema().load(data)

            user = UserFacade.get_user_by_email(validated_data['email'])
            if not user or not user.check_password(validated_data['password']):
                return {'message': 'Invalid email or password'}, 401

            code = generate_2fa_code(user.email)
            send_2fa_code_email(user.email, code)

            return {'message': '2FA code sent to your email'}, 200

        except ValidationError as err:
            return {'errors': err.messages}, 400
        except Exception as e:
            return {'message': str(e)}, 400

@api.route('/login/2fa')
class Login2FA(Resource):
    @api.expect(user_2fa_model)
    def post(self):
        """Login step 2: Verify 2FA code and issue JWT"""
        try:
            data = request.get_json()
            validated_data = User2FASchema().load(data)

            user = UserFacade.get_user_by_email(validated_data['email'])
            if not user:
                return {'message': 'User not found'}, 404

            if not verify_2fa_code(user.email, validated_data['code']):
                return {'message': 'Invalid or expired code'}, 401

            token = create_access_token(identity=user.id, expires_delta=timedelta(hours=24))
            return {'access_token': token}, 200

        except ValidationError as err:
            return {'errors': err.messages}, 400
        except Exception as e:
            return {'message': str(e)}, 400

