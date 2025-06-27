import React from "react";
import { useNavigate } from "react-router-dom";

export default function TimelineCard({ item }) {
  const navigate = useNavigate();

  const isLand = !!item.owner_id;
  const isProject = !!item.sponsor_id;

  const land = isProject ? item.land || {} : item;

  const title = `ID du ${isProject ? "projet" : "terrain"} : ${item.id}`;
  const status = item.status || "proposed";

  const createdAt =
    item.created_at?.split("T")[0] ||
    land.created_at?.split("T")[0] ||
    "Date inconnue";

  const country = land.country || "Pays inconnu";
  const area = land.area ? `${land.area} ha` : null;
  const vegetation = land.vegetation_type || null;
  const imageUrl = item.photo_url || land.photo_url || "/placeholder-land.jpg";

  const rawWeather = land.weather_data || item.weather_data;
  let currentWeather = null;

  if (rawWeather) {
    try {
      const wd = typeof rawWeather === "string" ? JSON.parse(rawWeather) : rawWeather;
      currentWeather = wd?.current_weather || wd?.current || null;
    } catch (e) {
      console.error("Erreur parsing weather_data", e);
    }
  }

  const ownerName =
    item.owner
      ? `${item.owner.first_name} ${item.owner.last_name}`.trim()
      : "";
  const sponsorName =
    item.sponsor
      ? `${item.sponsor.first_name} ${item.sponsor.last_name}`.trim()
      : "";
  const volunteerName =
    item.volunteer
      ? `${item.volunteer.first_name} ${item.volunteer.last_name}`.trim()
      : "";
  const techStructureName =
    item.tech_structure
      ? `${item.tech_structure.first_name} ${item.tech_structure.last_name}`.trim()
      : "";

  const getStatusBadge = (st) => {
    const base = "text-xs font-semibold px-2 py-1 rounded-full";
    const map = {
      proposed: ["bg-yellow-100", "text-yellow-800", "📝 Proposé"],
      in_progress: ["bg-blue-100", "text-blue-800", "🚧 En cours"],
      completed: ["bg-green-100", "text-green-800", "✅ Terminé"],
    };
    const [bg, textColor, label] = map[st] || [
      "bg-gray-200",
      "text-gray-800",
      st,
    ];
    return <span className={`${base} ${bg} ${textColor}`}>{label}</span>;
  };

  const handleClick = () => {
    navigate(isLand ? `/lands/${item.id}` : `/projects/${item.id}`);
  };

  return (
    <div
      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer border border-green-100 flex flex-col sm:flex-row gap-4"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <img
        src={imageUrl}
        alt="aperçu"
        className="w-full sm:w-40 h-32 object-cover rounded-lg"
      />

      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-semibold text-green-800">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {getStatusBadge(status)} • {createdAt}
          </p>

          <div className="text-sm text-gray-700 space-y-1">
            {ownerName && <p><strong>Propriétaire :</strong> {ownerName}</p>}
            {country && <p><strong>Pays :</strong> {country}</p>}
            {area && <p><strong>Surface :</strong> {area}</p>}
            {vegetation && isLand && (
              <p><strong>Végétation :</strong> {vegetation}</p>
            )}

            {isProject && (
              <>
                {sponsorName && <p><strong>Sponsor :</strong> {sponsorName}</p>}
                {volunteerName && (
                  <p><strong>Volontaire :</strong> {volunteerName}</p>
                )}
                {techStructureName && (
                  <p><strong>Structure technique :</strong> {techStructureName}</p>
                )}
                {item.report && (
                  <p className="italic text-gray-600">
                    <strong>Rapport :</strong> {item.report}
                  </p>
                )}
              </>
            )}
          </div>

          {currentWeather && (
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
          )}
        </div>
      </div>
    </div>
  );
}
