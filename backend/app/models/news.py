from app.extensions import db
import uuid
from datetime import datetime

class News(db.Model):
    __tablename__ = 'news'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
