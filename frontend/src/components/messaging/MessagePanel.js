import React, { useState, useEffect } from "react";
import SearchUserBar from "./SearchUserBar";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import ContactDetailModal from "./ContactDetailModal";
import { socket } from "../../utils/socket";

export default function MessagePanel({ currentUser }) {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResultUser, setSearchResultUser] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchConvs = async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/messages/conversations/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(data);
    };

    fetchConvs();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedRoom) return;

    socket.emit("join", { room: selectedRoom });
    socket.emit("get_messages", { room: selectedRoom });

    socket.on("messages_history", (msgs) => setMessages(msgs));
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave", { room: selectedRoom });
      socket.off("messages_history");
      socket.off("receive_message");
    };
  }, [selectedRoom]);

  const sendMessage = (text) => {
    socket.emit("send_message", {
      user_id: currentUser.id,
      room: selectedRoom,
      content: text,
    });
  };

  const filteredConvs = conversations.filter(conv =>
    conv.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchUserBySearch = async () => {
      if (search.trim() === "") {
        setSearchResultUser(null);
        return;
      }

      const matchedConv = conversations.find(conv =>
        conv.user_name?.toLowerCase().includes(search.toLowerCase())
      );
      if (matchedConv) {
        setSearchResultUser(null); // déjà dans les conversations
        return;
      }

      const token = localStorage.getItem("access_token");
      const res = await fetch(`/users/search?query=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const user = await res.json();
        console.log("Résultat recherche utilisateur:", user); // ← log ici
        setSearchResultUser(user?.id !== currentUser.id ? user : null);
      } else {
        console.warn("Échec de la recherche utilisateur"); // ← log ici
      }
    };

    fetchUserBySearch();
  }, [search, conversations, currentUser]);

  console.log("searchResultUser (rendu):", searchResultUser); // ← log affichage conditionnel

  return (
    <div className="flex flex-col h-full">
      <SearchUserBar search={search} onSearchChange={setSearch} />
      <ConversationList
        conversations={filteredConvs}
        onSelect={setSelectedRoom}
        selectedRoom={selectedRoom}
        onAvatarClick={(user) => setSelectedUser(user)}
      />

      {searchResultUser && (
        <div
          onClick={async () => {
            const token = localStorage.getItem("access_token");

            const res = await fetch(`/messages/room`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                user1_id: currentUser.id,
                user2_id: searchResultUser.id,
              }),
            });

            const data = await res.json();

            setSelectedRoom(data.room_id);
            setConversations((prev) =>
              prev.some((c) => c.room_id === data.room_id)
                ? prev
                : [...prev, data]
            );
            setSearch(""); // reset search
            
            setSearchResultUser(null);
          }}
          className="cursor-pointer p-2 border rounded bg-gray-100 m-2 hover:bg-gray-200"
        >
          Démarrer une conversation avec <strong>{searchResultUser.user_name}</strong>
        </div>
      )}

      {selectedRoom && (
        <>
          <ChatWindow messages={messages} />
          <MessageInput onSend={sendMessage} />
        </>
      )}

      {selectedUser && (
        <ContactDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
