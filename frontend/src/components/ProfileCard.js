import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemModal from './ItemModal';
import PhotoModal from './PhotoModal';

import {
  FaEdit,
  FaGlobeEurope,
  FaBoxOpen,
  FaFolder,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { GiReceiveMoney } from 'react-icons/gi';
import { BsInboxFill } from 'react-icons/bs';

export default function ProfileCard({ user, setUser }) {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState('/default-avatar.png');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  useEffect(() => {
    if (user?.photo_url) {
      setPreviewPhoto(user.photo_url);
    }
  }, [user]);

  const canPostLand = ['superuser', 'volunteer'].includes(user.role);

  const roleLabels = {
    superuser: 'Administrateur',
    sponsor: 'Sponsor',
    volunteer: 'Volontaire',
    tech_structure: 'Structure technique',
  };

  const getStatusBadge = (status) => {
    const base = 'text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1';
    const badgeMap = {
      proposed: {
        text: (
          <>
            <BsInboxFill /> Proposé
          </>
        ),
        bg: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      },
      in_progress: {
        text: (
          <>
            <GiReceiveMoney /> En cours
          </>
        ),
        bg: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      completed: {
        text: (
          <>
            <FaCheckCircle /> Terminé
          </>
        ),
        bg: 'bg-green-100',
        textColor: 'text-green-800',
      },
    };
    const badge = badgeMap[status] || {
      text: status,
      bg: 'bg-gray-200',
      textColor: 'text-gray-800',
    };
    return <span className={`${base} ${badge.bg} ${badge.textColor}`}>{badge.text}</span>;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !user?.id) return;

      try {
        const [landsRes, projectsRes] = await Promise.all([
          fetch(`/users/${user.id}/lands`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/users/${user.id}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (landsRes.ok) setLands(await landsRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
      } catch (error) {
        console.error('Erreur lors du chargement des terres/projets :', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch('/upload/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) {
        console.error('Erreur lors de l’upload');
        return;
      }

      const { photo_url } = await uploadRes.json();
      setPreviewPhoto(photo_url);

      const updateRes = await fetch(`/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo_url }),
      });

      if (!updateRes.ok) console.error('Erreur de mise à jour utilisateur');

      const refreshedUserRes = await fetch(`/auth/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (refreshedUserRes.ok) {
        const updatedUser = await refreshedUserRes.json();
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Erreur complète :', err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow relative">
      {/* Photo + nom + infos */}
      <div className="relative w-fit mx-auto">
        <img
          src={previewPhoto}
          alt="profil"
          onClick={() => setPhotoModalOpen(true)}
          className="w-24 h-24 rounded-full object-cover mx-auto cursor-pointer hover:scale-105 transition"
        />
        <label
          htmlFor="photo-upload"
          className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1 hover:bg-green-700 cursor-pointer"
          title="Changer la photo"
        >
          <FaEdit size={14} />
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
        <p className="text-lg font-bold">
          {user.role === 'tech_structure'
            ? user.first_name
            : `${user.first_name} ${user.last_name}`}
        </p>
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
          localStorage.removeItem('access_token');
          navigate('/');
        }}
        className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
      >
        <MdLogout /> Déconnexion
      </button>

      {/* Scrollable Terres et Projets */}
      <div className="mt-6 space-y-4">
        {/* Terres */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-green-800 flex items-center gap-2">
            <FaGlobeEurope /> Terres postées
          </h4>
          <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
            {lands.length > 0 ? (
              lands.map((land) => (
                <div
                  key={land.id}
                  onClick={() => setSelectedItem(land)}
                  className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-2 hover:shadow cursor-pointer transition"
                >
                  <img
                    src={land.photo_url || '/placeholder-land.jpg'}
                    alt={land.title || `Terre #${land.id}`}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{land.title || `Terre #${land.id}`}</p>
                    {getStatusBadge(land.status)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Aucune terre postée.</p>
            )}
          </div>
        </div>

        {/* Projets */}
        <div>
          <h4 className="text-md font-semibold mb-2 text-blue-800 flex items-center gap-2">
            <FaBoxOpen /> Projets associés
          </h4>
          <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedItem(project)}
                  className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 hover:shadow cursor-pointer transition"
                >
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md text-blue-600 text-lg">
                    <FaFolder />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {project.project_name || `Projet #${project.id}`}
                    </p>
                    {getStatusBadge(project.status)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Aucun projet associé.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal projet */}
      {selectedItem && (
        <ItemModal item={selectedItem} currentUser={user} onClose={() => setSelectedItem(null)} />
      )}

      {/* Modal photo */}
      {photoModalOpen && <PhotoModal src={previewPhoto} onClose={() => setPhotoModalOpen(false)} />}
    </div>
  );
}
