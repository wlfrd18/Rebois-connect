import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MapSelector from "../components/MapSelector";

export default function LandForm({ onSuccess }) {
  const [form, setForm] = useState({
    area: "",
    vegetation_type: "",
    feasibility: "",
    latitude: null,
    longitude: null,
    country: "",
    photo_url: "",
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!location) return;

    const { lat, lng } = location;
    setForm(f => ({ ...f, latitude: lat, longitude: lng }));

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(() => toast.error("Erreur lors du chargement de la météo."));

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(geoData => {
        const country = geoData?.address?.country || "";
        setForm(f => ({ ...f, country }));
      })
      .catch(() => toast.error("Erreur lors de la récupération du pays."));
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "area" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.latitude === null || form.longitude === null) {
      toast.error("Veuillez sélectionner l'emplacement sur la carte.");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      weather_data: weatherData ? JSON.stringify(weatherData) : undefined,
    };

    console.log("🔁 Payload envoyé :", payload);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/lands/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("↩️ Réponse du backend :", result);

      if (res.ok) {
        toast.success("Terre créée avec succès !");
        if (onSuccess) onSuccess(result);
        navigate("/dashboard");
      } else {
        console.error("❌ Erreur backend :", result);
        toast.error(result.message || JSON.stringify(result) || "Erreur lors de la création");
      }
    } catch (err) {
      console.error("⚠️ Erreur réseau :", err);
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/upload/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      console.log("📷 Réponse upload photo :", data);

      if (res.ok && data.photo_url) {
        setForm(f => ({ ...f, photo_url: data.photo_url }));
        toast.success("Photo téléchargée !");
      } else {
        toast.error(data.message || "Erreur lors de l’upload");
      }
    } catch (err) {
      console.error("⚠️ Erreur upload photo :", err);
      toast.error("Échec de l’upload.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-green-700">Nouvelle Terre</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="area"
          placeholder="Surface en hectares"
          value={form.area}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="text"
          name="vegetation_type"
          placeholder="Type de végétation"
          value={form.vegetation_type}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="text"
          name="feasibility"
          placeholder="Faisabilité"
          value={form.feasibility}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Photo de la terre
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full border rounded p-2"
          />
          {form.photo_url && (
            <img
              src={form.photo_url}
              alt="Aperçu"
              className="w-full h-40 object-cover rounded"
            />
          )}
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">
            Cliquez sur la carte pour choisir l'emplacement :
          </p>
          <MapSelector initialPosition={[5.3685, -3.9719]} onChange={setLocation} />
        </div>

        {form.latitude !== null && form.longitude !== null && (
          <p className="text-sm text-green-700">
            Latitude : {form.latitude.toFixed(4)} | Longitude : {form.longitude.toFixed(4)}
          </p>
        )}
        {form.country && (
          <p className="text-sm text-green-700">Pays : {form.country}</p>
        )}
        {weatherData?.current_weather && (
          <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
            <p>Météo actuelle : {weatherData.current_weather.temperature}°C</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || form.latitude === null}
          className={`w-full py-2 rounded text-white ${
            loading || form.latitude === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Enregistrement..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
