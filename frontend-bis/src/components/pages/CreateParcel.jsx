// src/components/pages/CreateParcel.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function CreateParcel() {
  const [formData, setFormData] = useState({
    area: '',
    vegetation_type: '',
    feasibility: '',
    latitude: 5.34,
    longitude: -4.03,
    country: '',
    owner_id: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData(prev => ({ ...prev, owner_id: user.id }));
    }
  }, []);

  function LocationPicker() {
    useMapEvents({
      click(e) {
        setFormData(prev => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        }));
      },
    });
    return <Marker position={[formData.latitude, formData.longitude]} />;
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const parcelWithId = {
      ...formData,
      id: crypto.randomUUID(),
      status: 'proposed'
    };
    const existing = JSON.parse(localStorage.getItem('parcelles') || '[]');
    localStorage.setItem('parcelles', JSON.stringify([...existing, parcelWithId]));
    setFormData({
      area: '',
      vegetation_type: '',
      feasibility: '',
      latitude: 5.34,
      longitude: -4.03,
      country: '',
      owner_id: parcelWithId.owner_id
    });
    alert("Parcelle soumise avec succès !");
  };

  return (
    <section className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Créer une nouvelle parcelle</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="Superficie (hectares)" className="border p-2 rounded" />
        <input type="text" name="vegetation_type" value={formData.vegetation_type} onChange={handleChange} placeholder="Type de végétation" className="border p-2 rounded" />
        <input type="text" name="feasibility" value={formData.feasibility} onChange={handleChange} placeholder="Faisabilité (ex: Haute, Moyenne...)" className="border p-2 rounded" />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Pays" className="border p-2 rounded" />

        <div className="h-64 rounded overflow-hidden mt-4">
          <MapContainer center={[formData.latitude, formData.longitude]} zoom={8} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <LocationPicker />
          </MapContainer>
        </div>

        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded mt-4">
          Soumettre
        </button>
      </form>
    </section>
  );
}
