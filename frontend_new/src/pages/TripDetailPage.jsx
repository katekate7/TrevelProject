import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(res => setTrip(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Завантаження…</p>;
  if (!trip) return <p>Поїздка не знайдена</p>;

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Меню</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={()=>navigate('/dashboard')} className="block w-full text-left">
              Dashboard
            </button>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-auto">
        <button onClick={()=>navigate(-1)} className="mb-4 text-blue-500">← Назад</button>
        <h1 className="text-3xl font-bold mb-4">
          {trip.city}, {trip.country}
        </h1>
        {trip.imageUrl && (
          <img
            src={trip.imageUrl}
            alt={`${trip.city} thumbnail`}
            className="mb-4 w-full max-w-md object-cover rounded-lg shadow"
          />
        )}
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {trip.description}
        </p>
      </main>
    </div>
  );
}
