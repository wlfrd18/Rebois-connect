import React from "react";
import StarRating from "./StarRating"; // J'imagine que StarRating est dans un fichier à part, sinon tu peux intégrer son code aussi.

export default function ReviewCard({ user, report, rating }) {
  // user = { first_name, last_name, photo_url }
  const MAX_PREVIEW_LENGTH = 150;
  const preview = report.length > MAX_PREVIEW_LENGTH ? report.slice(0, MAX_PREVIEW_LENGTH) + "…" : report;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-3 flex items-start gap-4 border border-gray-200">
      <img
        src={user.photo_url || "/default-avatar.png"}
        alt={`${user.first_name} ${user.last_name}`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <strong className="text-green-900">{`${user.first_name} ${user.last_name}`}</strong>
          <StarRating rating={rating} size={16} precision={0.25} onChange={() => {}} />
        </div>
        <p className="text-gray-700 text-sm">{preview}</p>
      </div>
    </div>
  );
}