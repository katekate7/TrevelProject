// src/pages/FirstTripPage.jsx
import React, { useState } from 'react';
import debounce          from 'lodash.debounce';
import { useNavigate }    from 'react-router-dom';
import api                from '../api';

export default function FirstTripPage() {
  const navigate = useNavigate();

  /* ───────── state ───────── */
  const [country,      setCountry]   = useState('');
  const [city,         setCity]      = useState('');
  const [startDate,    setStartDate] = useState('');
  const [endDate,      setEndDate]   = useState('');
  const [suggestions,  setSug]       = useState([]);

  /* ───────── live-search міст ───────── */
  const fetchCities = debounce(async q => {
    if (!q) return setSug([]);
    try {
      const { data } = await api.get(`/cities?q=${encodeURIComponent(q)}`);
      setSug(data);
    } catch (e) {
      console.error('Помилка міст:', e);
    }
  }, 300);

  const handleCityChange = e => {
    const v = e.target.value;
    setCity(v);
    fetchCities(v);
  };

  const pickSuggestion = s => {
    setCity(s.city);
    setCountry(s.country);
    setSug([]);
  };

  /* ───────── submit ───────── */
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/trips/add', {
        country, city, startDate, endDate,
      });
      const id = data.id;
      await api.patch(`/trips/${id}/weather/update`);
      navigate(`/trip/${id}`);
    } catch (err) {
      console.error(err);
      alert('Не вдалося створити поїздку');
    }
  };

  /* ───────── JSX ───────── */
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#1e204e] px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/5 backdrop-blur rounded-2xl p-8 md:p-10 shadow-lg"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          New trip
        </h1>

        {/* city + start */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-white mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Write a city"
              className="w-full rounded-lg border border-white/20 bg-white/90 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1
                 bg-white rounded-xl shadow-lg ring-1 ring-black/5
                 max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 text-gray-900 hover:bg-indigo-100 hover:text-indigo-700
+            dark:text-gray-100" 
                    onClick={() => pickSuggestion(s)}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/90 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
        </div>

        {/* end date */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-white mb-1">
            End day
          </label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/90 text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* submit */}
        <button
          type="submit"
          className="w-full md:w-auto mt-8 px-8 py-3 bg-[#FF9091] text-white text-lg font-semibold rounded-lg hover:bg-[#e6818c] transition"
        >
          Start a new trip !
        </button>
      </form>
    </section>
  );
}
