from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.facade import land_facade
from app.schemas.land_schema import LandSchema
from app.models.project import Project
from app.models.user import User
from app.extensions import db
from datetime import datetime

api = Namespace('lands', description='Operations on lands')

# 🔷 Swagger model (only for documentation)
land_model = api.model('Land', {
    'id': fields.String(readonly=True, description='Land ID'),
    'name': fields.String(required=True, description='Land name'),
    'location': fields.String(required=True, description='Land location'),
    'area': fields.Float(required=True, description='Land area in hectares'),
    'owner_id': fields.String(readonly=True, description='Owner ID')
})

lands_model  = api.model('Land', {
    'id': fields.String,
    'country': fields.String,
    'area': fields.Float,
    'vegetation_type': fields.String,
    'status': fields.String,
    'created_at': fields.DateTime,
    'owner_id': fields.String,
    'photo_url': fields.String
})

project_model = api.model('Project', {
    'id': fields.String,
    'land_id': fields.String,
    'sponsor_id': fields.String,
    'volunteer_id': fields.String,
    'tech_structure_id': fields.String,
    'start_date': fields.Date,
    'end_date': fields.Date,
    'status': fields.String,
    'photo_url': fields.String
})

@api.route('/')
class LandList(Resource):
    @jwt_required()
    @api.marshal_list_with(lands_model)
    def get(self):
        # Renvoie les terres sans projet ou avec projets "proposed" (pas encore sponsorisés)
        lands = Land.query.outerjoin(Project).filter(
            (Project.id == None) | (Project.status == 'proposed')
        ).all()
        return lands


@api.route('/<string:land_id>/sponsor')
class LandSponsor(Resource):
    @jwt_required()
    def post(self, land_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'sponsor':
            return {"message": "Non autorisé"}, 403
        
        land = land_facade.get_a_land_by_id(land_id)
        if not land:
            return {"message": "Terre non trouvée"}, 404
        
        # Vérifier si projet déjà existant pour cette terre
        existing_project = Project.query.filter_by(land_id=land_id).first()
        if existing_project and existing_project.status != 'proposed':
            return {"message": "Projet déjà sponsorisé"}, 400

        # Créer un projet à partir de la terre
        new_project = Project(
            land_id=land.id,
            sponsor_id=user.id,
            volunteer_id=user.id,  # Pour l'exemple, tu devras récupérer ça dynamiquement
            status='in_progress',
            start_date=datetime.today(),
            photo_url=land.photo_url
        )
        db.session.add(new_project)
        db.session.commit()

        return {"message": "Projet sponsorisé avec succès", "project_id": str(new_project.id)}, 201

land_schema = LandSchema()
land_list_schema = LandSchema(many=True)

@api.route('/')
class LandList(Resource):
    @api.doc('list_lands')
    @api.marshal_list_with(land_model)
    def get(self):
        """Get all lands or filter by criteria"""
        name = request.args.get('name')
        area = request.args.get('area', type=float)
        owner_id = request.args.get('owner_id')
        vegetation_type = request.args.get('vegetation_type')
        area_min = request.args.get('area_min')
        area_max = request.args.get('area_max')
        created_after = request.args.get('created_after')
        created_before = request.args.get('created_before')
        country = request.args.get('country')

        if any([name, area, owner_id, vegetation_type, area_min, area_max, created_after, created_before, country]):
            return land_facade.filter_lands(name=name,
                                            area=area,
                                            owner_id=owner_id,
                                            vegetation_type=vegetation_type,
                                            area_min=area_min,
                                            area_max=area_max, 
                                            created_after=created_after, 
                                            created_before=created_before, 
                                            country=country)
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
