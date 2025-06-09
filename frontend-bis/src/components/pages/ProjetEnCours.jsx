// src/components/pages/ProjetEnCours.jsx
import React from 'react';

export default function ProjetEnCours() {
  const ongoingProjects = [
    { id: 3, area: 2.0, vegetation_type: 'Mangrove', sponsor: 'Green Fund', status: 'in_progress' },
    { id: 4, area: 5.5, vegetation_type: 'Forêt claire', sponsor: 'Reforest Global', status: 'in_progress' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">Projets en cours</h2>
      <ul>
        {ongoingProjects.map(project => (
          <li key={project.id} className="text-gray-700 border-b py-2">
            {project.vegetation_type} – {project.area} ha <br />
            <span className="text-sm text-gray-500">Financé par {project.sponsor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
