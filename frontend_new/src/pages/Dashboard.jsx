/**
 * @fileoverview Dashboard component - main user interface after authentication
 * This component serves as the central hub for managing user trips, displaying
 * either a first trip creation interface or a list of existing trips.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api                from '../api';
import FirstTripPage      from './FirstTripPage';
import TripsListPage      from './TripsListPage';

/**
 * Dashboard Component
 * 
 * Main dashboard interface that displays user trips. Shows FirstTripPage for new users
 * without trips, or TripsListPage for users with existing trips. Handles trip management
 * operations including creation, deletion, and updates.
 * 
 * @component
 * @returns {JSX.Element} The rendered dashboard with trips management interface
 * 
 * @example
 * // Used as the main authenticated user landing page
 * <Route path="/dashboard" element={<Dashboard />} />
 */
export default function Dashboard() {
  /** @type {[Array<Object>, Function]} Array of user trips */
  const [trips,    setTrips]   = useState([]);
  
  /** @type {[boolean, Function]} Loading state for trips data fetch */
  const [loading,  setLoad]    = useState(true);
  
  /** React Router navigation hook for programmatic navigation */
  const navigate               = useNavigate();

  /**
   * Effect hook to fetch user trips on component mount
   * Loads all trips for the authenticated user and handles loading states
   * 
   * @async
   * @function
   */
  /* ── initial load ──────────────────────── */
  useEffect(() => {
    // Fetch trips from API and update state
    api.get('/trips')
       .then(r => setTrips(r.data)) // Set trips data on success
       .catch(console.error)        // Log any errors
       .finally(() => setLoad(false)); // Always stop loading indicator
  }, []);

  /**
   * Handles trip deletion with user confirmation
   * Shows confirmation dialog and removes trip from both API and local state
   * 
   * @async
   * @function
   * @param {number|string} id - The ID of the trip to delete
   */
  /* ── delete ────────────────────────────── */
  const handleDelete = async id => {
    // Show confirmation dialog before deletion
    if (!window.confirm('Delete this trip?')) return;
    
    try {
      // Delete trip via API
      await api.delete(`/trips/${id}`);
      
      // Remove trip from local state
      setTrips(t => t.filter(tr => tr.id !== id));
    } catch (e) {
      // Handle deletion errors
      console.error(e);
      alert('Failed to delete');
    }
  };

  /**
   * Handles trip updates from child components
   * Updates a specific trip in the local state when modified
   * 
   * @function
   * @param {Object} updated - The updated trip object with new data
   */
  /* ── update dates (отримуємо новий trip із TripsListPage) ─ */
  const handleUpdateTrip = updated => {
    // Update the specific trip in the trips array
    setTrips(list => list.map(t => (t.id === updated.id ? updated : t)));
  };

  /* ── UI ─────────────────────────────────── */
  // Early return patterns for different states
  
  // Show loading indicator while fetching trips
  if (loading) return <p className="p-6">Download...</p>;
  
  // Show first trip creation page for new users with no trips
  if (trips.length === 0)
    return <FirstTripPage onTripCreated={id => navigate(`/trip/${id}`)} />;

  // Main dashboard UI for users with existing trips
  return (
    <div className="max-w-3xl mx-auto px-6 pt-8 relative">
      
      {/* Main dashboard title with custom font and responsive sizing */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'Abril Fatface, cursive', fontSize: '48px' }}>
        {/* Responsive font sizing with inline styles for media queries */}
        <style>{`
          @media (min-width: 768px) {
            h1 {
              font-size: 54px !important;
            }
          }
        `}</style>
        My trips
      </h1>

      {/* Trips list component with all necessary handlers */}
      <TripsListPage
        trips={trips}                           // Array of user trips
        onAddTrip={() => navigate('/first-trip')} // Navigate to trip creation
        onDeleteTrip={handleDelete}             // Handle trip deletion
        onUpdateTrip={handleUpdateTrip}         // Handle trip updates
      />
    </div>
  );
}
