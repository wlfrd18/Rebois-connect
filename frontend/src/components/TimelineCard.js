import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SponsorModal from "./SponsorModal";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import ReviewModal from "./ReviewModal";

// Import des icônes react-icons
import { MdAttachMoney } from "react-icons/md";
import { FiFileText, FiLoader, FiCheckCircle, FiCompass } from "react-icons/fi";
import { WiThermometer, WiStrongWind } from "react-icons/wi";

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
      <div className={`p-4 rounded-xl shadow transition border flex flex-col ${isProject ? "bg-green-300 cursor-default" : "bg-white cursor-pointer hover:shadow-md border-green-100"}`}>
        {/* Première ligne (photo + infos de base) */}
        <div className="flex flex-col sm:flex-row gap-4">
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
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded text-sm font-bold flex items-center justify-center gap-2"
              >
                <MdAttachMoney size={18} />
                Sponsoriser
              </button>
            )}
            {(isSponsor || isTech) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReviewModal(true);
                }}
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded font-bold text-sm flex items-center justify-center gap-2"
              >
                <FiFileText size={18} />
                Noter ce projet
              </button>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900">{`ID du ${isProject ? "projet" : "terrain"} : ${item.id}`}</h3>
            <p className="text-sm text-green-800 mb-2 flex items-center gap-2">
              {(() => {
                const status = item.status || "proposed";
                const base = "text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1";
                const map = {
                  proposed: ["bg-yellow-100", "text-yellow-800", <><FiFileText size={14} /> Proposé</>],
                  in_progress: ["bg-blue-100", "text-blue-800", <><FiLoader size={14} className="animate-spin" /> En cours</>],
                  completed: ["bg-green-200", "text-green-900", <><FiCheckCircle size={14} /> Terminé</>],
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
                  <div className="mt-3 text-sm text-blue-700 bg-blue-50 p-2 rounded space-y-1">
                    {currentWeather.temperature != null && (
                      <p className="flex items-center gap-2">
                        <WiThermometer size={18} />
                        Température : <strong>{currentWeather.temperature}°C</strong>
                      </p>
                    )}
                    {currentWeather.windspeed != null && (
                      <p className="flex items-center gap-2">
                        <WiStrongWind size={18} />
                        Vent : <strong>{currentWeather.windspeed} km/h</strong>
                      </p>
                    )}
                    {currentWeather.winddirection != null && (
                      <p className="flex items-center gap-2">
                        <FiCompass size={18} />
                        Direction : <strong>{currentWeather.winddirection}°</strong>
                      </p>
                    )}
                  </div>
                );
              })()}
          </div>
        </div>

        {/* Deuxième ligne (avis qui s'étend sur toute la largeur) */}
        {isProject && (
          <div className="mt-4 space-y-3 w-full">
            {averageRating && (
              <div className="flex items-center space-x-1 text-sm">
                <StarRating 
                  rating={parseFloat(averageRating)} 
                  size={14}
                  precision={0.1}
                  onChange={null}
                />
                <span className="text-gray-500 ml-1">({ratings.length})</span>
              </div>
            )}
            
            {item.sponsor_report && item.sponsor && (
              <ReviewCard
                user={item.sponsor}
                rating={item.sponsor_rating}
                report={item.sponsor_report}
              />
            )}
            
            {item.tech_report && item.tech_structure && (
              <ReviewCard
                user={item.tech_structure}
                rating={item.tech_rating}
                report={item.tech_report}
              />
            )}
          </div>
        )}
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
