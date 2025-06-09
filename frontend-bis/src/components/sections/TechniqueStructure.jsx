// src/components/sections/TechniqueStructure.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function TechniqueStructure() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Structures Techniques</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Accédez aux parcelles disponibles pour évaluer la faisabilité technique des projets.
        </p>
        <Link to="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
          Voir les parcelles à valider
        </Link>
      </div>
    </section>
  );
}
