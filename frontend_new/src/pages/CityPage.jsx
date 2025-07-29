/**
 * @fileoverview CityPage component for displaying city information
 * This component fetches and displays Wikipedia information about a specific city
 * including summary text and thumbnail images with navigation sidebar.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

/**
 * CityPage Component
 * 
 * Displays detailed information about a city fetched from Wikipedia API.
 * Features city summary, thumbnail image, and sidebar navigation.
 * Includes error handling for failed API requests.
 * 
 * @component
 * @returns {JSX.Element} The rendered city information page
 * 
 * @example
 * // Used to display city information with navigation
 * <Route path="/city/:city/:country" element={<CityPage />} />
 */
export default function CityPage() {
  /** City and country names extracted from URL parameters */
  const { city, country } = useParams();
  
  /** React Router navigation hook */
  const navigate = useNavigate();
  
  /** @type {[string, Function]} Wikipedia summary text for the city */
  const [summary, setSummary] = useState('');
  
  /** @type {[string, Function]} URL for city thumbnail image from Wikipedia */
  const [imageUrl, setImageUrl] = useState('');
  
  /** @type {[boolean, Function]} Loading state for Wikipedia API request */
  const [loading, setLoading] = useState(true);
  
  /** @type {[string|null, Function]} Error message if API request fails */
  const [error, setError] = useState(null);

  /**
   * Effect hook to fetch city information from Wikipedia
   * Retrieves city summary and thumbnail image using Wikipedia REST API
   * 
   * @async
   * @function
   */
  useEffect(() => {
    /**
     * Fetches city information from Wikipedia API
     * Uses REST API v1 for reliable data access
     * 
     * @async
     * @function
     */
    async function fetchWiki() {
      try {
        // Encode city name for URL safety
        const title = encodeURIComponent(city);
        
        // Fetch from Wikipedia REST API
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
        );
        
        // Handle API errors
        if (!response.ok) throw new Error('Failed to download data from Wikipedia');
        
        const data = await response.json();
        
        // Set summary text (fallback if not available)
        setSummary(data.extract || 'Information is not available');
        
        // Set thumbnail image if available
        if (data.thumbnail?.source) setImageUrl(data.thumbnail.source);
        
      } catch (err) {
        // Handle and display errors
        setError(err.message);
      } finally {
        // Always stop loading indicator
        setLoading(false);
      }
    }
    
    fetchWiki(); // Execute the fetch
  }, [city]); // Re-run when city changes

  return (
    <div className="flex h-screen">
      {/* Navigation Sidebar */}
      <nav className="w-64 bg-gray-100 p-4">  
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-2">
          {/* Dashboard navigation link */}
          <li>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="block w-full text-left"
            >
              Dashboard
            </button>
          </li>
          {/* Additional menu items can be added here */}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Page title with city and country */}
        <h1 className="text-3xl font-bold mb-4">{city}, {country}</h1>

        {/* Loading state */}
        {loading && <p>Download...</p>}
        
        {/* Error state */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Content display when loaded successfully */}
        {!loading && !error && (
          <div>
            {/* City thumbnail image if available */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={`${city} thumbnail`}
                className="mb-4 w-full max-w-md object-cover rounded-lg shadow"
              />
            )}
            
            {/* City summary text from Wikipedia */}
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </main>
    </div>
  );
}
