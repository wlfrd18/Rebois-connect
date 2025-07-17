import React from "react";

export default function SearchUserBar({ search, onSearchChange }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Rechercher un utilisateur..."
      className="w-full p-2 border rounded mb-2"
    />
  );
}
