'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Mosque {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  selectedMosque?: Mosque;
  editable?: boolean;
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
}

// Use dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-800 animate-pulse rounded-lg" />
});

export default function MapView({ selectedMosque, editable, onLocationSelect }: MapViewProps) {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMosques() {
      try {
        const mosquesCollection = collection(db, 'mosques');
        const mosquesSnapshot = await getDocs(mosquesCollection);
        const mosquesList = mosquesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Mosque[];
        
        setMosques(mosquesList);
      } catch (error) {
        console.error("Error fetching mosques:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMosques();
  }, []);

  const center = selectedMosque 
    ? [selectedMosque.latitude, selectedMosque.longitude] as [number, number]
    : [20.5937, 78.9629] as [number, number]; // Default to center of India

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      {!loading && (
        <MapComponent 
          center={center}
          mosques={mosques}
          editable={editable}
          onLocationSelect={onLocationSelect}
        />
      )}
    </div>
  );
}
