import React, { useEffect, useRef } from "react";

export default function ChatWindow({ messages }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto border rounded p-2 bg-white mb-2 h-64">
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-1">
          <span className="font-semibold">{msg.sender_name}:</span> {msg.content}
        </div>
      ))}
    </div>
  );
}
