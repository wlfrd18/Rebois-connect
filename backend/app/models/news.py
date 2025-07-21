from app.extensions import db
import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

def current_time_no_seconds():
    return datetime.utcnow().replace(second=0, microsecond=0)

class News(db.Model):
    __tablename__ = 'news'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=current_time_no_seconds)
