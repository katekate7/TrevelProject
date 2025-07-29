/**
 * @fileoverview TripDetailPage component for displaying detailed trip information
 * This component shows comprehensive trip details including description, image,
 * and weather information for a specific trip.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * TripDetailPage Component
 * 
 * Displays detailed information about a specific trip including city, country,
 * description, thumbnail image, and current weather conditions.
 * 
 * @component
 * @returns {JSX.Element} The rendered trip detail page
 * 
 * @example
 * // Used to display detailed information for a specific trip
 * <Route path="/trip/:id" element={<TripDetailPage />} />
 */
export default function TripDetailPage() {
  /** Trip ID extracted from URL parameters */
  const { id } = useParams();
  
  /** React Router navigation hook */
  const navigate = useNavigate();
  
  /** @type {[Object|null, Function]} Trip data object with all details */
  const [trip, setTrip] = useState(null);
  
  /** @type {[boolean, Function]} Loading state for trip data fetch */
  const [loading, setLoad] = useState(true);

  /**
   * Effect hook to fetch trip details when component mounts or ID changes
   * Loads comprehensive trip information from API
   * 
   * @async
   * @function
   */
  useEffect(() => {
    api.get(`/trips/${id}`)
       .then(r => setTrip(r.data))     // Set trip data on success
       .catch(console.error)           // Log any errors
       .finally(() => setLoad(false)); // Always stop loading indicator
  }, [id]); // Re-run when trip ID changes

  // Early return patterns for different states
  if (loading) return <p>Loading...</p>;
  if (!trip) return <p>Trip not found</p>;

  /* ────────── Trip detail content ────────── */
  return (
    <div className="p-6 pt-12 md:pt-6 overflow-auto relative">

      {/* Trip title with city and country */}
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>
        {trip.city}, {trip.country}
      </h1>

      {/* City thumbnail image if available */}
      {trip.imageUrl && (
        <img
          src={trip.imageUrl}
          alt={`${trip.city} thumbnail`}
          className="mb-4 w-full max-w-md object-cover rounded-lg shadow"
        />
      )}

      {/* Trip description with preserved formatting */}
      <p className="text-lg leading-relaxed whitespace-pre-wrap mb-6">
        {trip.description}
      </p>

      {/* Weather information card if available */}
      {trip.weather && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow w-fit">
          <h3 className="text-xl font-semibold mb-2">Weather</h3>
          <p>Temperature: {trip.weather.temperature}°C</p>
          <p>Description: {trip.weather.weatherDescription}</p>
        </div>
      )}
    </div>
  );
}
