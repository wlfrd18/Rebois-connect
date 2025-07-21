from app.models.message import Message
from app.extensions import db
from datetime import datetime
from app.facade.users_facade import UserFacade
import uuid

user_facade = UserFacade()

class MessageFacade:
    def __init__(self):
        pass

    def get_messages_by_room(room):
        messages = Message.query.filter_by(room=room).order_by(Message.timestamp.asc()).all()
        return [{
            "id": str(m.id),
            "user_id": str(m.user_id),
            "room": m.room,
            "content": m.content,
            "timestamp": m.timestamp.isoformat()
        } for m in messages]

    def create_message(user_id, room, content):
        message = Message(
            id=uuid.uuid4(),
            user_id=uuid.UUID(user_id),
            room=room,
            content=content,
            timestamp=datetime.utcnow()
        )
        db.session.add(message)
        db.session.commit()
        return {
            "id": str(message.id),
            "user_id": str(message.user_id),
            "room": message.room,
            "content": message.content,
            "timestamp": message.timestamp.isoformat()
        }

    def get_conversations_by_user(self, user_id):
        # Récupère toutes les rooms où l'utilisateur a écrit
        messages = Message.query.filter_by(user_id=user_id).all()
        rooms = list(set([m.room for m in messages]))

        return [{"room": room} for room in rooms]
    
    def get_or_create_room(self, user1_id, user2_id):
        # On ordonne les UUID pour générer un nom de room unique et cohérent
        ids = sorted([str(user1_id), str(user2_id)])
        room_name = f"{ids[0]}_{ids[1]}"

        # Vérifie si des messages existent déjà dans cette room
        existing_message = Message.query.filter_by(room=room_name).first()

        #Determiner l'autre utilisateur(cible) de la conversation
        target_user_id = user2_id if str(user1_id == ids[0]) else user1_id
        target_user = user_facade.get_a_user_by_id(target_user_id)

        if target_user is None:
            display_name = "Utilisateur inconnu"
        elif target_user.role == "tech_structure":
            display_name = target_user.first_name
        else:
            display_name = f"{target_user.first_name} {target_user.last_name} "

        return {"room": room_name,
                "user_name": display_name}
