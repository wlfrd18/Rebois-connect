# facade/user_facade.py
from ..persistence.repository_services import UserRepository
from app.schemas.user_schema import UserSchema
from app.models.user import User
from app.extensions import db

class UserFacades:
    def __init__(self):
        self.user_repo = UserRepository()
        self.user_schema = UserSchema()
        self.user_list_schema = UserSchema(many=True)

    def get_all_users(self):
        users = self.user_repo.get_all()
        return self.user_list_schema.dump(users)

    def get_user_by_id(self, user_id):
        user = self.user_repo.get_by_id(user_id)
        return self.user_schema.dump(user) if user else None

    def get_user_by_email(self, email):
        user = self.user_repo.get_by_email(email)
        return self.user_schema.dump(user) if user else None
    
    def get_a_user_by_email(self, email):
        user = self.user_repo.get_by_email(email)
        return user  # Pas de dump ici, on veut l'objet User, pas un dict


    def create_user(self, data):
        user = User(**data)
        user.is_active = False  # utilisateur inactif jusqu’à activation
        created = self.user_repo.create(user)
        return self.user_schema.dump(created)

    def create_superuser(self, **kwargs):
        kwargs['role'] = 'superuser'
        # Assure-toi de fournir tous les champs nécessaires ici
        return self.create_user(**kwargs)

    def update_user(self, user_id, data):
        updated = self.user_repo.update(user_id, data)
        return self.user_schema.dump(updated) if updated else None

    def delete_user(self, user_id):
        return self.user_repo.delete(user_id)

    def activate_user(self, user_email):
        user_obj = self.user_repo.get_by_email(user_email)  # ici on récupères l'objet ORM
        if not user_obj:
            return None
        user_obj.is_active = True
        db.session.commit()
        return self.user_schema.dump(user_obj)
