// src/components/ui/homestaydetailspage/MapView.tsx
"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create a custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface MapViewProps {
  latitude: number;
  longitude: number;
  name?: string;
}

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, name }) => {
  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    return <span className="text-mitti-dark-brown">Location not available</span>;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={18}
      style={{ height: "100%", width: "100%" }}
      className="w-full h-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]} icon={customIcon}>
        <Popup>{name || "Homestay Location"}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;