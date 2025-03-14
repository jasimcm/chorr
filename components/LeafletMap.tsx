"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Custom mosque marker icon
const mosqueIcon = L.icon({
  iconUrl: "/marker.jpg", // Ensure marker image exists in the public folder
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

// Mosque data type for TypeScript
interface Mosque {
  lat: number;
  lon: number;
  name: string;
}

// Function to fetch nearby mosques using OpenStreetMap Nominatim API
const fetchNearbyMosques = async (latitude: number, longitude: number): Promise<Mosque[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=mosque&bounded=1&viewbox=${
        longitude - 0.02
      },${latitude - 0.02},${longitude + 0.02},${latitude + 0.02}`
    );
    const data = await response.json();

    return data.map((mosque: any) => ({
      lat: parseFloat(mosque.lat),
      lon: parseFloat(mosque.lon),
      name: mosque.display_name || "Unnamed Mosque",
    }));
  } catch (error) {
    console.error("Error fetching mosques:", error);
    return [];
  }
};

const LeafletMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Coordinates:", latitude, longitude);
        setUserLocation([latitude, longitude]);

        const mosqueData = await fetchNearbyMosques(latitude, longitude);
        setMosques(mosqueData);
      },
      (error) => {
        console.error("Error fetching location:", error);

        // Handle specific errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please allow location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Try again later.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out. Please try again.");
            break;
          default:
            alert("An unknown error occurred while fetching location.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  if (!userLocation) return <p>Loading your location...</p>;

  return (
    <MapContainer
      key={userLocation?.join(",")} // Forces map to re-render when location updates
      center={userLocation}
      zoom={17} // Increased zoom for accuracy
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User's Location Marker */}
      <Marker position={userLocation}>
        <Popup>You are here!</Popup>
      </Marker>

      {/* Nearby Mosques */}
      {mosques.map((mosque, index) => (
        <Marker key={index} position={[mosque.lat, mosque.lon]} icon={mosqueIcon}>
          <Popup>{mosque.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
