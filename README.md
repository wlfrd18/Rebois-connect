# Rebois Connect

**Rebois Connect** est une plateforme de reforestation participative qui facilite la collaboration entre **volontaires**, **sponsors** et **structures techniques** pour protéger et restaurer nos forêts.  
Développé avec ❤️ par [@wlfrd18](https://github.com/wlfrd18) et [@Kanga-prog](https://github.com/kanga-prog)

---

## 📦 Structure du projet

```
rebois-connect/
├── backend/          # API REST (Flask)
├── frontend/         # Application web (React + Tailwind CSS)
└── README.md         # Ce fichier
```

---

## 🚀 Fonctionnalités principales

- 🔐 Authentification sécurisée avec 2FA par email
- 👥 Gestion multi-rôles : volontaire, sponsor, structure technique, superutilisateur
- 🗺️ Cartographie et gestion de projets de reforestation
- 📬 Validation d'inscription via email
- 🌐 Frontend navigable (Accueil, Connexion, À propos, Contact, Partenaires)

---

## 🧑‍💻 Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/wlfrd18/rebois-connect.git
cd rebois-connect
```

---

### 2. Lancer le backend Flask

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

Par défaut, le backend s'exécute sur : [http://localhost:5000](http://localhost:5000)

---

### 3. Lancer le frontend React

Dans un autre terminal :

```bash
cd frontend
npm install
npm start
```

Par défaut, le frontend s'exécute sur : [http://localhost:3000](http://localhost:3000)

> ⚠️ Assure-toi que le backend accepte les requêtes CORS depuis `localhost:3000`.

---

## 🧱 Technologies utilisées

### 🔧 Backend

- Flask & Flask-RESTX
- SQLAlchemy
- JWT (authentification)
- Flask-Mail (email de confirmation)
- Marshmallow (validation de schéma)
- CORS

### 🎨 Frontend

- React.js
- Tailwind CSS
- Formik + Yup
- Axios
- React Router

---

## 🌍 Engagement environnemental

Ce projet s’inscrit dans une logique de **développement durable** et vise à répondre aux **Objectifs de Développement Durable (ODD)** des Nations Unies, notamment :

- ODD 13 : Lutte contre les changements climatiques  
- ODD 15 : Vie terrestre (restauration des écosystèmes forestiers)

Le code et les données produits peuvent être réutilisés sous réserve de respect de la licence et de l’éthique environnementale.

---

## 📜 Licence

Ce projet est distribué sous licence **MIT**.  
Vous êtes libre de l’utiliser, le modifier, ou le redistribuer dans un cadre éthique, en lien avec des projets écologiques ou éducatifs.

---

## 📫 Contact

- 📧 contact@rebois.org  
- 🧑‍💻 Auteur : [@wlfrd18](https://github.com/wlfrd18)  [@Kanga-prog](https://github.com/kanga-prog)
- 🌐 Site officiel (en cours) : [https://rebois.org](https://rebois.org)

---

**Rebois Connect** – pour une planète plus verte 🌳
