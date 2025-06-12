// CitySelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function CitySelector() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState({ city: '', country: '' });
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=5`,
          {
            headers: {
              'X-RapidAPI-Key': 'ВАШ_RAPIDAPI_KEY',
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
          }
        );
        const { data } = await res.json();
        // приводимо до вигляду [{ city, country }]
        setSuggestions(
          data.map(c => ({
            city: c.name,
            country: c.country
          }))
        );
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = item => {
    setSelected(item);
    setQuery(`${item.city}, ${item.country}`);
    setSuggestions([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selected.city) {
      alert('Оберіть із випадаючого списку місто');
      return;
    }
    try {
      // тут вже є токен в api.js
      await api.post('/trips/add', {
        city: selected.city,
        country: selected.country
      });
      // після успіху переходимо
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('❌', err);
      alert('Не вдалося створити поїздку');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Введіть місто</h2>
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setSelected({ city: '', country: '' });
        }}
        placeholder="Наприклад, Paris"
        autoComplete="off"
        required
      />
      {suggestions.length > 0 && (
        <ul style={{
          border: '1px solid #ccc',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          maxHeight: 150,
          overflowY: 'auto'
        }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              style={{ padding: '0.5rem', cursor: 'pointer' }}
              onClick={() => handleSelect(s)}
            >
              {s.city}, {s.country}
            </li>
          ))}
        </ul>
      )}
      <button type="submit" style={{ marginTop: '1rem' }}>
        Додати поїздку
      </button>
    </form>
  );
}
