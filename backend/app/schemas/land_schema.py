from marshmallow import Schema, fields

class LandSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    location = fields.Str(required=True)
    area = fields.Float(required=True)
    owner_id = fields.Str(dump_only=True)
