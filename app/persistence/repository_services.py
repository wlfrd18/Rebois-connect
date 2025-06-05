# persistence/project_repository.py
from app.models.project import Project
from app.models.user import User
from app.models.land import Land
from app.models.project import Project
from .repository import SQLAlchemyRepository

class ProjectRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Project)


class UserRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, email):
        return self.model.query.filter_by(email=email).first()

class LandRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Land)
