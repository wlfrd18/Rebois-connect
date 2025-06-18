// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import SearchBar from "../components/SearchBar";
import Timeline from "../components/Timeline";
import MessagePanel from "../components/messaging/MessagePanel";
import NewsFeed from "../components/NewsFeed";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showMessenger, setShowMessenger] = useState(true);

  const [filters, setFilters] = useState({
    country: "",
    area: "",
    vegetation_type: "",
    created_at: "",
    owner: "",
    sponsor: "",
    volunteer: "",
    tech_structure: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    // Fetch current user
    fetch("/auth/me", { method: "GET", credentials: "include", headers })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Erreur utilisateur :", err));

    // Fetch timeline (lands + projects)
    Promise.all([
      fetch("/api/v1/lands", { headers }),
      fetch("/api/v1/projects", { headers })
    ])
      .then(async ([landsRes, projectsRes]) => {
        const landsData = await landsRes.json();
        const projectsData = await projectsRes.json();

        const combined = [...landsData.lands, ...projectsData.projects];
        combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setAllItems(combined);
        setFilteredItems(combined); // affichage initial
      })
      .catch(err => console.error("Erreur timeline :", err));

    // Fetch messages
    fetch("/messages", { method: "GET", credentials: "include", headers })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Erreur messages :", err));
  }, []);

  useEffect(() => {
    const noFiltersApplied = Object.values(filters).every(val => !val || val.trim() === "");

    if (noFiltersApplied) {
      setFilteredItems(allItems);
      return;
    }

    const filtered = allItems.filter(item => {
      if (!item) return false;

      const land = item.land || item;

      // Sécurisation des noms composés
      const ownerName = `${land.owner?.first_name || ""} ${land.owner?.last_name || ""}`.trim();
      const sponsorName = `${item.sponsor?.first_name || ""} ${item.sponsor?.last_name || ""}`.trim();
      const volunteerName = `${item.volunteer?.first_name || ""} ${item.volunteer?.last_name || ""}`.trim();
      const techStructureName = `${item.tech_structure?.first_name || ""} ${item.tech_structure?.last_name || ""}`.trim();

      return (
        (!filters.country || (land.country || "").toLowerCase().includes(filters.country.toLowerCase())) &&
        (!filters.area || (land.area || "").toString().includes(filters.area)) &&
        (!filters.vegetation_type || (land.vegetation_type || "").toLowerCase().includes(filters.vegetation_type.toLowerCase())) &&
        (!filters.created_at || (land.created_at || "").startsWith(filters.created_at)) &&
        (!filters.owner || ownerName.toLowerCase().includes(filters.owner.toLowerCase())) &&
        (!filters.sponsor || sponsorName.toLowerCase().includes(filters.sponsor.toLowerCase())) &&
        (!filters.volunteer || volunteerName.toLowerCase().includes(filters.volunteer.toLowerCase())) &&
        (!filters.tech_structure || techStructureName.toLowerCase().includes(filters.tech_structure.toLowerCase()))
      );
    });

    setFilteredItems(filtered);
  }, [filters, allItems]);

  const handleResetFilters = () => {
    setFilters({
      country: "",
      area: "",
      vegetation_type: "",
      created_at: "",
      owner: "",
      sponsor: "",
      volunteer: "",
      tech_structure: ""
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <header className="p-4 border-b border-green-300 flex flex-col sm:flex-row justify-between items-center bg-white shadow-sm gap-4">
        <div className="flex-grow w-full">
          <SearchBar filters={filters} onChange={setFilters} />
          <button
            onClick={handleResetFilters}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <button
          onClick={() => setShowMessenger(!showMessenger)}
          className="text-green-700 font-semibold border px-4 py-2 rounded hover:bg-green-100 whitespace-nowrap"
        >
          {showMessenger ? "Masquer" : "Afficher"} Messagerie
        </button>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-1/4 p-4 overflow-y-auto hidden lg:block">
          {user ? <ProfileCard user={user} setUser={setUser} /> : <div>Chargement...</div>}
          <div className="mt-8">
            <NewsFeed />
          </div>
        </aside>

        {/* Main Timeline */}
        <main className={`p-4 overflow-y-auto transition-all duration-300 ${showMessenger ? "w-2/4" : "w-3/4"} mx-auto`}>
          <Timeline items={filteredItems} currentUser={user} />
        </main>

        {/* Right Messaging Panel */}
        {showMessenger && (
          <aside className="w-1/4 p-4 border-l overflow-y-auto hidden lg:block">
            <MessagePanel messages={messages} />
          </aside>
        )}
      </div>
    </div>
  );
}
