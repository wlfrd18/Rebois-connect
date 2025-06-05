# create_superuser.py

import getpass
import uuid
from app import create_app
from app.extensions import db
from app.facade import UserFacade

app = create_app()
app.app_context().push()

def main():
    print("Création du super utilisateur")
    first_name = input("Prénom : ")
    last_name = input("Nom : ")
    email = input("Email : ")
    phone = input("Téléphone : ")
    password = getpass.getpass("Mot de passe : ")
    password_confirm = getpass.getpass("Confirmer le mot de passe : ")

    if password != password_confirm:
        print("Les mots de passe ne correspondent pas.")
        return

    try:
        user = UserFacade.create_superuser(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            password=password
        )
        print(f"Super utilisateur créé avec l'ID : {user.id}")
    except Exception as e:
        print(f"Erreur lors de la création : {e}")

if __name__ == '__main__':
    main()
