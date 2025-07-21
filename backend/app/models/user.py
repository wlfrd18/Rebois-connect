import re
import uuid
from typing import Optional, Literal
from datetime import datetime
from ..extensions import db, bcrypt
import phonenumbers
from phonenumbers.phonenumberutil import NumberParseException
from sqlalchemy.dialects.postgresql import UUID


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    first_name: str = db.Column(db.String(50), nullable=False)
    last_name: str = db.Column(db.String(50), nullable=False)
    email: str = db.Column(db.String(120), unique=True, nullable=False)
    phone: str = db.Column(db.String(15), unique=True, nullable=False)
    role: str = db.Column(db.String(30), nullable=False)  # volunteer, sponsor, tech_structure, superuser
    password_hash: str = db.Column(db.String(128), nullable=False)
    otp_secret: Optional[str] = db.Column(db.String(32), nullable=True)
    created_at: datetime = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=False)
    photo_url: Optional[str] = db.Column(db.String, nullable=True)

    def __init__(self,
                 first_name: str,
                 last_name: str,
                 email: str,
                 phone: str,
                 role: Literal['volunteer', 'sponsor', 'tech_structure', 'superuser'],
                 password: str,
                 otp_secret: Optional[str] = None,
                 is_active: bool = False,
                 photo_url: Optional[str] = None) -> None:
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone
        self.role = role
        self.otp_secret = otp_secret
        self.is_active = is_active
        self.photo_url = photo_url

        self.validate()
        self.validate_password(password)
        self.set_password(password)

    def validate(self) -> None:
        if not self.first_name or len(self.first_name.strip()) < 2:
            raise ValueError("veuillez entrer un prenom valide")
        if not self.last_name or len(self.last_name.strip()) < 2:
            raise ValueError("Veuillez entrer un nom valide")
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, self.email):
            raise ValueError(f"Email invalide: {self.email}")
        # Validation internationale du téléphone
        try:
            parsed_phone = phonenumbers.parse(self.phone, None)  # None: pas de pays par défaut
            if not phonenumbers.is_possible_number(parsed_phone):
                raise ValueError(f"Numéro de téléphone impossible: {self.phone}")
            if not phonenumbers.is_valid_number(parsed_phone):
                raise ValueError(f"Numéro de téléphone invalide: {self.phone}")
        except NumberParseException:
            raise ValueError(f"Numéro de téléphone mal formaté: {self.phone}")
        if self.role not in ['volunteer', 'sponsor', 'tech_structure', 'superuser']:
            raise ValueError(f"Rôle invalide: {self.role}")

    def validate_password(self, password: str) -> None:
        """Valide le mot de passe selon les critères:
           - Au moins 8 caractères
           - Au moins une lettre
           - Au moins un chiffre
           - Au moins un caractère spécial
        """
        if len(password) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères.")
        if not re.search(r'[A-Za-z]', password):
            raise ValueError("Le mot de passe doit contenir au moins une lettre.")
        if not re.search(r'\d', password):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValueError("Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&* etc.).")

    def set_password(self, password: str) -> None:
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self) -> str:
        return f"<User {self.email}>"
