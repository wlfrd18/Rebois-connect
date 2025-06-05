# facade/land_facade.py
from ..persistence.repository_services import LandRepository
from app.schemas.land_schema import LandSchema
from app.models.land import Land

class LandFacades:
    def __init__(self):
        self.land_repo = LandRepository()
        self.land_schema = LandSchema()
        self.land_list_schema = LandSchema(many=True)

    def get_all_lands(self):
        lands = self.land_repo.get_all()
        return self.land_list_schema.dump(lands)

    def get_land_by_id(self, land_id):
        land = self.land_repo.get_by_id(land_id)
        return self.land_schema.dump(land) if land else None

    def create_land(self, data):
        land = Land(**data)
        created = self.land_repo.create(land)
        return self.land_schema.dump(created)

    def update_land(self, land_id, data):
        updated = self.land_repo.update(land_id, data)
        return self.land_schema.dump(updated) if updated else None

    def delete_land(self, land_id):
        return self.land_repo.delete(land_id)

    def filter_lands(self, name=None, location=None, area=None, owner_id=None):
        filters = {
            'name': name,
            'location': location,
            'area': area,
            'owner_id': owner_id
        }
        lands = self.land_repo.filter_by_criteria(**filters)
        return self.land_list_schema.dump(lands)