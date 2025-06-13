// src/components/messaging/MessagePanel.js
import React, { useState } from "react";
import MessageList from "./MessageList";
import ContactDetailModal from "./ContactDetailModal";
import MessageWindow from "./MessageWindow";

export default function MessagePanel({ messages }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {!selectedContact && (
        <MessageList messages={messages} onSelect={setSelectedContact} />
      )}
      {selectedContact && (
        <MessageWindow
          contact={selectedContact}
          onBack={() => setSelectedContact(null)}
          onShowDetails={() => setShowDetails(true)}
        />
      )}
      {showDetails && selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}