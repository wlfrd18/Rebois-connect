import React from "react";
import { useNavigate } from "react-router-dom";

export default function TimelineCard({ item, currentUser }) {
  const navigate = useNavigate();

  const isLand = !!item.title;
  const isProject = !!item.project_name;

  const title = isLand ? item.title : item.project_name || "Projet sans nom";
  const status = item.status || "Inconnu";
  const createdAt = item.created_at?.split("T")[0] || "Date inconnue";
  const country = item.country || "Pays inconnu";
  const area = item.area ? `${item.area} ha` : null;
  const vegetation = item.vegetation_type || null;
  const ownerName = item.owner
    ? `${item.owner.first_name} ${item.owner.last_name}`
    : "Propriétaire inconnu";

  const imageUrl = item.photo_url || "/default-image.jpg"; // Par défaut si pas d'image

  const handleClick = () => {
    if (isLand) navigate(`/lands/${item.id}`);
    if (isProject) navigate(`/projects/${item.id}`);
  };

  return (
    <div
      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer border border-green-100 flex flex-col sm:flex-row gap-4"
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt="Aperçu"
        className="w-full sm:w-40 h-32 object-cover rounded-lg"
      />

      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-semibold text-green-800">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {status} • {createdAt}
          </p>

          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Propriétaire :</strong> {ownerName}</p>
            <p><strong>Pays :</strong> {country}</p>
            {area && <p><strong>Surface :</strong> {area}</p>}
            {vegetation && <p><strong>Végétation :</strong> {vegetation}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
