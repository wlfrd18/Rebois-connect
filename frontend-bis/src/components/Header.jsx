import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-green-700">
          ReboisConnect
        </div>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-green-700">Accueil</Link>
          <Link to="/about" className="text-gray-700 hover:text-green-700">À propos</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-green-700">Projets</Link>
          <Link to="/partner" className="text-gray-700 hover:text-green-700">Partenaires</Link>
          <Link to="/contact" className="text-gray-700 hover:text-green-700">Contact</Link>
          <Link to="/login" className="text-gray-700 hover:text-green-700">Connexion</Link>
          <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
           Rejoindre
          </Link>

        </nav>
      </div>
    </header>
);
}
