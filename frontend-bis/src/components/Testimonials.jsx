import React from 'react';

const testimonials = [
  {
    name: "Aïssata K.",
    role: "Volontaire, Côte d'Ivoire",
    message: "Grâce à ReboisConnect, j’ai pu proposer un terrain dégradé qui est maintenant en cours de reboisement.",
  },
  {
    name: "Julien M.",
    role: "Mécène, France",
    message: "Je suis heureux de soutenir des projets concrets et suivre l'évolution depuis mon tableau de bord.",
  },
  {
    name: "Fatou D.",
    role: "Responsable ONG locale",
    message: "ReboisConnect a transformé la façon dont nous finançons nos campagnes de reboisement.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-green-100 py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Ils nous font confiance</h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-12">
          Découvrez les témoignages de ceux qui participent activement à reverdir notre planète 🌍
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left">
              <p className="text-gray-800 italic mb-4">“{t.message}”</p>
              <div>
                <h4 className="text-green-700 font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
