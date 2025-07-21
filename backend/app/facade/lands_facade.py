from ..persistence.repository_services import LandRepository
from app.schemas.land_schema import LandSchema
from app.models.land import Land
from app.services.geolocation_service import get_country_from_coordinates


class LandFacade:
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
    
    def get_a_land_by_id(self, land_id):
        land = self.land_repo.get_by_id(land_id)
        return land

    def create_land(self, data):
        land = Land(**data)
        created = self.land_repo.create(land)
        return self.land_schema.dump(created)


    def update_land(self, land_id, data):
        updated = self.land_repo.update(land_id, data)
        return self.land_schema.dump(updated) if updated else None

    def delete_land(self, land_id):
        return self.land_repo.delete(land_id)

    def filter_lands(
        self,
        vegetation_type=None,
        area_min=None,
        area_max=None,
        created_after=None,
        created_before=None,
        country=None,
        owner_id=None
    ):
        filters = {
            "vegetation_type": vegetation_type,
            "area_min": area_min,
            "area_max": area_max,
            "created_after": created_after,
            "created_before": created_before,
            "country": country,
            "owner_id": owner_id
        }
        lands = self.land_repo.filter_by_criteria(**filters)
        return self.land_list_schema.dump(lands)

    def get_lands_by_user_id(self, user_id):
        lands = self.land_repo.get_by_user(user_id)
        return lands
