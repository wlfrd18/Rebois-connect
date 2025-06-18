// src/components/ItemModal.js
import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import TimelineCard from "./TimelineCard";

export default function ItemModal({ item, currentUser, onClose }) {
  if (!item) return null;

  return (
    <Dialog open={!!item} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative z-50 bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
        <TimelineCard item={item} currentUser={currentUser} />
      </div>
    </Dialog>
  );
}
