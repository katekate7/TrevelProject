import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function FirstTripPage() {
  const navigate = useNavigate();

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchCities = debounce(async (query) => {
    if (!query) return setSuggestions([]);

    try {
      const response = await api.get(`/cities?q=${encodeURIComponent(query)}`);
      setSuggestions(response.data);
    } catch (err) {
      console.error('Помилка під час отримання міст:', err);
    }
  }, 300);

  // ...


  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchCities(value);
  };

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion.city);
    setCountry(suggestion.country);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trips/add', { country, city });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Не вдалося створити поїздку');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Куди ви хочете поїхати цього разу?</h2>

      <label>Місто:</label>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Введіть місто"
        required
      />

      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', padding: 0, listStyle: 'none' }}>
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

      <input type="hidden" value={country} />

      <button type="submit">Почати подорож</button>
    </form>
  );
}
