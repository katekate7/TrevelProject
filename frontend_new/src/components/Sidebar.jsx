/**
 * @fileoverview Sidebar Navigation Component for Travel Planner Application
 * 
 * This component provides the main navigation sidebar for authenticated users.
 * It includes responsive design with a burger menu for mobile devices and
 * provides access to all major trip-related features and pages.
 * 
 * Features:
 * - Responsive design (burger menu on mobile, fixed sidebar on desktop)
 * - Trip-specific navigation (uses trip ID from URL params)
 * - User authentication handling (logout functionality)
 * - Mobile overlay for better UX
 * - Consistent styling with Travel Planner theme
 * 
 * SEO Considerations:
 * - Uses semantic nav element for better accessibility
 * - Includes aria-labels for screen readers
 * - Provides structured navigation for search engines
 * 
 * @author Travel Planner Development Team
 * @version 1.0.0
 */

// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Sidebar Component - Main navigation for authenticated users
 * 
 * Provides a responsive sidebar navigation with trip-specific links and user management.
 * The component adapts to screen size, showing a burger menu on mobile and a fixed
 * sidebar on desktop. Includes logout functionality and trip context awareness.
 * 
 * @component
 * @returns {JSX.Element} Responsive sidebar navigation with trip links and logout
 */
export default function Sidebar() {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract trip ID from URL for trip-specific navigation
  const [open, setOpen] = useState(false); // Mobile menu toggle state

  /**
   * Handles user logout by clearing authentication token and redirecting to start page
   */
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/start');
  };

  // Responsive burger menu
  return (
    <>
      {/* Burger button for mobile screens - hamburger menu icon */}
      <button
        className="fixed top-4 left-4 z-60 flex flex-col justify-center items-center w-10 h-10 bg-gray-200 rounded md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        {/* Animated hamburger icon lines */}
        <span className={`block w-6 h-0.5 bg-black mb-1 transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black mb-1 ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Main sidebar navigation */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 shrink-0 flex flex-col justify-between z-50 transition-transform duration-300 md:static md:translate-x-0 md:flex md:h-full ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ minHeight: '100vh' }}
      >
        <div>
          {/* Sidebar header with Travel Planner branding */}
          <h2 className="text-5xl font-bold mb-8 text-black" style={{ fontFamily: 'Abril Fatface, cursive', fontSize: '48px' }}>Menu</h2>
          
          {/* Navigation menu items - trip-specific links */}
          <ul className="space-y-2">
            <li><button onClick={() => { setOpen(false); navigate('/dashboard'); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Dashboard</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}`); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Information</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/weather`); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Weather</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/sightseeings`); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Sightseeings</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/route`); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Route</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/items`); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Items</button></li>
          </ul>
        </div>
        
        {/* Logout button at bottom of sidebar */}
        <button
          onClick={() => { setOpen(false); handleLogout(); }}
          className="mt-8 w-full py-2 bg-[#FF9091] text-white rounded hover:bg-[#e6818c]"
        >
          Log out
        </button>
      </nav>
      
      {/* Mobile overlay - closes menu when clicked outside */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
