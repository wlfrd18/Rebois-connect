from flask_jwt_extended import create_access_token
from itsdangerous import URLSafeTimedSerializer
from flask import current_app

def generate_activation_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='email-activation')

def verify_activation_token(token, max_age=3600):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='email-activation', max_age=max_age)
        return email
    except Exception:
        return None


def generate_token(user):
    return create_access_token(identity={
        "id": user.id,
        "email": user.email,
        "rôle": user.rôle
    })
