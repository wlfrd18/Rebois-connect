from flask_socketio import emit, join_room, leave_room
from app.facade.messages_facade import MessageFacade

message_facade = MessageFacade()

def register_socketio_events(socketio):
    @socketio.on("join")
    def handle_join(data):
        room = data["room"]
        join_room(room)

    @socketio.on("leave")
    def handle_leave(data):
        room = data["room"]
        leave_room(room)

    @socketio.on("get_messages")
    def handle_get_messages(data):
        room = data["room"]
        messages = message_facade.get_messages_by_room(room)
        emit("messages_history", messages)

    @socketio.on("send_message")
    def handle_send_message(data):
        msg = message_facade.create_message(
            data["user_id"],
            data["room"],
            data["content"]
        )
        emit("receive_message", msg, room=data["room"])
