from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required

from app.facade import news_facade
from .auth import require_superuser  # pour vérifier admin

api = Namespace('news', description='Gestion des actualités')


news_model = api.model('News', {
    'id': fields.String(readonly=True),
    'content': fields.String(required=True),
    'created_at': fields.DateTime(readonly=True),
})

@api.route('/')
class NewsList(Resource):
    def get(self):
        return {"news": news_facade.get_all_news()}

    @jwt_required()
    @api.expect(news_model)
    def post(self):
        require_superuser()
        data = request.get_json()
        return news_facade.create_news(data['content']), 201

@api.route('/<string:news_id>')
@api.param('news_id', 'ID de l’actualité')
class NewsItem(Resource):
    @jwt_required()
    def delete(self, news_id):
        require_superuser()
        success = news_facade.delete_news(news_id)
        if success:
            return {'message': 'Supprimée'}, 200
        api.abort(404, 'News non trouvée')

    @jwt_required()
    @api.expect(api.model('NewsUpdate', {'content': fields.String(required=True)}))
    def put(self, news_id):
        require_superuser()
        data = request.get_json()
        return news_facade.update_news(news_id, data['content'])
