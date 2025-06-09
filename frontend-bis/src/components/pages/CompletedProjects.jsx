// src/components/pages/CompletedProjects.jsx
import React from 'react';

export default function CompletedProjects() {
  const completedProjects = [
    { id: 5, area: 4.0, vegetation_type: 'Forêt galerie', completed_on: '2025-05-12' },
    { id: 6, area: 6.3, vegetation_type: 'Savanes boisées', completed_on: '2025-04-01' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-green-900 mb-2">Projets terminés</h2>
      <ul>
        {completedProjects.map(project => (
          <li key={project.id} className="text-gray-700 border-b py-2">
            {project.vegetation_type} – {project.area} ha <br />
            <span className="text-sm text-gray-500">Terminé le {project.completed_on}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
