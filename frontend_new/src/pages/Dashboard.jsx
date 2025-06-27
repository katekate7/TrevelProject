// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import FirstTripPage from './FirstTripPage';
import TripsListPage from './TripsListPage';

export default function Dashboard() {
  const [trips, setTrips]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/trips')
      .then(res => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Видалити цю подорож?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(old => old.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Не вдалося видалити подорож');
    }
  };

  if (loading) return <p>Завантаження…</p>;

  if (trips.length === 0) {
    return (
      <FirstTripPage
        onTripCreated={id => navigate(`/trip/${id}`)}
      />
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Головна панель</h1>
      <TripsListPage
        trips={trips}
        onAddTrip={() => navigate('/first-trip')}
        onDeleteTrip={handleDelete}
      />
    </div>
  );
}
