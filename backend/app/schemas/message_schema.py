from marshmallow import Schema, fields

class MessageSchema(Schema):
    id = fields.UUID(dump_only=True)
    user_id = fields.UUID(required=True)
    content = fields.Str(required=True)
    room = fields.Str(required=True)
    timestamp = fields.DateTime(dump_only=True)
