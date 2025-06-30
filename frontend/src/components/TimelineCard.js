import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SponsorModal from "./SponsorModal";

export default function TimelineCard({ item, currentUser, isSponsorDashboard }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gestion des structures techniques sélectionnées
  const [techStructures, setTechStructures] = useState([]);
  const [selectedTechStructure, setSelectedTechStructure] = useState("");

  const isLand = !!item.owner_id;
  const isProject = !!item.sponsor_id;
  const land = isProject ? item.land || {} : item;

  // Charger les structures techniques à l’ouverture de la modale
useEffect(() => {
  if (showModal) {
    const token = localStorage.getItem("access_token"); // ou selon où tu stockes le token
    fetch("/users/tech_structures", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        return res.json();
      })
      .then((data) => setTechStructures(data))
      .catch((err) => console.error("Erreur chargement structures techniques", err));
  }
}, [showModal]);


  const showSponsorButton = isSponsorDashboard && isLand && (currentUser?.role === "sponsor" || currentUser?.role === "supercurrentUser");

  const confirmSponsorship = async () => {
    if (!selectedTechStructure) {
      alert("Veuillez sélectionner une structure technique.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/lands/${item.id}/sponsor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tech_structure_id: selectedTechStructure }),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      alert("Le projet a été sponsorisé avec succès !");
      setShowModal(false);
      navigate(`/projects`);
    } catch (error) {
      console.error("Erreur lors du sponsoring :", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer border border-green-100 flex flex-col sm:flex-row gap-4"
        onClick={() => navigate(isLand ? `/lands/${item.id}` : `/projects/${item.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(isLand ? `/lands/${item.id}` : `/projects/${item.id}`)}
      >
        <div className="w-full sm:w-40">
          <img
            src={item.photo_url || land.photo_url || "/placeholder-land.jpg"}
            alt="aperçu"
            className="w-full h-32 object-cover rounded-lg"
          />
          {showSponsorButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="mt-10 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded text-sm font-bold"
            >
              💸 Sponsoriser
            </button>
          )}
        </div>

        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              {`ID du ${isProject ? "projet" : "terrain"} : ${item.id}`}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {(() => {
                const status = item.status || "proposed";
                const base = "text-xs font-semibold px-2 py-1 rounded-full";
                const map = {
                  proposed: ["bg-yellow-100", "text-yellow-800", "📝 Proposé"],
                  in_progress: ["bg-blue-100", "text-blue-800", "🚧 En cours"],
                  completed: ["bg-green-100", "text-green-800", "✅ Terminé"],
                };
                const [bg, textColor, label] = map[status] || ["bg-gray-200", "text-gray-800", status];
                return <span className={`${base} ${bg} ${textColor}`}>{label}</span>;
              })()}{" "}
              •{" "}
              {(item.created_at?.split("T")[0] || land.created_at?.split("T")[0] || "Date inconnue")}
            </p>

            <div className="text-sm text-gray-700 space-y-1">
              {item.owner && (
                <p>
                  <strong>Propriétaire :</strong> {`${item.owner.first_name} ${item.owner.last_name}`.trim()}
                </p>
              )}
              <p>
                <strong>Pays :</strong> {land.country || "Pays inconnu"}
              </p>
              {land.area && (
                <p>
                  <strong>Surface :</strong> {land.area} ha
                </p>
              )}
              {land.vegetation_type && isLand && (
                <p>
                  <strong>Végétation :</strong> {land.vegetation_type}
                </p>
              )}

              {isProject && (
                <>
                  {item.sponsor && (
                    <p>
                      <strong>Sponsor :</strong> {`${item.sponsor.first_name} ${item.sponsor.last_name}`.trim()}
                    </p>
                  )}
                  {item.volunteer && (
                    <p>
                      <strong>Volontaire :</strong> {`${item.volunteer.first_name} ${item.volunteer.last_name}`.trim()}
                    </p>
                  )}
                  {item.tech_structure && (
                    <p>
                      <strong>Structure technique :</strong> {`${item.tech_structure.first_name} ${item.tech_structure.last_name}`.trim()}
                    </p>
                  )}
                  {item.report && (
                    <p className="italic text-gray-600">
                      <strong>Rapport :</strong> {item.report}
                    </p>
                  )}
                </>
              )}
            </div>

            {(land.weather_data || item.weather_data) && (() => {
              let currentWeather = null;
              try {
                const rawWeather = land.weather_data || item.weather_data;
                const wd = typeof rawWeather === "string" ? JSON.parse(rawWeather) : rawWeather;
                currentWeather = wd?.current_weather || wd?.current || null;
              } catch (e) {
                console.error("Erreur parsing weather_data", e);
              }
              if (!currentWeather) return null;
              return (
                <div className="mt-3 text-sm text-blue-700 bg-blue-50 p-2 rounded">
                  {currentWeather.temperature != null && (
                    <p>
                      🌡 Température : <strong>{currentWeather.temperature}°C</strong>
                    </p>
                  )}
                  {currentWeather.windspeed != null && (
                    <p>
                      💨 Vent : <strong>{currentWeather.windspeed} km/h</strong>
                    </p>
                  )}
                  {currentWeather.winddirection != null && (
                    <p>
                      🧭 Direction : <strong>{currentWeather.winddirection}°</strong>
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <SponsorModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmSponsorship}
        loading={loading}
        techStructures={techStructures}
        selectedTechStructure={selectedTechStructure}
        setSelectedTechStructure={setSelectedTechStructure}
      />
    </>
  );
}
