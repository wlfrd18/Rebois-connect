import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'une_clef_secrete_pour_dev')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://rebois_user:rebois_pass@localhost:5432/rebois_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'une_autre_clef_secrete')
    # Configuration pour service SMS, par exemple Twilio
    SMS_API_KEY = os.getenv('SMS_API_KEY')
    SMS_API_SECRET = os.getenv('SMS_API_SECRET')
    MAIL_SERVER = 'smtp-relay.brevo.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_DEFAULT_SENDER = 'reboisconnect@gmail.com'
    MAIL_USERNAME = '8efba4001@smtp-brevo.com'
    MAIL_PASSWORD = os.getenv('BREVO_SMTP_KEY')
    SECRET_KEY = 'Master Password'
