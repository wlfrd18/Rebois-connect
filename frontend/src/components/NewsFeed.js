import React, { useEffect, useState } from "react";

export default function NewsFeed({ currentUser }) {
  const [news, setNews] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const isAdmin = currentUser?.role === "superuser";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/v1/news", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNews(data.news || []);
      } catch (err) {
        console.error("Erreur de chargement des news :", err);
      }
    };

    fetchNews();
  }, []);

  const handleAddNews = async () => {
    if (!newItem.trim()) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/v1/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newItem }),
      });

      if (!res.ok) {
        alert("Erreur lors de l'ajout.");
        return;
      }

      const created = await res.json();
      setNews([created, ...news]);
      setNewItem("");
    } catch (err) {
      console.error("Erreur d'ajout :", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/v1/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = async (id) => {
    if (!editContent.trim()) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/v1/news/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        const updated = await res.json();
        setNews(news.map((n) => (n.id === id ? updated : n)));
        setEditingId(null);
        setEditContent("");
      } else {
        alert("Erreur de mise à jour.");
      }
    } catch (err) {
      console.error("Erreur édition :", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold text-green-700 mb-2">Fil d'actualité</h3>

      <ul className="text-sm text-gray-700 space-y-2 mb-4">
        {news.length === 0 ? (
          <li>Aucune actualité pour le moment.</li>
        ) : (
          news.map((item) => (
            <li key={item.id} className="flex justify-between items-start">
              <div>
                {editingId === item.id ? (
                  <input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border p-1 rounded w-full text-sm"
                  />
                ) : (
                  <>
                    📰 {item.content}
                    <div className="text-xs text-gray-500">
                      Publiée le :{" "}
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2 ml-2">
                  {editingId === item.id ? (
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-green-600 text-xs"
                    >
                      💾 Sauver
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditContent(item.content);
                      }}
                      className="text-blue-600 text-xs"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 text-xs"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      {isAdmin && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Nouvelle actualité"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="border p-2 rounded w-full text-sm mb-2"
          />
          <button
            onClick={handleAddNews}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 w-full"
          >
            ➕ Publier
          </button>
        </div>
      )}
    </div>
  );
}
