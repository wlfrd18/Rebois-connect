from flask import jsonify
from app.facade import user_facade
from app.services.token_service import generate_token
import pyotp
import random
from flask_mail import Message
from flask import current_app
from app.extensions import mail
from datetime import datetime, timedelta
from .mail_service import send_email
from app.models.twofacode import TwoFaCode
from app.extensions import db

# Stockage temporaire simple (à remplacer en prod)
_2fa_codes = {}

def generate_2fa_code(email: str) -> str:
    # Supprimer les anciens codes pour l’email
    TwoFaCode.query.filter_by(email=email).delete()

    code = str(random.randint(100000, 999999))
    expire_at = datetime.utcnow() + timedelta(minutes=5)

    new_code = TwoFaCode(email=email, code=code, expire_at=expire_at)
    db.session.add(new_code)
    db.session.commit()

    return code


def verify_2fa_code(email: str, code: str) -> bool:
    record = TwoFaCode.query.filter_by(email=email, code=code).first()

    if not record:
        return False
    if datetime.utcnow() > record.expire_at:
        db.session.delete(record)
        db.session.commit()
        return False

    # Code valide → supprimer après usage
    db.session.delete(record)
    db.session.commit()
    return True

def send_2fa_code_email(email: str, code: str) -> None:
    subject="Votre code de vérification 2FA"
    body=f"Votre code de vérification est : {code}. Il expire dans 5 minutes."
    send_email(email, subject, body)