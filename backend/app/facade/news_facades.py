from app.schemas.news_schema import NewsSchema
from app.models.news import News
from app.extensions import db
from app.persistence.repository_services import NewsRepository

class NewsFacade:
    def __init__(self):
        self.repo = NewsRepository()
        self.schema = NewsSchema()
        self.list_schema = NewsSchema(many=True)

    def get_all_news(self):
        news_items = self.repo.get_all()
        return self.list_schema.dump(news_items)

    def create_news(self, content):
        new = News(content=content)
        created = self.repo.create(new)
        return self.schema.dump(created)

    def update_news(self, news_id, content):
        updated = self.repo.update(news_id, {"content": content})
        return self.schema.dump(updated) if updated else None

    def delete_news(self, news_id):
        return self.repo.delete(news_id)
