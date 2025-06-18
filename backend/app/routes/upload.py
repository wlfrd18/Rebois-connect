from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from flask import url_for
import os
from uuid import uuid4

api = Namespace('upload', description='Opération de téléversement de fichiers')

UPLOAD_FOLDER = 'static/photos'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

upload_response = api.model('UploadResponse', {
    'photo_url': fields.String(description='URL publique de la photo')
})

@api.route('/')
class UploadResource(Resource):
    @api.doc('upload_file')
    @api.response(200, 'Succès', upload_response)
    @api.response(400, 'Erreur')
    @jwt_required()
    def post(self):
        """Uploader une image de profil (jpg, png, etc.)"""
        if 'file' not in request.files:
            return {'message': 'Aucun fichier fourni'}, 400

        file = request.files['file']

        if file.filename == '':
            return {'message': 'Nom de fichier vide'}, 400

        if file and allowed_file(file.filename):
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = secure_filename(f"{uuid4().hex}.{ext}")
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            photo_url = url_for('static', filename=f'photos/{filename}', _external=True)
            return {'photo_url': photo_url}, 200

        return {'message': 'Type de fichier non autorisé'}, 400
