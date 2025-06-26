from marshmallow import Schema, fields, validate


class UserRegisterSchema(Schema):
    email = fields.Email(required=True, metadata={"description" : "Adresse email de l'utilisateur"})
    password = fields.String(required=True, validate=validate.Length(min=8), 
                             metadata={"description" : "mot de passe sécurié (Minimum 8 caractères)"})
    first_name = fields.String(required=True, metadata={"description" : "Prenom de l'utlisateur"})
    last_name = fields.String(required=True, metadata={"description" : "Nom de l'utilisateur"})
    phone = fields.String(required=True) 
    role = fields.String(required=True, validate=validate.OneOf(["volunteer", "sponsor", "tech_structure", "superuser"]))


class UserLoginSchema(Schema):
    email = fields.Email(required=True, metadata={"description" : "Email pour la connexion"})
    password = fields.String(required=True, metadata={"description" : "Mot de passe"})


class User2FASchema(Schema):
    email = fields.Email(required=True, metadata={"description" : "Code de vérification 2FA (TOTP ou reçu par SMS)"} )
    code = fields.String(required=True, metadata={"description": "Code de vérification 2FA (TOTP ou reçu par email)"})

class UserSchema(Schema):  # Pour la réponse d’un utilisateur
    id = fields.String(dump_only=True)
    email = fields.Email()
    first_name = fields.String()
    last_name = fields.String()
    phone = fields.String()
    is_active = fields.Boolean()
    photo_url = fields.String(required=False)
    role = fields.String(required=False)
