// src/pages/FirstTripPage.jsx
import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function FirstTripPage() {
  const navigate = useNavigate();

  const [country, setCountry] = useState('');
  const [city, setCity]     = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchCities = debounce(async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await api.get(`/cities?q=${encodeURIComponent(query)}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error('Помилка під час отримання міст:', err);
    }
  }, 300);

  const handleCityChange = e => {
    const v = e.target.value;
    setCity(v);
    fetchCities(v);
  };

  const handleSelectSuggestion = s => {
    setCity(s.city);
    setCountry(s.country);
    setSuggestions([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Відправляємо і отримуємо { id: number }
      const response = await api.post('/trips/add', {
        country,
        city,
        startDate,
        endDate,
      });
      const tripId = response.data.id;
      // Перехід на сторінку деталей поїздки
      navigate(`/trip/${encodeURIComponent(tripId)}`);
    } catch (err) {
      console.error(err);
      alert('Не вдалося створити поїздку');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Нова подорож</h2>

      <label>Місто:</label>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Введіть місто"
        required
      />
      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', listStyle: 'none', padding: 0 }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              style={{ padding: '0.5rem', cursor: 'pointer' }}
              onClick={() => handleSelectSuggestion(s)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}

      <label>Дата початку:</label>
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        required
      />

      <label>Дата завершення:</label>
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        required
      />

      <button type="submit" style={{ marginTop: '1rem' }}>Почати подорож</button>
    </form>
  );
}
