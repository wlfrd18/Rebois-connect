import os

class Config:
    # Clé secrète Flask
    SECRET_KEY = os.getenv("SECRET_KEY")

    # PostgreSQL (Render)
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # Mail (Brevo)
    MAIL_SERVER = "smtp-relay.brevo.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "apikey"
    MAIL_PASSWORD = os.getenv("BREVO_SMTP_KEY")
    MAIL_DEFAULT_SENDER = "reboisconnect@gmail.com"

    # Mode debug
    DEBUG = False
