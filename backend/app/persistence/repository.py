# persistence/repository.py
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional, Any
from app.extensions import db

T = TypeVar('T')  # Generic type for model

class Repository(ABC, Generic[T]):
    @abstractmethod
    def get_all(self) -> List[T]:
        pass

    @abstractmethod
    def get_by_id(self, id: str) -> Optional[T]:
        pass

    @abstractmethod
    def create(self, obj: T) -> T:
        pass

    @abstractmethod
    def update(self, id: str, data: dict) -> Optional[T]:
        pass

    @abstractmethod
    def delete(self, id: str) -> bool:
        pass


class SQLAlchemyRepository(Repository[T]):
    def __init__(self, model):
        self.model = model

    def get_all(self) -> List[T]:
        return self.model.query.all()

    def get_by_id(self, id: str) -> Optional[T]:
        return self.model.query.get(id)

    def create(self, obj: T) -> T:
        db.session.add(obj)
        db.session.commit()
        return obj

    def update(self, id: str, data: dict) -> Optional[T]:
        obj = self.get_by_id(id)
        if not obj:
            return None
        for key, value in data.items():
            setattr(obj, key, value)
        db.session.commit()
        return obj

    def delete(self, id: str) -> bool:
        obj = self.get_by_id(id)
        if not obj:
            return False
        db.session.delete(obj)
        db.session.commit()
        return True

    def filter_by_criteria(self, **kwargs):
        """Filtrer les objets par critères dynamiques"""
        query = self.model.query
        for key, value in kwargs.items():
            if value is not None:
                query = query.filter(getattr(self.model, key) == value)
        return query.all()

    def get_by_user(self, user_id: Any) -> List[T]:
        """
        Récupère les enregistrements liés à un user:
        - Pour un modèle Land: filtre sur owner_id
        - Pour un modèle Project: filtre sur sponsor_id, volunteer_id ou tech_structure_id
        """
        query = self.model.query
        # Terre
        if hasattr(self.model, 'owner_id'):
            return query.filter(self.model.owner_id == user_id).all()

        # Projet
        if hasattr(self.model, 'sponsor_id') and hasattr(self.model, 'volunteer_id'):
            return query.filter(
                (self.model.sponsor_id == user_id) |
                (self.model.volunteer_id == user_id) |
                (getattr(self.model, 'tech_structure_id', None) == user_id)
            ).all()

        # Par défaut, rien
        return []
    