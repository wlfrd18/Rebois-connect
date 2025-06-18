from marshmallow import Schema, fields

class LandSchema(Schema):
    id = fields.Str(dump_only=True)
    area = fields.Float(required=True)
    vegetation_type = fields.Str(required=True)
    feasibility = fields.Str(required=True)
    latitude = fields.Float(required=True)
    longitude = fields.Float(required=True)
    photo_url = fields.Str(allow_none=True)
    country = fields.Str(required=False)
    owner_id = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    status = fields.Str(dump_only=True)
