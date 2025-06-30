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
    country: "", area: "", vegetation_type: "", created_at: "",
    owner: "", sponsor: "", volunteer: "", tech_structure: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    const fetchUserById = async (id) => {
      if (!id) return null;
      const res = await fetch(`/users/${id}`, { headers });
      if (!res.ok) return null;
      return res.json().catch(() => null);
    };

    (async () => {
      const meRes = await fetch("/auth/me", { headers });
      if (meRes.ok) setUser(await meRes.json());

      const [landsRes, projectsRes] = await Promise.all([
        fetch("/lands", { headers }), 
        fetch("/projects", { headers })
      ]);
      const lands = landsRes.ok ? await landsRes.json() : [];
      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const combined = [
        ...(Array.isArray(lands) ? lands : lands.lands || []),
        ...(Array.isArray(projects) ? projects : projects.projects || [])
      ];

      const userIdSet = new Set();
      combined.forEach(it => {
        ["owner_id","sponsor_id","volunteer_id","tech_structure_id"].forEach(k => {
          if (it[k]) userIdSet.add(it[k]);
        });
        if (it.land?.owner_id) userIdSet.add(it.land.owner_id);
      });

      const usersArr = await Promise.all([...userIdSet].map(id => fetchUserById(id)));
      const usersMap = {};
      usersArr.forEach(u => { if (u?.id) usersMap[u.id] = u; });

      const enriched = combined.map(item => {
        const data = { ...item };

        // 🚧 Correction ici : wrap dans { current_weather }
        let cw = null;
        try {
          const raw = typeof item.weather_data === "string"
            ? JSON.parse(item.weather_data)
            : item.weather_data;
          cw = raw?.current_weather;
        } catch {
          cw = null;
        }
        data.weather_data = cw ? { current_weather: cw } : null;

        data.owner = item.owner_id && usersMap[item.owner_id];
        data.sponsor = item.sponsor_id && usersMap[item.sponsor_id];
        data.volunteer = item.volunteer_id && usersMap[item.volunteer_id];
        data.tech_structure = item.tech_structure_id && usersMap[item.tech_structure_id];

        if (item.land) {
          data.land = {
            ...item.land,
            owner: usersMap[item.land.owner_id]
          };
        }

        return data;
      });

      enriched.sort((a, b) => {
        const da = new Date(a.created_at || a.start_date || 0);
        const db = new Date(b.created_at || b.start_date || 0);
        return db - da;
      });

      setAllItems(enriched);
      setFilteredItems(enriched);

      const msgsRes = await fetch("/messages", { headers });
      if (msgsRes.ok) setMessages(await msgsRes.json());
    })();
  }, []);

  useEffect(() => {
    const noFilter = Object.values(filters).every(v => !v || v.trim() === "");
    if (noFilter) return setFilteredItems(allItems);

    const f = allItems.filter(item => {
      const land = item.land || item;
      const on = `${land.owner?.first_name||""} ${land.owner?.last_name||""}`.toLowerCase();
      const sp = `${item.sponsor?.first_name||""} ${item.sponsor?.last_name||""}`.toLowerCase();
      const vo = `${item.volunteer?.first_name||""} ${item.volunteer?.last_name||""}`.toLowerCase();
      const te = `${item.tech_structure?.first_name||""} ${item.tech_structure?.last_name||""}`.toLowerCase();

      return (
        (!filters.country || (land.country||"").toLowerCase().includes(filters.country)) &&
        (!filters.area || (land.area||"").toString().includes(filters.area)) &&
        (!filters.vegetation_type || (land.vegetation_type||"").toLowerCase().includes(filters.vegetation_type)) &&
        (!filters.created_at || (land.created_at||"").startsWith(filters.created_at)) &&
        (!filters.owner || on.includes(filters.owner.toLowerCase())) &&
        (!filters.sponsor || sp.includes(filters.sponsor.toLowerCase())) &&
        (!filters.volunteer || vo.includes(filters.volunteer.toLowerCase())) &&
        (!filters.tech_structure || te.includes(filters.tech_structure.toLowerCase()))
      );
    });

    setFilteredItems(f);
  }, [filters, allItems]);

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <header className="p-4 border-b border-green-300 flex flex-col sm:flex-row justify-between items-center bg-white shadow-sm gap-4">
        <div className="flex-grow w-full">
          <SearchBar filters={filters} onChange={setFilters} />
          <button
            onClick={() => {
              const reset = {};
              Object.keys(filters).forEach(k => reset[k] = "");
              setFilters(reset);
            }}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Réinitialiser les filtres
          </button>
        </div>
        <button onClick={() => setShowMessenger(!showMessenger)} className="text-green-700 font-semibold border px-4 py-2 rounded hover:bg-green-100 whitespace-nowrap">
          {showMessenger ? "Masquer" : "Afficher"} Messagerie
        </button>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-1/4 p-4 overflow-y-auto hidden lg:block">
          {user ? <ProfileCard user={user} setUser={setUser} /> : <div>Chargement...</div>}
          <div className="mt-8"><NewsFeed /></div>
        </aside>

        <main className={`p-4 overflow-y-auto transition-all duration-300 ${showMessenger?"w-2/4":"w-3/4"} mx-auto`}>
          <Timeline items={filteredItems} currentUser={user} isSponsorDahboard={true} />
        </main>

        {showMessenger && <aside className="w-1/4 p-4 border-l overflow-y-auto hidden lg:block"><MessagePanel messages={messages} /></aside>}
      </div>
    </div>
  );
}
