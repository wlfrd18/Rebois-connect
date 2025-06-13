import React from "react";
export default function ContactDetailModal({ contact, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
        >✕</button>
        <img
          src={contact.photo_url || "/default-avatar.png"}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
        />
        <h3 className="text-lg font-bold text-center text-green-700">{contact.first_name} {contact.last_name}</h3>
        <p className="text-center text-gray-600 mb-2">{contact.role}</p>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Téléphone:</strong> {contact.phone || "Non renseigné"}</p>
        </div>
      </div>
    </div>
  );
}