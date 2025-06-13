import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileCard({ user }) {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [projects, setProjects] = useState([]);

  const canPostLand = ['superuser', 'volunteer'].includes(user.role);

  const roleLabels = {
    superuser: "Administrateur",
    sponsor: "Sponsor",
    volunteer: "Volontaire"
  };

  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-2 py-1 rounded-full";
    switch (status) {
      case 'validé':
        return <span className={`${base} bg-green-100 text-green-800`}>✔ Validé</span>;
      case 'en attente':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>⏳ En attente</span>;
      case 'rejeté':
        return <span className={`${base} bg-red-100 text-red-800`}>❌ Rejeté</span>;
      default:
        return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !user?.id) return;

      try {
        const [landsRes, projectsRes] = await Promise.all([
          fetch(`/users/${user.id}/lands`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`/users/${user.id}/projects`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (landsRes.ok) setLands(await landsRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());

      } catch (error) {
        console.error("Erreur lors du chargement des terres/projets :", error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <img
        src={user.photo_url || '/default-avatar.png'}
        alt={`${user.first_name}`}
        className="w-16 h-16 rounded-full object-cover mx-auto"
      />
      <div className="text-center mt-2">
        <p className="text-lg font-bold">{user.first_name} {user.last_name}</p>
        <p className="text-sm text-gray-600">{roleLabels[user.role] || user.role}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {canPostLand && (
        <button
          onClick={() => navigate('/lands/new')}
          className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
        >
          + Poster une terre
        </button>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("access_token");
          navigate('/login');
        }}
        className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Déconnexion
      </button>

      {/* Liste des terres */}
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2 text-green-800">🌍 Terres postées</h4>
        {lands.length > 0 ? (
          <ul className="space-y-1 text-sm text-gray-700">
            {lands.map((land) => (
              <li
                key={land.id}
                className="flex justify-between items-center border-b pb-1 hover:text-green-700 cursor-pointer"
                onClick={() => navigate(`/lands/${land.id}`)}
              >
                <span>{land.title || `Terre #${land.id}`}</span>
                {getStatusBadge(land.status)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Aucune terre postée.</p>
        )}
      </div>

      {/* Liste des projets */}
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2 text-green-800">📦 Projets associés</h4>
        {projects.length > 0 ? (
          <ul className="space-y-1 text-sm text-gray-700">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex justify-between items-center border-b pb-1 hover:text-green-700 cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <span>Projet #{project.id}</span>
                {getStatusBadge(project.status)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Aucun projet associé.</p>
        )}
      </div>
    </div>
  );
}
