/**
 * @fileoverview FirstTripPage component for creating the user's first trip
 * This component provides a form interface for new users to create their first trip
 * with city search autocomplete and date selection functionality.
 */

// src/pages/FirstTripPage.jsx
import React, { useState } from 'react';
import debounce          from 'lodash.debounce';
import { useNavigate }    from 'react-router-dom';
import api                from '../api';

/**
 * FirstTripPage Component
 * 
 * Form interface for creating a new trip. Features real-time city search with
 * autocomplete suggestions, date validation, and automatic weather data fetching
 * upon trip creation.
 * 
 * @component
 * @returns {JSX.Element} The rendered first trip creation form
 * 
 * @example
 * // Used for new users or when creating additional trips
 * <Route path="/first-trip" element={<FirstTripPage />} />
 */
export default function FirstTripPage() {
  /** React Router navigation hook for programmatic navigation */
  const navigate = useNavigate();

  /* ───────── State management ───────── */
  /** @type {[string, Function]} Selected country name */
  const [country,      setCountry]   = useState('');
  
  /** @type {[string, Function]} Selected city name */
  const [city,         setCity]      = useState('');
  
  /** @type {[string, Function]} Trip start date in YYYY-MM-DD format */
  const [startDate,    setStartDate] = useState('');
  
  /** @type {[string, Function]} Trip end date in YYYY-MM-DD format */
  const [endDate,      setEndDate]   = useState('');
  
  /** @type {[Array<Object>, Function]} Array of city suggestions from search */
  const [suggestions,  setSug]       = useState([]);

  /**
   * Debounced function to fetch city suggestions from API
   * Prevents excessive API calls while user is typing
   * 
   * @async
   * @function
   * @param {string} q - Search query for city names
   */
  /* ───────── Live city search with autocomplete ───────── */
  const fetchCities = debounce(async q => {
    // Clear suggestions if query is empty
    if (!q) return setSug([]);
    
    try {
      // Fetch matching cities from API
      const { data } = await api.get(`/cities?q=${encodeURIComponent(q)}`);
      setSug(data);
    } catch (e) {
      console.error('City search error:', e);
    }
  }, 300); // 300ms delay to debounce requests

  /**
   * Handles city input changes and triggers search
   * Updates city state and fetches suggestions
   * 
   * @function
   * @param {Event} e - Input change event
   */
  const handleCityChange = e => {
    const v = e.target.value;
    setCity(v);           // Update city input value
    fetchCities(v);       // Trigger debounced search
  };

  /**
   * Handles selection of a city from suggestions dropdown
   * Sets both city and country, then clears suggestions
   * 
   * @function
   * @param {Object} s - Selected suggestion object with city and country
   * @param {string} s.city - City name
   * @param {string} s.country - Country name
   */
  const pickSuggestion = s => {
    setCity(s.city);      // Set selected city
    setCountry(s.country); // Set corresponding country
    setSug([]);          // Clear suggestions dropdown
  };

  /**
   * Handles form submission to create a new trip
   * Creates trip via API, fetches weather data, and navigates to trip details
   * 
   * @async
   * @function
   * @param {Event} e - Form submission event
   */
  /* ───────── Form submission ───────── */
  const handleSubmit = async e => {
    e.preventDefault(); // Prevent default form submission
    
    try {
      // Create new trip with form data
      const { data } = await api.post('/trips/add', {
        country, 
        city, 
        startDate, 
        endDate,
      });
      
      const id = data.id;
      
      // Automatically fetch weather data for the new trip
      await api.patch(`/trips/${id}/weather/update`);
      
      // Navigate to the newly created trip details page
      navigate(`/trip/${id}`);
    } catch (err) {
      // Handle trip creation errors
      console.error(err);
      alert('Failed to create trip');
    }
  };

  /* ───────── Render UI ───────── */
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#1e204e] px-4 py-10">
      {/* Glassmorphism form container */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/5 backdrop-blur rounded-2xl p-8 md:p-10 shadow-lg"
      >
        {/* Form title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          New trip
        </h1>

        {/* City input and start date in responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City input with autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-white mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Write a city"
              className="w-full rounded-lg border border-white/20 bg-white/90 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* Autocomplete suggestions dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1
                 bg-white rounded-xl shadow-lg ring-1 ring-black/5
                 max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 text-gray-900 hover:bg-indigo-100 hover:text-indigo-700
            dark:text-gray-100 cursor-pointer" 
                    onClick={() => pickSuggestion(s)}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Start date input */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/90 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
        </div>

        {/* End date input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-white mb-1">
            End day
          </label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/90 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full md:w-auto mt-8 px-8 py-3 bg-[#FF9091] text-white text-lg font-semibold rounded-lg hover:bg-[#e6818c] transition"
        >
          Start a new trip !
        </button>
      </form>
    </section>
  );
}
