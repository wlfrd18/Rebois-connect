import React from "react";

export default function SearchBar({ filters, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <input
        type="text"
        placeholder="Pays"
        value={filters.country || ""}
        onChange={(e) => onChange({ ...filters, country: e.target.value })}
        className="border p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Surface (ha)"
        value={filters.area || ""}
        onChange={(e) => onChange({ ...filters, area: e.target.value })}
        className="border p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Végétation"
        value={filters.vegetation_type || ""}
        onChange={(e) => onChange({ ...filters, vegetation_type: e.target.value })}
        className="border p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Date de création (YYYY-MM-DD)"
        value={filters.created_at || ""}
        onChange={(e) => onChange({ ...filters, created_at: e.target.value })}
        className="border p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Propriétaire"
        value={filters.owner || ""}
        onChange={(e) => onChange({ ...filters, owner: e.target.value })}
        className="border p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Sponsor"
        value={filters.sponsor || ""}
        onChange={(e) => onChange({ ...filters, sponsor: e.target.value })}
        className="border p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Volontaire"
        value={filters.volunteer || ""}
        onChange={(e) => onChange({ ...filters, volunteer: e.target.value })}
        className="border p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Structure technique"
        value={filters.tech_structure || ""}
        onChange={(e) => onChange({ ...filters, tech_structure: e.target.value })}
        className="border p-2 rounded text-sm"
      />
    </div>
  );
}
