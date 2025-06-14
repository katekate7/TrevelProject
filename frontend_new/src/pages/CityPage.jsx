import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function CityPage() {
  const { city, country } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWiki() {
      try {
        const title = encodeURIComponent(city);
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
        );
        if (!response.ok) throw new Error('Не вдалося завантажити дані з Wikipedia');
        const data = await response.json();
        setSummary(data.extract || 'Інформація недоступна');
        if (data.thumbnail?.source) setImageUrl(data.thumbnail.source);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWiki();
  }, [city]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-100 p-4">  
        <h2 className="text-xl font-bold mb-4">Меню</h2>
        <ul className="space-y-2">
          <li><button onClick={() => navigate('/dashboard')} className="block w-full text-left">Dashboard</button></li>
          {/* add more menu items later */}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">← Назад</button>
        <h1 className="text-3xl font-bold mb-4">{city}, {country}</h1>

        {loading && <p>Завантаження...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={`${city} thumbnail`}
                className="mb-4 w-full max-w-md object-cover rounded-lg shadow"
              />
            )}
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </main>
    </div>
);
}
