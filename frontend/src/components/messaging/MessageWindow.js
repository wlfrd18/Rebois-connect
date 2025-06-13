// src/components/messaging/MessageWindow.js
import React, { useState } from "react";

export default function MessageWindow({ contact, onBack, onShowDetails }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { fromMe: false, text: "Bonjour, comment puis-je vous aider ?" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setHistory([...history, { fromMe: true, text: input }]);
    setInput("");
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-green-700"
        >
          ← Retour
        </button>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onShowDetails}
        >
          <img
            src={contact.photo_url || "/default-avatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-green-800 font-semibold text-sm">
            {contact.first_name} {contact.last_name}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-2 p-1">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-xs ${
              msg.fromMe
                ? "ml-auto bg-green-100 text-right"
                : "mr-auto bg-gray-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Votre message..."
          className="flex-grow border rounded px-2 py-1 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white text-sm px-3 py-1 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
