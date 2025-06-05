# facade/project_facade.py
from ..persistence.repository_services import ProjectRepository
from app.schemas.project_schema import ProjectSchema
from app.models.project import Project



class ProjectFacades:
    def __init__(self):
        self.project_repo = ProjectRepository()
        self.project_schema = ProjectSchema()
        self.project_list_schema = ProjectSchema(many=True)

    def get_all_projects(self):
        projects = self.project_repo.get_all()
        return self.project_list_schema.dump(projects)

    def get_project_by_id(self, project_id):
        project = self.project_repo.get_by_id(project_id)
        return self.project_schema.dump(project) if project else None

    def create_project(self, data):
        project = Project(**data)
        created = self.project_repo.create(project)
        return self.project_schema.dump(created)

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
