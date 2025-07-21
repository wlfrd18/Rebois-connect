from flask import current_app
import smtplib
from email.mime.text import MIMEText

def send_email(to_email, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = current_app.config['MAIL_DEFAULT_SENDER']
    msg['To'] = to_email

    with smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT']) as server:
        server.starttls()
        server.login(current_app.config['MAIL_USERNAME'], current_app.config['MAIL_PASSWORD'])
        server.send_message(msg)

def send_activation_email(to_email, activation_link):
    subject = "Activation de votre compte Rebois Connect"
    body = f"""Bonjour,

Merci pour votre inscription sur Rebois Connect !

Veuillez cliquer sur le lien ci-dessous pour activer votre compte (valide 1h) :

<a href="{activation_link}">Activer mon compte</a>

Si vous n'avez pas demandé cela, ignorez cet email.

Cordialement,
L'équipe Rebois Connect
"""
    send_email(to_email, subject, body)
