import React from "react";
export default function MessageList({ messages, onSelect }) {
  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="flex items-center space-x-3 p-2 hover:bg-green-100 rounded cursor-pointer"
          onClick={() => onSelect(msg.sender)}
        >
          <img
            src={msg.sender.photo_url || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
            alt="sender"
          />
          <div>
            <p className="font-semibold text-green-800">{msg.sender.first_name} {msg.sender.last_name}</p>
            <p className="text-sm text-gray-600 truncate w-40">{msg.latest_message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}