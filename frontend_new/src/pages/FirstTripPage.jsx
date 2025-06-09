import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import countries from 'i18n-iso-countries';
import enLocale  from 'i18n-iso-countries/langs/en.json';

// Реєструємо англійську локаль (назви країн англійською)
countries.registerLocale(enLocale);

export default function FirstTripPage() {
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [city,    setCity]    = useState('');

  // Підготовка списку країн лише раз
  const countryOptions = useMemo(() => {
    return Object.entries(
      countries.getNames('en', { select: 'official' })
    ).map(([code, name]) => ({ code, name }));
  }, []);

  const handleSubmit = async e => {
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

      <label>Країна:</label>
      <select value={country} onChange={e => setCountry(e.target.value)} required>
        <option value="">— оберіть країну —</option>
        {countryOptions.map(c => (
          <option key={c.code} value={c.name}>{c.name}</option>
        ))}
      </select>

      <label>Місто:</label>
      <input
        type="text"
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Введіть місто"
        required
      />

      <button type="submit">Почати подорож</button>
    </form>
  );
}
