import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SponsorModal from "./SponsorModal";

// Composant d'étoiles avec précision (ex: 0.25)
function StarRating({ rating, onChange, precision = 0.25, size = 24 }) {
  const [hoverValue, setHoverValue] = useState(null);
  const starCount = 5;

  const getFill = (index) => {
    const value = hoverValue !== null ? hoverValue : rating;
    const diff = value - index;
    if (diff >= 1) return 1;
    if (diff <= 0) return 0;
    return Math.round(diff / precision) * precision;
  };

  const handleClick = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;
    const newRating = Math.min(starCount, index + percent);
    const roundedRating = Math.round(newRating / precision) * precision;
    onChange(roundedRating);
  };

  return (
    <div style={{ display: "flex", gap: 4, cursor: "pointer" }}>
      {[...Array(starCount)].map((_, i) => {
        const fill = getFill(i);
        return (
          <svg
            key={i}
            onClick={(e) => handleClick(i, e)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = x / rect.width;
              setHoverValue(Math.min(starCount, i + percent));
            }}
            onMouseLeave={() => setHoverValue(null)}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="goldenrod"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset={`${fill * 100}%`} stopColor="goldenrod" />
                <stop offset={`${fill * 100}%`} stopColor="lightgray" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#grad-${i})`}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22
                 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
            />
          </svg>
        );
      })}
    </div>
  );
}

// Modal pour saisir un avis et une note
function ReviewModal({ isOpen, onCancel, onConfirm, loading, initialReport, initialRating }) {
  const [report, setReport] = useState(initialReport || "");
  const [rating, setRating] = useState(initialRating || 5);

  useEffect(() => {
    if (isOpen) {
      setReport(initialReport || "");
      setRating(initialRating || 5);
    }
  }, [isOpen, initialReport, initialRating]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Noter ce projet</h2>
        <textarea
          rows={4}
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Écrire un rapport..."
          className="w-full border rounded p-2 mb-4"
        />
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Note :</label>
          <StarRating rating={rating} onChange={setRating} />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm({ report, rating })}
            disabled={loading}
            className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
          >
            {loading ? "En cours..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant principal TimelineCard
export default function TimelineCard({ item, currentUser, isSponsorDashboard }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [techStructures, setTechStructures] = useState([]);
  const [selectedTechStructure, setSelectedTechStructure] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);

  const isLand = !!item.owner_id;
  const isProject = !!item.sponsor_id;
  const land = isProject ? item.land || {} : item;

  // Chargement des structures techniques pour le sponsoring
  useEffect(() => {
    if (showModal) {
      const token = localStorage.getItem("access_token");
      fetch("/users/tech_structures", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erreur lors de la récupération");
          return res.json();
        })
        .then(setTechStructures)
        .catch(console.error);
    }
  }, [showModal]);

  const showSponsorButton =
    isSponsorDashboard &&
    isLand &&
    (currentUser?.role === "sponsor" || currentUser?.role === "supercurrentUser");

  // Confirmer sponsoring
  const confirmSponsorship = async () => {
    if (!selectedTechStructure) {
      alert("Veuillez sélectionner une structure technique.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/lands/${item.id}/sponsor`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tech_structure_id: selectedTechStructure }),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      alert("Le projet a été sponsorisé avec succès !");
      setShowModal(false);
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Erreur lors du sponsoring :", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // Calcul note moyenne
  const ratings = [];
  if (item.sponsor_rating != null) ratings.push(item.sponsor_rating);
  if (item.tech_rating != null) ratings.push(item.tech_rating);
  const averageRating =
    ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  // Droits pour noter
  const canEditSponsor = currentUser?.role === "sponsor" || currentUser?.role === "supercurrentUser";
  const canEditTech = currentUser?.role === "tech_structure" || currentUser?.role === "supercurrentUser";
  const isSponsor = canEditSponsor && item.sponsor_id === currentUser?.id;
  const isTech = canEditTech && item.tech_structure_id === currentUser?.id;
  const initialReport = isSponsor ? item.sponsor_report : isTech ? item.tech_report : "";
  const initialRating = isSponsor ? item.sponsor_rating : isTech ? item.tech_rating : 5;

  // Soumission avis
  const submitReview = async ({ report, rating }) => {
    setLoadingReview(true);
    try {
      const token = localStorage.getItem("access_token");
      let body = isSponsor
        ? { sponsor_report: report, sponsor_rating: rating }
        : isTech
        ? { tech_report: report, tech_rating: rating }
        : {};

      if (!Object.keys(body).length) {
        alert("Vous n'avez pas la permission.");
        setLoadingReview(false);
        return;
      }

      const res = await fetch(`/projects/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      alert("Avis mis à jour avec succès !");
      setShowReviewModal(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de l'avis.");
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    <>
      <div
        className={`p-4 rounded-xl shadow transition border flex flex-col sm:flex-row gap-4 
          ${isProject ? "bg-green-300 cursor-default" : "bg-white cursor-pointer hover:shadow-md border-green-100"}`}
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
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded text-sm font-bold"
            >
              💸 Sponsoriser
            </button>
          )}
          {(isSponsor || isTech) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReviewModal(true);
              }}
              className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded font-bold text-sm"
            >
              Noter ce projet
            </button>
          )}
        </div>

        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-lg font-semibold text-green-900">{`ID du ${isProject ? "projet" : "terrain"} : ${item.id}`}</h3>
            <p className="text-sm text-green-800 mb-2">
              {(() => {
                const status = item.status || "proposed";
                const base = "text-xs font-semibold px-2 py-1 rounded-full";
                const map = {
                  proposed: ["bg-yellow-100", "text-yellow-800", "📝 Proposé"],
                  in_progress: ["bg-blue-100", "text-blue-800", "🚧 En cours"],
                  completed: ["bg-green-200", "text-green-900", "✅ Terminé"],
                };
                const [bg, textColor, label] = map[status] || ["bg-gray-200", "text-gray-800", status];
                return <span className={`${base} ${bg} ${textColor}`}>{label}</span>;
              })()}{" "}
              • {(item.created_at?.split("T")[0] || land.created_at?.split("T")[0] || "Date inconnue")}
            </p>

            <div className="text-sm text-green-900 space-y-1">
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
                      <strong>Structure technique :</strong> {item.tech_structure.first_name}
                    </p>
                  )}
                  {averageRating && (
                    <p className="text-yellow-600 font-semibold mt-4 mb-2">
                      ⭐ Note moyenne : {averageRating} / 5 ({ratings.length} avis)
                    </p>
                  )}
                  {item.sponsor_report && (
                    <p className="italic text-green-900 mt-2">
                      <strong>Avis sponsor :</strong> {item.sponsor_report} <br />
                      <strong>Note :</strong> {item.sponsor_rating} / 5
                    </p>
                  )}
                  {item.tech_report && (
                    <p className="italic text-green-900 mt-2">
                      <strong>Avis structure technique :</strong> {item.tech_report} <br />
                      <strong>Note :</strong> {item.tech_rating} / 5
                    </p>
                  )}
                </>
              )}
            </div>

            {(land.weather_data || item.weather_data) &&
              (() => {
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

      {/* Modal de sponsoring */}
      <SponsorModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmSponsorship}
        loading={loading}
        techStructures={techStructures}
        selectedTechStructure={selectedTechStructure}
        setSelectedTechStructure={setSelectedTechStructure}
      />

      {/* Modal d'avis */}
      <ReviewModal
        isOpen={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        onConfirm={submitReview}
        loading={loadingReview}
        initialReport={initialReport}
        initialRating={initialRating}
      />
    </>
  );
}
