from app.extensions import db
import uuid
from datetime import datetime
from ..extensions import db
from sqlalchemy.dialects.postgresql import UUID

class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable = False )
    content = db.Column(db.Text, nullable=False)
    room = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
