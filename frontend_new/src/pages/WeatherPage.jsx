// src/pages/WeatherPage.jsx
import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import api from '../api';

export default function WeatherPage() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [forecast, setForecast] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get(`/trips/${id}/weather`)
      .then(r => setForecast(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Завантаження погоди…</p>;
  if (!Array.isArray(forecast) || forecast.length === 0) {
    return <p>Прогноз недоступний</p>;
  }

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-100 p-4">…таке саме меню…</nav>
      <main className="flex-1 p-6 overflow-auto">
        <button onClick={()=>nav(-1)} className="mb-4 text-blue-500">← Назад</button>
        <h2 className="text-2xl mb-4">Прогноз погоди</h2>
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
