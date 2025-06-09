// src/components/sections/BeVolontaire.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function BeVolontaire() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Devenez Volontaire</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Proposez une parcelle pour participer au reboisement et sensibiliser votre communauté.
        </p>
        <Link to="/create-parcel" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
          Proposer une parcelle
        </Link>
      </div>
    </section>
  );
}