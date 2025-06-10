from typing import Optional
from datetime import date
from ..extensions import db
import uuid

class Project(db.Model):
    __tablename__ = 'projects'

    id: uuid.UUID = db.Column(db.Uuid, primary_key=True)
    land_id: int = db.Column(db.Uuid, db.ForeignKey('lands.id'), nullable=False)
    sponsor_id: int = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=False)
    volunteer_id: int = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=False)
    tech_structure_id: Optional[int] = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=True)
    start_date: Optional[date] = db.Column(db.Date, nullable=True)
    end_date: Optional[date] = db.Column(db.Date, nullable=True)
    report: Optional[str] = db.Column(db.Text, nullable=True)
    status: str = db.Column(db.String(30), default='proposed')

    land = db.relationship('Land')
    sponsor = db.relationship('User', foreign_keys=[sponsor_id])
    volunteer = db.relationship('User', foreign_keys=[volunteer_id])
    tech_structure = db.relationship('User', foreign_keys=[tech_structure_id])

    def __init__(self,
                 land_id: int,
                 sponsor_id: int,
                 volunteer_id: int,
                 tech_structure_id: Optional[int] = None,
                 start_date: Optional[date] = None,
                 end_date: Optional[date] = None,
                 report: Optional[str] = None,
                 status: str = 'proposed') -> None:
        self.land_id = land_id
        self.sponsor_id = sponsor_id
        self.volunteer_id = volunteer_id
        self.tech_structure_id = tech_structure_id
        self.start_date = start_date
        self.end_date = end_date
        self.report = report
        self.status = status

        self.validate()

    def validate(self) -> None:
        valid_status = ['proposed', 'in_progress', 'completed']
        if self.status not in valid_status:
            raise ValueError(f"Status invalide: {self.status}")

        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("Date de fin antérieure à date de début")

    def __repr__(self) -> str:
        return f"<Project {self.id} status={self.status}>"
