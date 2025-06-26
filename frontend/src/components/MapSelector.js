// MapSelector.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icône marker par défaut dans React-Leaflet (import nécessaire)
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41], // point de la pointe du marker
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });

  if (!position) return null;

  return <Marker position={position} />;
}

export default function MapSelector({ initialPosition, onChange }) {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleChange = (latlng) => {
    setPosition(latlng);
    onChange && onChange(latlng);
  };

  return (
    <MapContainer
      center={position || [0, 0]}
      zoom={position ? 13 : 2}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onChange={handleChange} />
    </MapContainer>
  );
}
