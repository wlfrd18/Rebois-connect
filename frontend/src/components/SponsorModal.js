import React from "react";

export default function SponsorModal({
  isOpen,
  onCancel,
  onConfirm,
  loading,
  techStructures,
  selectedTechStructure,
  setSelectedTechStructure,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Confirmer le sponsoring</h2>
        <p className="text-sm text-gray-700">
          Veuillez sélectionner une structure technique pour ce sponsoring :
        </p>

        <select
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={selectedTechStructure}
          onChange={(e) => setSelectedTechStructure(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Choisissez une structure technique --</option>
          {techStructures.map((ts) => (
            <option key={ts.id} value={ts.id}>
              {ts.first_name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded"
            disabled={loading || !selectedTechStructure}
          >
            {loading ? "Traitement..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
