from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.facade.messages_facade import MessageFacade

api = Namespace("messages", description="Gestion des messages")

message_model = api.model("Message", {
    "room": fields.String(required=True),
    "content": fields.String(required=True),
})

room_request_model = api.model( "RoomRequest", {
    "user1_id": fields.String(required=True),
    "user2_id": fields.String(required=True),
})

message_facade = MessageFacade()

@api.route('/<string:room>')
@api.param('room', 'Nom de la salle/room')
class MessageList(Resource):
    @jwt_required()
    def get(self, room):
        """Obtenir tous les messages d'une room"""
        messages = message_facade.get_messages_by_room(room)
        return {"messages": messages}, 200

@api.route('/')
class SendMessage(Resource):
    @jwt_required()
    @api.expect(message_model)
    def post(self):
        """Envoyer un message via HTTP"""
        user_id = get_jwt_identity()
        data = request.get_json()
        content = data.get("content")
        room = data.get("room")

        if not content or not room:
            return {"message": "Contenu et room requis"}, 400

        message = message_facade.create_message(user_id, room, content)
        return {"message": message}, 201
    
    @jwt_required()
    def get(self):
        "récupérer des messages recents de l'utilisateur"
        user_id = get_jwt_identity()
        messages = message_facade.get_recent_messages(user_id)
        return {"messages" : messages}, 200

@api.route("/conversations/<uuid:user_id>")
class UserConversations(Resource):
    def get(self, user_id):
        conversations = message_facade.get_conversations_by_user(user_id)
        return conversations, 200

@api.route('/room')
class RoomResource(Resource):
    @jwt_required()
    @api.expect(room_request_model)
    def post(self):
        """Créer ou récupérer une room entre deux utilisateurs"""
        data = request.get_json()
        user1_id = data.get("user1_id")
        user2_id = data.get("user2_id")

        if not user1_id or not user2_id:
            return {"message": "Les deux identifiants utilisateur sont requis"}, 400

        room = message_facade.get_or_create_room(user1_id, user2_id)
        return room, 200
