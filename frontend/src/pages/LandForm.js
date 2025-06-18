import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function LandForm({ onSuccess }) {
  const [form, setForm] = useState({
    area: "",
    vegetation_type: "",
    feasibility: "",
    latitude: null,
    longitude: null,
    photo_url: "",
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMapClick = async ({ lat, lng }) => {
    setForm((f) => ({ ...f, latitude: lat, longitude: lng }));

    // Appel météo
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      toast.error("Erreur lors du chargement de la météo.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      weather_data: weatherData,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/lands/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Terre créée avec succès !");
        if (onSuccess) onSuccess(result);
        setForm({
          area: "",
          vegetation_type: "",
          feasibility: "",
          latitude: null,
          longitude: null,
          photo_url: "",
          country: "",
        });
        setWeatherData(null);
      } else {
        toast.error(result.message || "Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.photo_url) {
        setForm((f) => ({ ...f, photo_url: data.photo_url }));
        toast.success("Photo téléchargée !");
      } else {
        toast.error(data.message || "Erreur lors de l’upload");
      }
    } catch (err) {
      toast.error("Échec de l’upload.");
    }
  };


  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-xl mx-auto">
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
          <p className="text-sm text-gray-600 mb-1">Cliquez sur la carte pour choisir l'emplacement :</p>
          <MapContainer center={[0, 0]} zoom={2} style={{ height: "300px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationSelector onSelect={handleMapClick} />
            {form.latitude && form.longitude && (
              <Marker position={[form.latitude, form.longitude]} icon={defaultIcon} />
            )}
          </MapContainer>
        </div>

        {form.latitude && form.longitude && (
          <p className="text-sm text-green-700">
            Latitude: {form.latitude.toFixed(4)} | Longitude: {form.longitude.toFixed(4)}
          </p>
        )}

        {weatherData?.current_weather && (
          <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
            <p>Météo actuelle : {weatherData.current_weather.temperature}°C</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Enregistrement..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
