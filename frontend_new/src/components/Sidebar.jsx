// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/start');
  };

  // Responsive burger menu
  return (
    <>
      {/* Burger button for small screens */}
      <button
        className="fixed top-4 left-4 z-30 flex flex-col justify-center items-center w-10 h-10 bg-gray-200 rounded md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        <span className={`block w-6 h-0.5 bg-black mb-1 transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black mb-1 ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 shrink-0 flex flex-col justify-between z-20 transition-transform duration-300 md:static md:translate-x-0 md:flex md:h-full ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ minHeight: '100vh' }}
      >
        <div>
          <h2 className="text-5xl font-bold mb-8 text-black" style={{ fontFamily: 'Abril Fatface, cursive', fontSize: '48px' }}>Menu</h2>
          <ul className="space-y-2">
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}`); }}          className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Main</button></li>
            <li><button onClick={() => { setOpen(false); navigate('/dashboard'); }}          className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Dashboard</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/weather`); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Weather</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/sightseeings`); }} className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Sightseeings</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/route`); }}   className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Route</button></li>
            <li><button onClick={() => { setOpen(false); navigate(`/trip/${id}/items`); }}   className="block w-full text-left py-2 px-3 rounded bg-[#FF9091] text-white hover:bg-[#e6818c]">Items</button></li>
          </ul>
        </div>
        <button
          onClick={() => { setOpen(false); handleLogout(); }}
          className="mt-8 w-full py-2 bg-[#FF9091] text-white rounded hover:bg-[#e6818c]"
        >
          Log out
        </button>
      </nav>
      {/* Overlay for closing menu on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
