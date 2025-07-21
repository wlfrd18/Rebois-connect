# persistence/project_repository.py
from app.models.project import Project
from app.models.user import User
from app.models.land import Land
from app.models.project import Project
from app.models.message import Message
from .repository import SQLAlchemyRepository
from app.models.news import News
from app.extensions import db


class ProjectRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Project)


class UserRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, email):
        return self.model.query.filter_by(email=email).first()
    
    def get_by_role(self, role):
        return self.model.query.filter_by(role=role).all()

class LandRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Land)

    def filter_by_criteria(
        self,
        vegetation_type=None,
        area_min=None,
        area_max=None,
        created_after=None,
        created_before=None,
        country=None,
        owner_id=None
    ):
        query = self.session.query(Land)

        if vegetation_type:
            query = query.filter(Land.vegetation_type == vegetation_type)

        if area_min is not None:
            query = query.filter(Land.area >= area_min)

        if area_max is not None:
            query = query.filter(Land.area <= area_max)

        if created_after:
            query = query.filter(Land.created_at >= created_after)

        if created_before:
            query = query.filter(Land.created_at <= created_before)

        if country:  # zone = pays ici
            query = query.filter(Land.country == zone)


        if owner_id:
            query = query.filter(Land.owner_id == owner_id)

        return query.all()


class NewsRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(News)

    def get_all(self):
        return News.query.order_by(News.created_at.desc()).all()

    def get_by_id(self, news_id):
        return News.query.get(news_id)

    def create(self, news):
        db.session.add(news)
        db.session.commit()
        return news

    def update(self, news_id, data):
        news = self.get_by_id(news_id)
        if not news:
            return None
        for key, value in data.items():
            setattr(news, key, value)
        db.session.commit()
        return news

    def delete(self, news_id):
        news = self.get_by_id(news_id)
        if not news:
            return False
        db.session.delete(news)
        db.session.commit()
        return True
    
class MessageRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Message)

    def get_by_field(self, field_name, value, order_by=None):
        query = Message.query.filter(getattr(Message, field_name) == value)
        if order_by:
            query = query.order_by(getattr(Message, order_by).asc())
        return query.all()
