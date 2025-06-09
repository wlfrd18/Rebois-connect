import React from 'react';

export default function Hero() {
  return (
    <section className="bg-green-50 py-20">
      <div className="container mx-auto text-center px-6">
        <h1 className="text-5xl font-bold text-green-800 mb-4">
          Reboiser pour un avenir meilleur
          🌱 ReboisConnect est vivant !
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
          Connecter volontaires et mécènes pour reverdir nos territoires.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg">
          Voir les projets
        </button>
      </div>
    </section>
  );
}