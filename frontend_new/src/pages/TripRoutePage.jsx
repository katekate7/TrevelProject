/**
 * @fileoverview TripRoutePage component for displaying and managing trip routes
 * This component provides an interactive map interface for viewing trip routes
 * with different transportation modes and real-time route calculation.
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
 * @constant {Array<Object>} MODES
 * @property {string} id - OpenRouteService profile identifier
 * @property {string} label - Emoji representation of the mode
 * @property {string} title - Human-readable title for the mode
 */
const MODES = [
  { id: 'driving-car', label: '🚗', title: 'Car' },
  { id: 'foot-walking', label: '🚶', title: 'Walk' },
  { id: 'cycling-regular', label: '🚲', title: 'Bike' },
];

/**
 * TripRoutePage Component
 * 
 * Displays an interactive map showing the route between trip waypoints.
 * Users can switch between different transportation modes (car, walking, cycling)
 * to see different route calculations.
 * 
 * @component
 * @returns {JSX.Element} The rendered trip route page with interactive map
 * 
 * @example
 * // Used in React Router with trip ID parameter
 * <Route path="/trip/:id/route" element={<TripRoutePage />} />
 */
export default function TripRoutePage() {
  const { id } = useParams(); // Extract trip ID from URL parameters
  const navigate = useNavigate(); // React Router navigation hook

  // State variables with JSDoc types
  /** @type {[Array<Object>, Function]} Waypoints data from the trip */
  const [waypoints,  setWaypoints]  = useState([]);
  
  /** @type {[Array<Array<number>>, Function]} Route coordinates for the polyline */
  const [coordinates, setCoordinates] = useState([]);
  
  /** @type {[string, Function]} Current transportation mode */
  const [mode,       setMode]       = useState('foot-walking');
  
  /** @type {[boolean, Function]} Loading state for route calculation */
  const [loading,    setLoading]    = useState(true);

  /**
   * Effect hook to fetch trip places data when component mounts or trip ID changes
   * Fetches waypoints for the specified trip and handles errors
   * 
   * @async
   * @function
   * @dependencies {string} id - Trip ID from URL parameters
   */
  useEffect(() => {
    (async () => {
      try {
        // Fetch trip places data using the trip ID
        const { data } = await fetchTripPlaces(id);
        
        // Check if any waypoints were returned
        if (!data.length) throw new Error('No waypoints found for this trip');
        
        // Set the waypoints in state
        setWaypoints(data);
      } catch (error) {
        // Show error message and navigate back if trip not found
        alert('Route not found'); 
        navigate(-1); // Navigate back to previous page
      }
    })();
  }, [id, navigate]); // Dependencies: re-run when trip ID changes

  /**
   * Effect hook to calculate route based on waypoints and transportation mode
   * Uses OpenRouteService API to calculate optimal route between waypoints
   * Includes cleanup function to cancel requests if component unmounts
   * 
   * @async
   * @function
   * @dependencies {Array} waypoints - Array of waypoint objects with lat/lng coordinates
   * @dependencies {string} mode - Transportation mode (driving-car, foot-walking, cycling-regular)
   */
  useEffect(() => {
    // Exit early if no waypoints are available
    if (!waypoints.length) return;
    
    let canceled = false; // Flag to prevent state updates after component unmount
    setLoading(true); // Start loading state

    (async () => {
      // Initialize OpenRouteService client with API key
      const ors = new openrouteservice.Directions({
        api_key: import.meta.env.VITE_ORS_API_KEY,
      });

      // Convert waypoints to coordinate format expected by ORS [lng, lat]
      const coords = waypoints.map(w => [w.lng, w.lat]);

      try {
        // Calculate route using OpenRouteService
        const res = await ors.calculate({
          coordinates: coords,     // Array of [lng, lat] coordinate pairs
          profile: mode,          // Transportation mode profile
          format: 'geojson',      // Response format
        });

        // Extract route coordinates and convert from [lng, lat] to [lat, lng] for Leaflet
        const line = res.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        // Update state only if component is still mounted
        if (!canceled) {
          setCoordinates(line);
          setLoading(false);
        }
      } catch (error) {
        // Log detailed error information for debugging
        console.error('Route calculation failed:', error.response?.data || error.message);
        
        // Update loading state only if component is still mounted
        if (!canceled) setLoading(false);
      }
    })();

    // Cleanup function to prevent state updates after unmount
    return () => { canceled = true; };
  }, [waypoints, mode]); // Dependencies: re-run when waypoints or mode changes

  // Early returns for loading and error states
  if (loading) return <p className="p-6">Downloading the route…</p>;
  if (!waypoints.length)
    return <p className="p-6 text-red-600">Route not found</p>;

  // Calculate map center based on first waypoint
  const center = [waypoints[0].lat, waypoints[0].lng];

  return (
    <>
      {/* Custom CSS to ensure proper z-index for Leaflet components */}
      <style>{`
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 1 !important;
        }
      `}</style>
      <div className="p-6 pt-12 md:pt-6 space-y-4 relative">
        
        {/* Page title with custom font */}
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>The route of the trip</h1>

        {/* Transportation mode selector buttons */}
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

      {/* Map container with route visualization */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <MapContainer center={center} zoom={13} style={{ height: '60vh', zIndex: 1 }}>
          {/* OpenStreetMap tile layer */}
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Route polyline showing calculated path */}
          <Polyline positions={coordinates} />
          {/* Markers for each waypoint with popup showing title */}
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
