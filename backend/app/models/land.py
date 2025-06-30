from typing import Optional, Dict, Any
from datetime import datetime
from ..extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

def current_time_no_seconds():
    return datetime.utcnow().replace(second=0, microsecond=0)

class Land(db.Model):
    __tablename__ = 'lands'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    owner_id: int = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=False)
    area: float = db.Column(db.Float, nullable=False)
    vegetation_type: str = db.Column(db.String(100), nullable=False)
    feasibility: str = db.Column(db.String(100), nullable=False)
    latitude: float = db.Column(db.Float, nullable=False)
    longitude: float = db.Column(db.Float, nullable=False)
    weather_data: Optional[Dict[str, Any]] = db.Column(db.JSON, nullable=True)
    status: str = db.Column(db.String(30), default='proposed')
    photo_url = db.Column(db.String(255), nullable=True)
    created_at: datetime = db.Column(db.DateTime, default=current_time_no_seconds)
    country = db.Column(db.String(100))


    def __init__(self,
                 owner_id: int,
                 area: float,
                 vegetation_type: str,
                 feasibility: str,
                 latitude: float,
                 longitude: float,
                 weather_data: Optional[Dict[str, Any]] = None,
                 status: str = 'proposed',
                 photo_url: Optional[str] = None,
                 country: Optional[str] = None ) -> None:
        self.owner_id = owner_id
        self.area = area
        self.vegetation_type = vegetation_type
        self.feasibility = feasibility
        self.latitude = latitude
        self.longitude = longitude
        self.weather_data = weather_data
        self.status = status
        self.photo_url = photo_url
        self.created_at = datetime.utcnow().replace(second=0, microsecond=0)
        self.country = country
        
        self.validate()

    def validate(self) -> None:
        if not (0 < self.area <= 10000):
            raise ValueError(f"Area invalide: {self.area}")
        if not (-90 <= self.latitude <= 90):
            raise ValueError(f"Latitude invalide: {self.latitude}")
        if not (-180 <= self.longitude <= 180):
            raise ValueError(f"Longitude invalide: {self.longitude}")
        if self.status not in ['proposed', 'in_progress', 'completed']:
            raise ValueError(f"Status invalide: {self.status}")
        if not self.vegetation_type.strip():
            raise ValueError("vegetation_type ne doit pas être vide")
        if not self.feasibility.strip():
            raise ValueError("feasibility ne doit pas être vide")

    def __repr__(self) -> str:
        return f"<Land {self.id} owned by {self.owner_id}>"
