/**
 * @fileoverview SightseeingsPage component for displaying city attractions
 * This component fetches tourist attractions from Wikipedia, shows popularity data,
 * and allows users to select places to visit for route planning.
 */

// src/pages/SightseeingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { saveTripPlaces } from '../api';
import SEO from '../components/SEO/SEO';
import { seoConfig, generateCanonicalUrl } from '../components/SEO/seoConfig';

/**
 * Helper function to format date as YYYYMMDD
 * Used for Wikipedia page views API requests
 * 
 * @function
 * @param {Date} d - Date object to format
 * @returns {string} Formatted date string YYYYMMDD
 */
const fmt = d => d.toISOString().slice(0,10).replace(/-/g, '');

/**
 * SightseeingsPage Component
 * 
 * Displays top tourist attractions for a city fetched from Wikipedia.
 * Features popularity ranking based on page views, image thumbnails,
 * and selection interface for route planning. Integrates multiple APIs:
 * - Wikipedia Category API for attraction lists
 * - Wikipedia REST API for summaries and images
 * - Wikimedia Pageviews API for popularity data
 * 
 * @component
 * @returns {JSX.Element} The rendered sightseeing attractions page
 * 
 * @example
 * // Used to display attractions for trip planning
 * <Route path="/trip/:id/sightseeings" element={<SightseeingsPage />} />
 */
export default function SightseeingsPage() {
  /** Trip ID extracted from URL parameters */
  const { id } = useParams();
  
  /** React Router navigation hook */
  const navigate = useNavigate();

  /** @type {[Object|null, Function]} Trip data containing city information */
  const [trip, setTrip] = useState(null);
  
  /** @type {[Array<Object>, Function]} Array of tourist attractions with details */
  const [places, setPlaces] = useState([]);
  
  /** @type {[Set<string>, Function]} Set of selected attraction titles for O(1) lookup */
  const [selectedTitles, setSelTitles] = useState(new Set());
  
  /** @type {[string, Function]} Current loading phase state machine */
  const [phase, setPhase] = useState('loading');
  // State machine: loading -> loadingWiki -> loadingSaved -> ready -> error

  /**
   * Effect hook 1: Load trip data to get city information
   * Fetches basic trip details needed for Wikipedia API calls
   * 
   * @async
   * @function
   */
  // 1️⃣ Load trip data (for city name)
  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(r => {
        setTrip(r.data);          // Store trip data
        setPhase('loadingWiki');  // Advance to next phase
      })
      .catch(e => {
        console.error(e);
        setPhase('error');        // Set error state on failure
      });
  }, [id]);

  /**
   * Effect hook 2: Load Wikipedia attractions data
   * Complex multi-step process to fetch and enrich attraction data:
   * 1. Get category members from Wikipedia
   * 2. Filter out unwanted pages
   * 3. Fetch detailed info for each attraction
   * 4. Get popularity data from pageviews
   * 5. Sort by popularity and limit to top 20
   * 
   * @async
   * @function
   */
  // 2️⃣ Load Wikipedia attractions data
  useEffect(() => {
    if (phase !== 'loadingWiki' || !trip) return;
    
    (async () => {
      try {
        // Step 1: Fetch tourist attractions category from Wikipedia
        const cat = encodeURIComponent(`Category:Tourist attractions in ${trip.city}`);
        const list = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
          `&list=categorymembers&cmtitle=${cat}&cmtype=page&cmlimit=500`
        ).then(r => r.json());

        // Step 2: Filter out unwanted page types (lists, outlines, etc.)
        const bad = /^(List of|Outline of|Timeline of|Landmarks in|History of)/i;
        const raw = list.query.categorymembers.filter(p => !bad.test(p.title));

        // Step 3: Setup date range for pageview statistics (last 60 days)
        const today = new Date();
        const end = fmt(new Date(today - 1*24*3600*1000));      // Yesterday
        const start = fmt(new Date(today - 60*24*3600*1000));   // 60 days ago

        /**
         * Loads detailed information for a single attraction
         * Fetches summary, image, coordinates, and popularity data
         * 
         * @async
         * @function
         * @param {Object} p - Page object from Wikipedia API
         * @returns {Object|null} Enriched attraction data or null if failed
         */
        const loadOne = async p => {
          try {
            // Fetch page summary and basic info
            const sum = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.title)}`
            ).then(r => r.json());
            
            // Fetch pageview statistics for popularity ranking
            const pv = await fetch(
              `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article` +
              `/en.wikipedia.org/all-access/user/${encodeURIComponent(p.title)}` +
              `/daily/${start}/${end}`
            ).then(r => r.ok ? r.json() : {items: []});

            return {
              id: p.pageid,                                      // Wikipedia page ID
              title: p.title,                                    // Attraction name
              desc: sum.extract || '—',                          // Description
              imageUrl: sum.thumbnail?.source || null,           // Thumbnail image
              lat: sum.coordinates?.lat,                         // Latitude
              lng: sum.coordinates?.lon,                         // Longitude
              views: (pv.items || []).reduce((t,i) => t + (i.views || 0), 0), // Total views
            };
          } catch { 
            return null; // Skip failed requests
          }
        };

        // Step 4: Process all attractions in parallel and filter/sort results
        const all = (await Promise.all(raw.map(loadOne)))
                        .filter(Boolean)                          // Remove failed requests
                        .filter(p => p.lat != null && p.lng != null) // Only places with coordinates
                        .sort((a,b) => b.views - a.views)         // Sort by popularity (views)
                        .slice(0, 20);                           // Top 20 only

        setPlaces(all);                   // Store attractions data
        setPhase('loadingSaved');         // Advance to next phase
      } catch(e) {
        console.error(e);
        setPhase('error');               // Handle errors
      }
    })();
  }, [phase, trip]);

  // 3️⃣ Load already saved places from your API
  useEffect(() => {
    if (phase !== 'loadingSaved') return;
    (async () => {
      try {
        const { data } = await api.get(`/trips/${id}/places`);
        // data = [{ title, lat, lng, id }, ...]
        setSelTitles(new Set(data.map(p => p.title)));
        setPhase('ready');
      } catch (e) {
        console.error('Could not load saved places:', e);
        setPhase('ready'); // все одно ГУІ покаже wiki
      }
    })();
  }, [phase, id]);

  // Toggle by title
  const toggle = title => {
    setSelTitles(s => {
      const n = new Set(s);
      n.has(title) ? n.delete(title) : n.add(title);
      return n;
    });
  };

  // Save & go to route
  const goToRoute = async () => {
    const picked = places.filter(p => selectedTitles.has(p.title));
    if (!picked.length) return;
    // save titles
    await api.patch(`/trips/${id}/sightseeings`, {
      titles: picked.map(p => p.title),
    }).catch(console.error);
    // save table place
    const waypoints = picked.map(p => ({
      title: p.title, lat: p.lat, lng: p.lng
    }));
    await saveTripPlaces(id, waypoints).catch(console.error);
    navigate(`/trip/${id}/route`);
  };

  if (phase === 'loading')        return <p className="p-6">Download...</p>;
  if (phase === 'loadingWiki')    return <p className="p-6">Downloading sights…</p>;
  if (phase === 'loadingSaved')   return <p className="p-6">Downloading marks…</p>;
  if (phase === 'error')          return <p className="p-6 text-red-600">An error occurred</p>;

  return (
    <>
      <SEO 
        title={`Que visiter à ${trip?.city} - ${seoConfig.destinations.title}`}
        description={`Découvrez les meilleurs lieux à visiter à ${trip?.city}. Guide touristique complet avec les attractions incontournables et itinéraires recommandés.`}
        keywords={`que visiter à ${trip?.city}, ${trip?.city} tourisme, attractions ${trip?.city}, ${seoConfig.destinations.keywords}`}
        url={generateCanonicalUrl(`/trip/${id}/sightseeings`)}
      />
      <div className="p-6 pt-12 md:pt-6 max-w-4xl mx-auto relative">
      
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>
        Top 20 must-see in {trip.city}
      </h1>
      <ul className="space-y-6">
        {places.map(p=>(
          <li key={p.id} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 shadow-sm items-center sm:items-start">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 self-start"
              checked={selectedTitles.has(p.title)}
              onChange={()=>toggle(p.title)}
            />
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.title}
                   className="w-40 h-28 object-cover rounded-md" />
            )}
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-1 text-white">{p.title}</h2>
              <p className="text-white">{p.desc}</p>
              <p className="text-xs text-gray-400 mt-1">
                👁 {p.views.toLocaleString()} views / 60 days
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={goToRoute}
        disabled={selectedTitles.size===0}
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        ➜ Build a route
      </button>
    </div>
    </>
  );
}
