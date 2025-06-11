from app.extensions import db
from datetime import datetime, timedelta

class TwoFaCode(db.Model):
    __tablename__ = 'two_fa_codes'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expire_at = db.Column(db.DateTime, nullable=False)
