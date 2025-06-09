// src/components/Features.jsx
import React from 'react';
import { Leaf, Users, Globe } from 'lucide-react';

const features = [
  {
    icon: <Leaf className="w-10 h-10 text-green-600" />,
    title: "Projets durables",
    description: "Chaque parcelle proposée est sélectionnée selon des critères écologiques stricts.",
  },
  {
    icon: <Users className="w-10 h-10 text-green-600" />,
    title: "Volontaires & Mécènes",
    description: "Une plateforme qui connecte les acteurs locaux et les soutiens financiers du monde entier.",
  },
  {
    icon: <Globe className="w-10 h-10 text-green-600" />,
    title: "Impact mesurable",
    description: "Suivez la progression, les arbres plantés et les retours de la communauté.",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          Une plateforme engagée pour la reforestation
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          ReboisConnect facilite la rencontre entre ceux qui veulent agir et ceux qui peuvent aider.
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feat, index) => (
            <div key={index} className="p-6 rounded-xl shadow-md hover:shadow-xl transition bg-green-50">
              <div className="mb-4">{feat.icon}</div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">{feat.title}</h3>
              <p className="text-gray-700">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
