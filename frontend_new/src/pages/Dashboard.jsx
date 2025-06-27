// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TripsListPage from './TripsListPage';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/trips')
      .then(res => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Завантаження…</p>;

  // Якщо є хоча б одна поїздка — показуємо список
  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Мої подорожі</h1>
      <TripsListPage
        trips={trips}
        onAddTrip={() => navigate('/first-trip')}
      />
    </div>
  );
}
