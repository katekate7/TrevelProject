/**
 * @fileoverview ItemsPage component for trip packing checklists
 * This component provides an interactive checklist for trip items with the ability
 * to check off items and request new items to be added to the master list.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SEO from '../components/SEO/SEO';
import { seoConfig, generateCanonicalUrl } from '../components/SEO/seoConfig';

/**
 * ItemsPage Component
 * 
 * Interactive packing checklist for trip items. Users can check off items as packed
 * and request new items to be added to the master list. Features important item
 * highlighting and modal interface for new item requests.
 * 
 * @component
 * @returns {JSX.Element} The rendered items/checklist page
 * 
 * @example
 * // Used to display packing checklist for a specific trip
 * <Route path="/trip/:id/items" element={<ItemsPage />} />
 */
export default function ItemsPage() {
  /** Trip ID extracted from URL parameters */
  const { id: tripId } = useParams();
  
  /** React Router navigation hook */
  const nav = useNavigate();

  /** @type {[Array<Object>, Function]} Array of trip items with packing status */
  const [items, setItems] = useState([]);
  
  /** @type {[Set<number>, Function]} Set of checked item IDs for O(1) lookup */
  const [checked, setChk] = useState(new Set());
  
  /** @type {[boolean, Function]} Modal visibility state for new item requests */
  const [showReq, setShow] = useState(false);
  
  /** @type {[string, Function]} Name of new item being requested */
  const [reqName, setName] = useState('');
  
  /** @type {[boolean, Function]} Loading state for request submission */
  const [busy, setBusy] = useState(false);

  /**
   * Effect hook to load trip items and their checked status
   * Fetches items from API and initializes checked state from existing data
   * 
   * @async
   * @function
   */
  /* ───────── Load items for trip ───────── */
  useEffect(() => {
    api.get(`/trips/${tripId}/items`)
       .then(r => {
         // Set items array
         setItems(r.data);
         
         // Initialize checked set with already checked items for O(1) lookup performance
         setChk(new Set(r.data.filter(i => i.isChecked).map(i => i.id)));
       })
       .catch(console.error); // Log any loading errors
  }, [tripId]); // Re-run when trip ID changes

  /**
   * Toggles the checked status of an item
   * Updates local state immediately for responsive UI, then syncs with API
   * 
   * @function
   * @param {number} id - Item ID to toggle
   */
  /* ───────── Toggle item packed status ───────── */
  const toggle = id => {
    setChk(s => {
      const nxt = new Set(s); // Create new Set to maintain immutability
      
      // Toggle item in set: remove if present, add if not
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);
      
      // Sync with API (fire-and-forget for responsive UI)
      api.post(`/trips/${tripId}/items/${id}`).catch(console.error);
      
      return nxt;
    });
  };

  /**
   * Sends a request for a new item to be added to the master list
   * Handles form validation, API submission, and user feedback
   * 
   * @async
   * @function
   */
  /* ───────── Send new item request ───────── */
  const sendReq = async () => {
    // Validate input
    if (!reqName.trim()) return;
    
    setBusy(true); // Start loading state
    
    try {
      // Submit request to admin for approval
      await api.post('/item-requests', { name: reqName.trim() });
      
      // Success feedback and cleanup
      alert('The request has been sent!');
      setShow(false); // Close modal
      setName('');    // Clear form
    } catch {
      // Error feedback
      alert('Error sending request');
    } finally { 
      setBusy(false); // Always stop loading
    }
  };

  return (
    <>
      {/* SEO optimization for packing checklist page */}
      <SEO 
        title={seoConfig.checklist.title}
        description={seoConfig.checklist.description}
        keywords={seoConfig.checklist.keywords}
        url={generateCanonicalUrl(`/trip/${tripId}/items`)}
      />
      
      {/* Main checklist container */}
      <div className="p-6 pt-12 md:pt-6 max-w-md mx-auto relative">
        {/* Page title with custom font */}
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>Things for packing</h1>

        {/* Interactive checklist with items */}
        <ul className="space-y-2 list-disc pl-4">
          {items.map(it => (
            <li
              key={it.id}
              className={`flex items-center gap-3
                          ${it.important ? 'text-red-600 font-semibold marker:text-red-600' : ''}`}
            >
              {/* Checkbox with color coding for important items */}
              <input
                type="checkbox"
                className={`h-5 w-5 rounded
                            ${it.important ? 'accent-red-600' : 'accent-blue-600'}`}
                checked={checked.has(it.id)} // O(1) lookup in Set
                onChange={() => toggle(it.id)} // Toggle packed status
              />
              {/* Item name with flexible spacing */}
              <span className="flex-1">{it.name}</span>
            </li>
          ))}
        </ul>

        {/* Button to request new items */}
        <button 
          onClick={() => setShow(true)}
          className="mt-6 px-4 py-2 text-white rounded hover:bg-[#e6818c]"
          style={{ backgroundColor: '#FF9091' }}
        >
          Offer a new item
        </button>

        {/* Modal for new item request */}
        {showReq && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
              {/* Modal header */}
              <h2 className="text-xl font-semibold mb-4 text-black">Offer a new item</h2>
              
              {/* Item name input */}
              <input 
                type="text"
                placeholder="Name of the item"
                className="w-full border px-3 py-2 rounded mb-4"
                value={reqName}
                onChange={e => setName(e.target.value)}
                disabled={busy} // Disable during submission
              />
              
              {/* Modal action buttons */}
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShow(false)}
                  className="px-4 py-2 text-gray-600 hover:underline text-white rounded"
                  disabled={busy}
                >
                  Cancel
                </button>
                <button 
                  onClick={sendReq}
                  className="px-4 py-2 text-white rounded hover:bg-[#e6818c]"
                  style={{ backgroundColor: '#FF9091' }}
                  disabled={busy}
                >
                  {busy ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
