// src/components/ItemModal.js
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import TimelineCard from "./TimelineCard";

export default function ItemModal({ item, currentUser, onClose }) {
  const [enrichedItem, setEnrichedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) {
      setEnrichedItem(null);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fetchUserById = async (id) => {
      if (!id) return null;
      try {
        const res = await fetch(`/users/${id}`, { headers });
        if (res.ok) return await res.json();
        return null;
      } catch {
        return null;
      }
    };

    async function enrichItem() {
      setLoading(true);

      if ("owner_id" in item) {
        // C’est un land
        const owner = await fetchUserById(item.owner_id);
        setEnrichedItem({ ...item, owner });
      } else {
        // C’est un project
        const [sponsor, volunteer, tech_structure] = await Promise.all([
          fetchUserById(item.sponsor_id),
          fetchUserById(item.volunteer_id),
          fetchUserById(item.tech_structure_id),
        ]);
        setEnrichedItem({ ...item, sponsor, volunteer, tech_structure });
      }

      setLoading(false);
    }

    enrichItem();
  }, [item]);

  if (!item) return null;

  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="relative z-50 bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <span className="text-gray-500">Chargement...</span>
          </div>
        ) : (
          <TimelineCard item={enrichedItem || item} currentUser={currentUser} />
        )}
      </div>
    </Dialog>
  );
}
