from marshmallow import Schema, fields

class NewsSchema(Schema):
    id = fields.String(dump_only=True)
    content = fields.String(required=True)
    created_at = fields.DateTime(dump_only=True)
