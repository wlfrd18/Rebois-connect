from marshmallow import Schema, fields, validates, ValidationError
from datetime import date
from .user_schema import UserSchema
from .land_schema import LandSchema

class ProjectSchema(Schema):
    id = fields.Str(dump_only=True)
    land_id = fields.Str(required=True)
    sponsor_id = fields.Str(required=True)
    volunteer_id = fields.Str(required=True)
    tech_structure_id = fields.Str(allow_none=True)
    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    report = fields.Str(allow_none=True)
    status = fields.Str(load_default='proposed')
    photo_url = fields.Str()
    sponsor_report = fields.Str(allow_none=True)
    sponsor_rating = fields.Int(allow_none=True)
    tech_report = fields.Str(allow_none=True)
    tech_rating = fields.Int(allow_none=True)

class ProjectFullSchema(Schema):
    id = fields.Str(dump_only=True)
    land_id = fields.Str(required=True)
    sponsor_id = fields.Str(required=True)
    volunteer_id = fields.Str(required=True)
    tech_structure_id = fields.Str(allow_none=True)
    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    report = fields.Str(allow_none=True)
    sponsor_report = fields.Str(allow_none=True)
    sponsor_rating = fields.Int(allow_none=True)
    tech_report = fields.Str(allow_none=True)
    tech_rating = fields.Int(allow_none=True)
    status = fields.Str(load_default='proposed')
    photo_url = fields.Str()
    area = fields.Float(required=True)
    weather_data = fields.String(allow_none=True)
    created_at = fields.Str(dump_only=True)

    # Champs injectés à la main (si tu les veux toujours à plat)
    country = fields.Str(dump_only=True)
    vegetation_type = fields.Str(dump_only=True)
    feasibility = fields.Str(dump_only=True)
    latitude = fields.Float(dump_only=True)
    longitude = fields.Float(dump_only=True)

    # ✅ Relations imbriquées
    land = fields.Nested(LandSchema, dump_only=True)
    sponsor = fields.Nested(UserSchema, dump_only=True)
    volunteer = fields.Nested(UserSchema, dump_only=True)
    tech_structure = fields.Nested(UserSchema, dump_only=True)

    @validates('status')
    def validate_status(self, value):
        allowed_statuses = ['proposed', 'in_progress', 'completed']
        if value not in allowed_statuses:
            raise ValidationError(f"Invalid status: {value}. Must be one of {allowed_statuses}.")

    @validates('end_date')
    def validate_dates(self, value):
        if 'start_date' in self.context and self.context['start_date']:
            start_date = self.context['start_date']
            if value and start_date and value < start_date:
                raise ValidationError("End date cannot be before start date.")
