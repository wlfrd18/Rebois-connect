import React from 'react';

export default function PhotoModal({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt="Agrandissement"
          className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-red-400"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
