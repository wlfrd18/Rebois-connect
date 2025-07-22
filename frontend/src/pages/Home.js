import React from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignInRedirect from "../components/SignInRedirect";
import { FaHandsHelping } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { RiShieldCheckLine } from "react-icons/ri";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-green-50 text-gray-800">

      {/* Header avec navigation */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-green-700">Rebois-Connect</h1>
          <ul className="flex gap-6 text-green-700 font-semibold">
            <li><a href="#features" className="hover:underline">Fonctionnalités</a></li>
            <li><a href="#about" className="hover:underline">À propos</a></li>
            <li><a href="#login" className="hover:underline">Connexion</a></li>
          </ul>
        </nav>
      </header>

      {/* Section d’introduction */}
      <section className="flex flex-col items-center justify-center text-center px-4 md:px-0 max-w-4xl mx-auto mt-10">
        <img
          src="/images/intro.jpg"
          alt="Forêt et nature"
          className="rounded-lg shadow-lg mb-8 max-h-96 object-cover w-full"
        />
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-green-900">
          Rebois-Connect
        </h2>
        <p className="text-lg md:text-xl text-green-700 max-w-2xl mb-8">
 Une plateforme collaborative innovante qui met en relation propriétaires fonciers, volontaires, structures techniques et sponsors pour faciliter la gestion et le suivi de projets de reboisement.
        </p>
      </section>

      {/* Section fonctionnalités */}
      <section id="features" className="bg-white py-16 px-6 md:px-0">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-3xl font-bold text-green-800 mb-12">Fonctionnalités clés</h3>
          <div className="grid gap-12 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <img src="/images/user.png" alt="Comptes" className="mb-4 w-24 h-24" />
              <h4 className="text-xl font-semibold text-green-700 mb-2">Comptes personnalisés</h4>
              <p>
                Créez un compte adapté à votre rôle : propriétaire/volontaire, structure technique ou sponsor, avec un tableau de bord personnalisé.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <img src="/images/trees.png" alt="Terrains" className="mb-4 w-24 h-24" />
              <h4 className="text-xl font-semibold text-green-700 mb-2">Visualisation des terrains</h4>
              <p>
                Explorez les terrains disponibles, avec fiches détaillées et photos, pour mieux choisir vos projets de reboisement.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <img src="/images/weather.png" alt="Météo" className="mb-4 w-24 h-24" />
              <h4 className="text-xl font-semibold text-green-700 mb-2">Météo connectée</h4>
              <p>
                Consultez la météo en temps réel pour chaque terrain, afin d’optimiser vos interventions sur le terrain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos + cartes acteurs */}
      <section id="about" className="bg-green-100 py-16 px-6 md:px-0">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-green-900 mb-8">À propos du projet</h3>
          <p className="text-lg mb-6 text-green-800">
            Ce projet est né d’une passion personnelle pour la nature et la lutte contre la déforestation. L’idée était de créer un outil simple et efficace pour faciliter la collaboration entre les acteurs engagés dans le reboisement. C’est aussi un projet portfolio réalisé dans le cadre de la formation à Holberton School.  
          </p>
          <p className="mb-8 text-green-800">
            Vous pouvez retrouver le code source sur <a href="https://github.com/wlfrd18/rebois-connect" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">GitHub</a>.
          </p>

          {/* Cartes d’acteurs */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FaHandsHelping className="text-3xl text-greenvegetal mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Volontaires</h3>
              <p>
                Proposez vos terrains pour des projets de reboisement et participez à la reforestation.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <GiReceiveMoney className="text-3xl text-greenvegetal mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Mécènes</h3>
              <p>
                Financez des projets vérifiés et suivez votre impact environnemental en temps réel.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <RiShieldCheckLine className="text-3xl text-greenvegetal mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Structures techniques</h3>
              <p>
                Accompagnez les projets sur le terrain et assurez leur réussite technique.
              </p>
            </div>
          </div>

          {/* Membres de l’équipe */}
          <h4 className="text-2xl font-semibold mb-4 mt-12 text-green-700">L’équipe</h4>
          <div className="flex justify-center gap-8">
            <div>
              <p className="font-semibold text-green-700">Guele Wilfried</p>
              <div className="flex gap-3 justify-center mt-2">
                <a href="https://linkedin.com/in/wilfried-guele-5a456a190" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/color/24/000000/linkedin.png" alt="LinkedIn" />
                </a>
                <a href="https://github.com/wlfrd18" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/material-outlined/24/000000/github.png" alt="GitHub" />
                </a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-green-700">Kanga Brice</p>
              <div className="flex gap-3 justify-center mt-2">
                <a href="https://linkedin.com/in/Kanga-Kouakou-Brice" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/color/24/000000/linkedin.png" alt="LinkedIn" />
                </a>
                <a href="https://github.com/Kanga-prog" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/material-outlined/24/000000/github.png" alt="GitHub" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connexion */}
      <section id="login" className="flex justify-center bg-white py-12">
        <div className="max-w-md w-full px-6">
          <LoginForm />
          <SignInRedirect />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-green-100 py-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} Rebois-Connect - Projet Portfolio Holberton School
        </p>
        <p>Email : reboisconnect@gmail.com | Téléphone : +33 7 84 74 29 71</p>
      </footer>
    </div>
  );
};

export default LandingPage;
