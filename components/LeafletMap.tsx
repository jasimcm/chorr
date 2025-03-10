"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";





// Custom mosque marker icon
const mosqueIcon = L.icon({
  iconUrl: "/marker.jpg",
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



// Function to fetch nearby mosques using Overpass API
const fetchNearbyMosques = async (lat: number, lng: number): Promise<Mosque[]> => {
  const overpassQuery = `
    [out:json];
    node["amenity"="place_of_worship"]["religion"="muslim"](around:400,${lat},${lng});
    out;
  `;

  try {
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
    );
    const data = await response.json();
    return data.elements.map((element: any) => ({
      lat: element.lat,
      lon: element.lon,
      name: element.tags.name || "Unnamed Mosque",
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
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Coordinates:", latitude, longitude); // ✅ Check coordinates
        setUserLocation([latitude, longitude]);

        const mosqueData = await fetchNearbyMosques(latitude, longitude);
        setMosques(mosqueData);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Error fetching your location. Please ensure GPS is enabled.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Ensures accurate location
    );
  }, []);

 

  if (!userLocation) return <p>Loading your location...</p>;

  return (
    <MapContainer
      key={userLocation?.join(",")} // 🔥 Forces map to re-render when location updates
      center={userLocation}
      zoom={17} // 🔍 Increased zoom for accuracy
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
        <Marker
          key={index}
          position={[mosque.lat, mosque.lon]}
          icon={mosqueIcon}
        >
          <Popup>{mosque.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
