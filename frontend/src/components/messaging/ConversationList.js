import React from "react";

export default function ConversationList({ conversations, onSelect, selectedRoom, onAvatarClick }) {
  return (
    <ul className="overflow-y-auto flex-1">
      {conversations.map(conv => (
        <li
          key={conv.room}
          className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded ${selectedRoom === conv.room ? 'bg-gray-200' : ''}`}
          onClick={() => onSelect(conv.room)}
        >
          <img
            src={conv.photo_url || "/default-avatar.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
            onClick={(e) => {
              e.stopPropagation(); // éviter le onSelect si clic sur avatar
              if (onAvatarClick) onAvatarClick(conv);
            }}
          />
          <div>
            <p className="font-medium">{conv.first_name} {conv.last_name}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

