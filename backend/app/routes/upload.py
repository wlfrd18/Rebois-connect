from flask_restx import Namespace, Resource, fields
from flask import request, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from flask import url_for
import os
from uuid import uuid4
import logging

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
        print(" Headers reçus :", dict(request.headers))
        
        if 'file' not in request.files:
            return {'message': 'Aucun fichier fourni'}, 400

        file = request.files['file']

        if file.filename == '':
            return {'message': 'Nom de fichier vide'}, 400

        if file and allowed_file(file.filename):
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = secure_filename(f"{uuid4().hex}.{ext}")

            # Construire le chemin absolu avec root_path
            upload_folder = os.path.join(current_app.root_path, 'static', 'photos')
            os.makedirs(upload_folder, exist_ok=True)

            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)

            # Générer l'URL publique correctement
            photo_url = url_for('static', filename=f'photos/{filename}', _external=True)

            current_app.logger.info(f"✅ Fichier sauvegardé: {filepath}")
            current_app.logger.info(f"🌍 URL publique générée: {photo_url}")

            return {'photo_url': photo_url}, 200

        return {'message': 'Type de fichier non autorisé'}, 400
