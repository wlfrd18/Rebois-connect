from datetime import date
import uuid
from typing import Optional
from ..extensions import db

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Uuid, primary_key=True, default=uuid.uuid4)

    land_id = db.Column(db.Uuid, db.ForeignKey('lands.id'), nullable=False)
    sponsor_id = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=False)
    volunteer_id = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=False)
    tech_structure_id = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=True)

    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    report = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), default='proposed', nullable=False)
    photo_url = db.Column(db.String(255), nullable=True)

    # Relationships
    land = db.relationship('Land', backref='projects')
    sponsor = db.relationship('User', foreign_keys=[sponsor_id])
    volunteer = db.relationship('User', foreign_keys=[volunteer_id])
    tech_structure = db.relationship('User', foreign_keys=[tech_structure_id])

    def __init__(
        self,
        land_id: uuid.UUID,
        sponsor_id: uuid.UUID,
        volunteer_id: uuid.UUID,
        tech_structure_id: Optional[uuid.UUID] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        report: Optional[str] = None,
        status: str = 'proposed',
        photo_url: Optional[str] = None
    ) -> None:
        self.land_id = land_id
        self.sponsor_id = sponsor_id
        self.volunteer_id = volunteer_id
        self.tech_structure_id = tech_structure_id
        self.start_date = start_date
        self.end_date = end_date
        self.report = report
        self.status = status
        self.photo_url = photo_url

        self.validate()

    def validate(self) -> None:
        valid_status = ['proposed', 'in_progress', 'completed']
        if self.status not in valid_status:
            raise ValueError(f"Status invalide: {self.status}")

        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("Date de fin antérieure à la date de début")

    def __repr__(self) -> str:
        return f"<Project {self.id} status={self.status}>"
