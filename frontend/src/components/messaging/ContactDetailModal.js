import React from "react";

export default function ContactDetailModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl">✖</button>
        <div className="flex flex-col items-center">
          <img
            src={user.photo_url || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{user.first_name} {user.last_name}</h2>
          <p className="text-gray-700 mb-1"><strong>Email :</strong> {user.email}</p>
          <p className="text-gray-700 mb-1"><strong>Rôle :</strong> {user.role}</p>
          {/* Ajoute ici d'autres infos si nécessaires */}
        </div>
      </div>
    </div>
  );
}
