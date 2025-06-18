import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemModal from './ItemModal';

export default function ProfileCard({ user, setUser }) {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // ← pour la modale
  const [previewPhoto, setPreviewPhoto] = useState('/default-avatar.png');

  useEffect(() => {
    if (user?.photo_url) {
      setPreviewPhoto(user.photo_url);
    }
  }, [user]);

  const canPostLand = ['superuser', 'volunteer'].includes(user.role);

  const roleLabels = {
    superuser: "Administrateur",
    sponsor: "Sponsor",
    volunteer: "Volontaire"
  };

  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-2 py-1 rounded-full";
    const badgeMap = {
      proposed: { text: "📥 Proposé", bg: "bg-yellow-100", textColor: "text-yellow-800" },
      in_progress: { text: "🔧 En cours", bg: "bg-blue-100", textColor: "text-blue-800" },
      completed: { text: "✅ Terminé", bg: "bg-green-100", textColor: "text-green-800" }
    };
    const badge = badgeMap[status] || { text: status, bg: "bg-gray-200", textColor: "text-gray-800" };

    return <span className={`${base} ${badge.bg} ${badge.textColor}`}>{badge.text}</span>;
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

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  console.log("Fichier sélectionné :", file);
  if (!file || !user?.id) return;

  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Étape 1 : Upload du fichier vers le backend
    const uploadRes = await fetch('/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!uploadRes.ok) {
      console.error('Erreur lors de l’upload');
      return;
    }

    const { photo_url } = await uploadRes.json();

    console.log("URL de la photo retournée :", photo_url);

    setPreviewPhoto(photo_url); // Affichage immédiat

    console.log("Image de profil mise à jour :", photo_url);


    // Étape 2 : Mise à jour du profil utilisateur avec l’URL
    const updateRes = await fetch(`/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ photo_url })
    });

    if (!updateRes.ok) {
      console.error('Erreur de mise à jour utilisateur');
    } else {
      console.log('Photo mise à jour avec succès');
    }

  } catch (err) {
    console.error('Erreur complète :', err);
  }

  // Optionnel mais recommandé : recharger user à jour
  const refreshedUserRes = await fetch(`/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (refreshedUserRes.ok) {
    const updatedUser = await refreshedUserRes.json();
    setUser(updatedUser);
  }

};

  return (
    <div className="bg-white rounded-xl p-4 shadow relative">
      <div className="relative w-fit mx-auto">
        <img
          src={previewPhoto}
          alt={`profil`}
          className="w-16 h-16 rounded-full object-cover mx-auto"
        />
        <label
          htmlFor="photo-upload"
          className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1 hover:bg-green-700 cursor-pointer"
          title="Changer la photo"
        >
          ✎
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

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
                onClick={() => setSelectedItem(project)}
              >
                <span>{project.project_name || `Projet #${project.id}`}</span>
                {getStatusBadge(project.status)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Aucun projet associé.</p>
        )}
      </div>

      {/* Modal d'affichage détaillé */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          currentUser={user}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
