import React, { useEffect, useState } from 'react';
import api from '../api';
import FirstTripPage from './FirstTripPage';
import TripsListPage from './TripsListPage';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trips')
      .then(res => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Завантаження…</p>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Головна панель</h1>
      {trips.length === 0 ? (
        <FirstTripPage />
      ) : (
        <TripsListPage trips={trips} />
      )}
    </div>
  );
}
