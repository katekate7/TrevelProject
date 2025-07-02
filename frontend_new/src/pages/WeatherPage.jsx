// src/pages/WeatherPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function WeatherPage() {
  const { id } = useParams();
  const nav    = useNavigate();

  const [forecast, setForecast] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(false);

  // ── завантаження прогнозу ───────────────────────
  const loadForecast = () => {
    setLoading(true);
    api.get(`/trips/${id}/weather`)
      .then(r => setForecast(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // ── оновити прогноз і одразу перезавантажити ───
  const updateForecast = () => {
    setUpdating(true);
    api.patch(`/trips/${id}/weather/update`)
      .then(() => loadForecast())
      .catch(console.error)
      .finally(() => setUpdating(false));
  };

  useEffect(loadForecast, [id]);

  if (loading) return <p>Завантаження погоди…</p>;

  if (!Array.isArray(forecast) || forecast.length === 0) {
    return (
      <div className="p-4">
        <button onClick={() => nav(-1)} className="text-blue-500 mb-4">← Назад</button>
        <p className="text-gray-600">Прогноз наразі недоступний. Спробуйте оновити пізніше.</p>
        <button
          onClick={updateForecast}
          disabled={updating}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {updating ? 'Оновлення…' : 'Спробувати оновити ще раз'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 overflow-auto">
        <button onClick={() => nav(-1)} className="mb-4 text-blue-500">
          ← Назад
        </button>

        <h2 className="text-2xl mb-2">Прогноз погоди</h2>

        <button
          onClick={updateForecast}
          disabled={updating}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {updating ? 'Оновлення…' : 'Оновити прогноз'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecast.map(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString();
            return (
              <div key={day.dt} className="p-4 border rounded-lg">
                <h3 className="font-bold">{date}</h3>
                <p>День: {day.temp.day}°C, Ніч: {day.temp.night}°C</p>
                <p>{day.weather[0].description}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
