// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const { id }   = useParams();          // поточна trip-id з URL

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/start');
  };

  return (
    <nav className="w-64 bg-gray-100 p-4 shrink-0 flex flex-col h-full justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Меню</h2>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/dashboard')}          className="block w-full text-left">Dashboard</button></li>
          <li><button onClick={() => navigate(`/trip/${id}/weather`)} className="block w-full text-left">Погода</button></li>
          <li><button onClick={() => navigate(`/trip/${id}/sightseeings`)} className="block w-full text-left">Sightseeings</button></li>
          <li><button onClick={() => navigate(`/trip/${id}/route`)}   className="block w-full text-left">Маршрут</button></li>
          <li><button onClick={() => navigate(`/trip/${id}/items`)}   className="block w-full text-left">Речі</button></li>
        </ul>
      </div>
      <button
        onClick={handleLogout}
        className="mt-8 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log out
      </button>
    </nav>
  );
}
