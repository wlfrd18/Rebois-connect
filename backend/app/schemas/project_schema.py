from marshmallow import Schema, fields, validates, ValidationError
from datetime import date


class ProjectSchema(Schema):
    id = fields.Str(dump_only=True)
    land_id = fields.Int(required=True)
    sponsor_id = fields.Int(required=True)
    volunteer_id = fields.Int(required=True)
    tech_structure_id = fields.Int(allow_none=True)
    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    report = fields.Str(allow_none=True)
    status = fields.Str(load_default='proposed')
    photo_url = fields.Str()

    # Champ pour afficher le pays (injecté dans la facade)
    land_country = fields.Str(dump_only=True)

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
