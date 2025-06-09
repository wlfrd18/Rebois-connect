// src/components/pages/LandAvailable.jsx
import React from 'react';

export default function LandAvailable() {
  const availableLands = [
    { id: 1, area: 1.5, vegetation_type: 'Savane', feasibility: 'Élevée', status: 'proposed' },
    { id: 2, area: 3.2, vegetation_type: 'Forêt tropicale', feasibility: 'Moyenne', status: 'proposed' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Parcelles en attente</h2>
      <ul>
        {availableLands.map(land => (
          <li key={land.id} className="text-gray-700 border-b py-2">
            {land.vegetation_type} – {land.area} ha <br />
            <span className="text-sm text-gray-500">Faisabilité : {land.feasibility}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
