import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";

export default function ReviewModal({ isOpen, onCancel, onConfirm, loading, initialReport, initialRating }) {
  const [report, setReport] = useState(initialReport || "");
  const [rating, setRating] = useState(initialRating || 5);

  useEffect(() => {
    if (isOpen) {
      setReport(initialReport || "");
      setRating(initialRating || 5);
    }
  }, [isOpen, initialReport, initialRating]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Noter ce projet</h2>
        <textarea
          rows={4}
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Écrire un rapport..."
          className="w-full border rounded p-2 mb-4"
        />
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Note :</label>
          <StarRating rating={rating} onChange={setRating} />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm({ report, rating })}
            disabled={loading}
            className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
          >
            {loading ? "En cours..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}