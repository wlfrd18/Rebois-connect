import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded p-2"
        placeholder="Votre message..."
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button onClick={send} className="bg-green-600 text-white px-4 rounded">Envoyer</button>
    </div>
  );
}
