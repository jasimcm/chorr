'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

interface Mosque {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  center: [number, number];
  mosques: Mosque[];
  editable?: boolean;
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
}

// Component to handle map center changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 6);
  return null;
}

// Component to handle location selection
function LocationMarker({ onLocationSelect }: { 
  onLocationSelect: (location: { latitude: number; longitude: number }) => void 
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect({ latitude: lat, longitude: lng });
    });
  }, [map, onLocationSelect]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location</Popup>
    </Marker>
  );
}

export default function MapComponent({ center, mosques, editable, onLocationSelect }: MapComponentProps) {
  // Fix Leaflet icons
  useEffect(() => {
    (async function init() {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    })();
  }, []);
  
  return (
    <MapContainer 
      center={center} 
      zoom={6} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} />
      
      {mosques.map((mosque) => (
        <Marker 
          key={mosque.id} 
          position={[mosque.latitude, mosque.longitude]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{mosque.name}</h3>
              <p>{mosque.address}</p>
              <Link 
                href={`/mosques/${mosque.id}`}
                className="text-blue-500 hover:underline"
              >
                View details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {editable && onLocationSelect && (
        <LocationMarker onLocationSelect={onLocationSelect} />
      )}
    </MapContainer>
  );
}
