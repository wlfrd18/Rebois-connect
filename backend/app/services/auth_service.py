from flask import jsonify
from app.facade import UserFacade
from app.services.token_service import generate_token
import pyotp
import random
from flask_mail import Message
from flask import current_app
from app.extensions import mail
from datetime import datetime, timedelta
from .mail_service import send_email

# Stockage temporaire simple (à remplacer en prod)
_2fa_codes = {}

def generate_2fa_code(email: str) -> str:
    code = str(random.randint(100000, 999999))
    expire_at = datetime.utcnow() + timedelta(minutes=5)
    _2fa_codes[email] = {"code": code, "expire_at": expire_at}
    return code

def verify_2fa_code(email: str, code: str) -> bool:
    data = _2fa_codes.get(email)
    if not data:
        return False
    if datetime.utcnow() > data['expire_at']:
        del _2fa_codes[email]
        return False
    if data['code'] == code:
        del _2fa_codes[email]
        return True
    return False

def send_2fa_code_email(email: str, code: str) -> None:
    subject="Votre code de vérification 2FA"
    body=f"Votre code de vérification est : {code}. Il expire dans 5 minutes."
    send_email(email, subject, body)