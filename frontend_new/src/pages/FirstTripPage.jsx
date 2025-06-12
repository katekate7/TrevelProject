// FirstTripPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import axios from 'axios';

countries.registerLocale(enLocale);

export default function FirstTripPage() {
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [citiesList, setCitiesList] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Готуємо список країн один раз
  const countryOptions = useMemo(() => {
    return Object.entries(
      countries.getNames('en', { select: 'official' })
    ).map(([code, name]) => ({ code, name }));
  }, []);

  // При зміні країни підвантажуємо список міст через публічне API
  useEffect(() => {
    if (!country) {
      setCitiesList([]);
      return;
    }
    setLoadingCities(true);
    axios
      .post('https://countriesnow.space/api/v0.1/countries/cities', { country })
      .then(res => {
        if (res.data.error) throw new Error(res.data.msg);
        setCitiesList(res.data.data.sort());
      })
      .catch(err => {
        console.error('❌ Не вдалося завантажити міста:', err);
        setCitiesList([]);
      })
      .finally(() => {
        setLoadingCities(false);
      });
  }, [country]);

  const handleSubmit = async e => {
    e.preventDefault();
    // — тут поки відсікаємо локальний POST /trips/add (401), 
    // — щоб не зупиняти UI, просто консоль:
    console.log('Створюємо поїздку:', { country, city });
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Куди ви хочете поїхати цього разу?</h2>

      <label>Країна:</label>
      <select
        value={country}
        onChange={e => {
          setCountry(e.target.value);
          setCity('');         // очищуємо вибране місто при зміні країни
        }}
        required
      >
        <option value="">— оберіть країну —</option>
        {countryOptions.map(c => (
          <option key={c.code} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <label>Місто:</label>
      {loadingCities ? (
        <p>Завантажуємо список міст…</p>
      ) : citiesList.length > 0 ? (
        // якщо є citiesList, показуємо select
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        >
          <option value="">— оберіть місто —</option>
          {citiesList.map((ct, i) => (
            <option key={i} value={ct}>
              {ct}
            </option>
          ))}
        </select>
      ) : (
        // якщо міст не підвантажилось або країни не обрали — вільний ввод
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Введіть назву міста"
          required
          list="city-suggestions"
        />
      )}
      {/* Підказки (якщо список міст порожній, можна підвантажити довільний частковий список) */}
      {citiesList.length === 0 && (
        <datalist id="city-suggestions">
          {/* тут можна на майбутнє підсипати популярні міста країни */}
        </datalist>
      )}

      <button type="submit" style={{ marginTop: '1rem' }}>
        ➕ Почати подорож
      </button>
    </form>
  );
}
