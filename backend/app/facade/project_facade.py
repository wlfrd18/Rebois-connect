from ..persistence.repository_services import ProjectRepository, LandRepository  # importer LandRepository
from app.schemas.project_schema import ProjectSchema
from app.models.project import Project
from app.extensions import db

class ProjectFacades:
    def __init__(self):
        self.project_repo = ProjectRepository()
        self.land_repo = LandRepository()  # nouvelle dépendance
        self.project_schema = ProjectSchema()
        self.project_list_schema = ProjectSchema(many=True)

    def get_all_projects_detailed():
        return Project.query.options(
            db.joinedload(Project.land),
            db.joinedload(Project.sponsor),
            db.joinedload(Project.volunteer),
            db.joinedload(Project.tech_structure)
        ).order_by(Project.start_date.desc()).all()

    def get_all_projects(self):
        projects = self.project_repo.get_all()
        return self.project_list_schema.dump(projects)

    def get_project_by_id(self, project_id):
        project = self.project_repo.get_by_id(project_id)
        return self.project_schema.dump(project) if project else None
    
    def get_a_project_by_id(self, project_id):
        project = self.project_repo.get_by_id(project_id)
        return project

    def create_project(self, data):
        land = self.land_repo.get_by_id(data["land_id"])
        if not land:
            raise ValueError("Land not found for the given land_id")

        project = Project(**data)
        created = self.project_repo.create(project)

        # Injecter dynamiquement le pays dans l'objet retourné (non stocké)
        result = self.project_schema.dump(created)
        result["land_country"] = land.country  #expose le pays via la terre liée
        return result

    def update_project(self, project_id, data):
        updated = self.project_repo.update(project_id, data)
        return self.project_schema.dump(updated) if updated else None

    def delete_project(self, project_id):
        return self.project_repo.delete(project_id)

    def filter_projects(self, status=None, land_id=None, sponsor_id=None, volunteer_id=None):
        filters = {
            'status': status,
            'land_id': land_id,
            'sponsor_id': sponsor_id,
            'volunteer_id': volunteer_id
        }
        projects = self.project_repo.filter_by_criteria(**filters)
        return self.project_list_schema.dump(projects)

    def get_projects_by_user_id(user_id):
        
        return Project.query.filter(
            (Project.volunteer_id == user_id) |
            (Project.sponsor_id == user_id) |
            (Project.tech_structure_id == user_id)
        ).all()
