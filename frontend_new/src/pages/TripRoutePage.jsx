/**
 * TripRoutePage - Interactive map with route calculation
 * 
 * Displays an interactive map showing optimized routes between selected trip waypoints.
 * Users can choose different transportation modes (car, walking, cycling) to see
 * different route calculations using OpenRouteService API.
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapContainer, TileLayer, Polyline, Marker, Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import openrouteservice from 'openrouteservice-js';
import { fetchTripPlaces } from '../api';

/**
 * Available transportation modes for route calculation
 * Each mode corresponds to OpenRouteService profile and provides different routing
 */
const MODES = [
  { id: 'driving-car', label: '🚗', title: 'Car' },
  { id: 'foot-walking', label: '🚶', title: 'Walk' },
  { id: 'cycling-regular', label: '🚲', title: 'Bike' },
];

export default function TripRoutePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [waypoints,  setWaypoints]  = useState([]); // Trip waypoints with coordinates
  const [coordinates, setCoordinates] = useState([]); // Route line coordinates
  const [mode,       setMode]       = useState('foot-walking'); // Transportation mode
  const [loading,    setLoading]    = useState(true); // Loading state

  // Fetch trip places data
  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchTripPlaces(id);
        if (!data.length) throw new Error('No waypoints found for this trip');
        setWaypoints(data);
      } catch (error) {
        alert('Route not found'); 
        navigate(-1);
      }
    })();
  }, [id, navigate]);

  // Calculate optimal route using OpenRouteService API
  useEffect(() => {
    if (!waypoints.length) return;
    
    let canceled = false; // Prevent updates after unmount
    setLoading(true);

    (async () => {
      // Initialize routing service
      const ors = new openrouteservice.Directions({
        api_key: import.meta.env.VITE_ORS_API_KEY,
      });

      // Convert waypoints to [lng, lat] format
      const coords = waypoints.map(w => [w.lng, w.lat]);

      try {
        // Get route from OpenRouteService
        const res = await ors.calculate({
          coordinates: coords,
          profile: mode,
          format: 'geojson',
        });

        // Convert coordinates for Leaflet map [lat, lng]
        const line = res.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        if (!canceled) {
          setCoordinates(line);
          setLoading(false);
        }
      } catch (error) {
        console.error('Route calculation failed:', error.response?.data || error.message);
        if (!canceled) setLoading(false);
      }
    })();

    return () => { canceled = true; };
  }, [waypoints, mode]);

  if (loading) return <p className="p-6">Downloading the route…</p>;
  if (!waypoints.length)
    return <p className="p-6 text-red-600">Route not found</p>;

  const center = [waypoints[0].lat, waypoints[0].lng]; // Map center point

  return (
    <>
      {/* CSS for proper Leaflet z-index */}
      <style>{`
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 1 !important;
        }
      `}</style>
      <div className="p-6 pt-12 md:pt-6 space-y-4 relative">
        
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>The route of the trip</h1>

        {/* Transportation mode buttons */}
        <div className="flex gap-2">
        {MODES.map(m => (
          <button
            key={m.id}
            title={m.title}
            className={`px-3 py-1 border rounded ${
              mode === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100'
            } hover:bg-gray-200`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Interactive map with route */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <MapContainer center={center} zoom={13} style={{ height: '60vh', zIndex: 1 }}>
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Route line */}
          <Polyline positions={coordinates} />
          {/* Waypoint markers */}
          {waypoints.map((wp, i) => (
            <Marker key={i} position={[wp.lat, wp.lng]}>
              <Popup>{wp.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
    </>
  );
}
