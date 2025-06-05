from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.facade import land_facade
from app.schemas.land_schema import LandSchema

api = Namespace('lands', description='Operations on lands')

# 🔷 Swagger model (only for documentation)
land_model = api.model('Land', {
    'id': fields.String(readonly=True, description='Land ID'),
    'name': fields.String(required=True, description='Land name'),
    'location': fields.String(required=True, description='Land location'),
    'area': fields.Float(required=True, description='Land area in hectares'),
    'owner_id': fields.String(readonly=True, description='Owner ID')
})

land_schema = LandSchema()
land_list_schema = LandSchema(many=True)

@api.route('/')
class LandList(Resource):
    @api.doc('list_lands')
    @api.marshal_list_with(land_model)
    def get(self):
        """Get all lands or filter by criteria"""
        name = request.args.get('name')
        location = request.args.get('location')
        area = request.args.get('area', type=float)
        owner_id = request.args.get('owner_id')

        if any([name, location, area, owner_id]):
            return land_facade.filter_lands(name=name, location=location, area=area, owner_id=owner_id)
        return land_facade.get_all_lands()

    @api.doc('create_land')
    @api.expect(land_model, validate=True)
    @api.marshal_with(land_model, code=201)
    @jwt_required()
    def post(self):
        """Create a new land"""
        try:
            data = request.get_json()
            data['owner_id'] = get_jwt_identity()

            validated_data = land_schema.load(data)
            new_land = land_facade.create_land(validated_data)
            return land_schema.dump(new_land), 201

        except ValidationError as err:
            return {'errors': err.messages}, 400
        except Exception as e:
            return {'message': str(e)}, 400


@api.route('/<string:land_id>')
@api.param('land_id', 'Land ID')
class Land(Resource):
    @api.doc('get_land')
    @api.marshal_with(land_model)
    def get(self, land_id):
        """Get a land by its ID"""
        land = land_facade.get_land_by_id(land_id)
        if land:
            return land_schema.dump(land)
        api.abort(404, "Land not found")

    @api.doc('update_land')
    @api.expect(land_model, validate=True)
    @api.marshal_with(land_model)
    @jwt_required()
    def put(self, land_id):
        """Update an existing land"""
        try:
            data = request.get_json()
            validated_data = land_schema.load(data, partial=True)  # Allow partial update if needed
            updated_land = land_facade.update_land(land_id, validated_data)
            if updated_land:
                return land_schema.dump(updated_land)
            api.abort(404, "Land not found")

        except ValidationError as err:
            return {'errors': err.messages}, 400
        except Exception as e:
            return {'message': str(e)}, 400

    @api.doc('delete_land')
    @jwt_required()
    def delete(self, land_id):
        """Delete a land by ID"""
        success = land_facade.delete_land(land_id)
        if success:
            return {'message': 'Land deleted'}, 200
        api.abort(404, "Land not found")
