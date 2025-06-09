// src/components/pages/Dashboard.jsx
import React from 'react';
import LandAvailable from './LandAvailable';
import ProjetEnCours from './ProjetEnCours';
import CompletedProjects from './CompletedProjects';

export default function Dashboard() {
  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Mon espace Reboisement</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <LandAvailable />
        <ProjetEnCours />
        <CompletedProjects />
      </div>
    </section>
  );
}
