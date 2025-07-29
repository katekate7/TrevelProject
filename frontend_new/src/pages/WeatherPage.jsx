/**
 * @fileoverview WeatherPage component for displaying trip weather forecasts
 * This component shows weather forecasts for a specific trip with update functionality
 * and SEO optimization for weather-related content.
 */

// src/pages/WeatherPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SEO from '../components/SEO/SEO';
import { seoConfig, generateCanonicalUrl } from '../components/SEO/seoConfig';

/**
 * WeatherPage Component
 * 
 * Displays weather forecast for a specific trip with the ability to update
 * the forecast data. Features responsive grid layout and SEO optimization.
 * 
 * @component
 * @returns {JSX.Element} The rendered weather page with forecast data
 * 
 * @example
 * // Used to display weather for a specific trip
 * <Route path="/trip/:id/weather" element={<WeatherPage />} />
 */
export default function WeatherPage() {
  /** Trip ID extracted from URL parameters */
  const { id } = useParams();
  
  /** React Router navigation hook */
  const nav = useNavigate();

  /** @type {[Array<Object>, Function]} Weather forecast data array */
  const [forecast, setForecast] = useState([]);
  
  /** @type {[boolean, Function]} Loading state for initial forecast fetch */
  const [loading, setLoading] = useState(true);
  
  /** @type {[boolean, Function]} Loading state for forecast updates */
  const [updating, setUpdating] = useState(false);

  /**
   * Loads weather forecast data for the trip
   * Fetches forecast from API and handles loading states
   * 
   * @async
   * @function
   */
  // ── Loading forecast data ───────────────────────
  const loadForecast = () => {
    setLoading(true); // Start loading indicator
    
    api.get(`/trips/${id}/weather`)
      .then(r => setForecast(r.data)) // Set forecast data on success
      .catch(console.error)           // Log any errors
      .finally(() => setLoading(false)); // Always stop loading indicator
  };

  /**
   * Updates weather forecast data and reloads the display
   * Triggers API update then fetches fresh data
   * 
   * @async
   * @function
   */
  // ── Update forecast and reload immediately ───
  const updateForecast = () => {
    setUpdating(true); // Start updating indicator
    
    api.patch(`/trips/${id}/weather/update`)
      .then(() => loadForecast()) // Reload forecast after update
      .catch(console.error)       // Log any errors
      .finally(() => setUpdating(false)); // Always stop updating indicator
  };

  /**
   * Effect hook to load forecast data when component mounts or trip ID changes
   * 
   * @function
   */
  useEffect(loadForecast, [id]);

  // Early return for loading state
  if (loading) return <p>Downloading the weather…</p>;

  // Early return for empty or invalid forecast data
  if (!Array.isArray(forecast) || forecast.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-600">The forecast is currently unavailable. Please try refreshing later.</p>
        {/* Manual update button for when automatic loading fails */}
        <button
          onClick={updateForecast}
          disabled={updating}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {updating ? 'Update...' : 'Try to update again'}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* SEO optimization for weather page */}
      <SEO 
        title={seoConfig.weather.title}
        description={seoConfig.weather.description}
        keywords={seoConfig.weather.keywords}
        url={generateCanonicalUrl(`/trip/${id}/weather`)}
      />
      
      {/* Main weather page layout */}
      <div className="flex h-screen">
        <main className="flex-1 p-6 pt-12 md:pt-6 overflow-auto relative">

          {/* Page title with custom font */}
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>Forecast</h2>

          {/* Update forecast button */}
          <button
            onClick={updateForecast}
            disabled={updating}
            className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {updating ? 'Updating...' : 'Update'}
          </button>

          {/* Weather forecast grid - responsive layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forecast.map(day => {
              // Format date for display
              const date = new Date(day.dt * 1000).toLocaleDateString();
              
              return (
                <div key={day.dt} className="p-4 border rounded-lg">
                  {/* Date header */}
                  <h3 className="font-bold">{date}</h3>
                  
                  {/* Temperature information */}
                  <p>Day: {day.temp.day}°C, Night: {day.temp.night}°C</p>
                  
                  {/* Weather description */}
                  <p>{day.weather[0].description}</p>
                  
                  {/* Weather icon from OpenWeatherMap */}
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
