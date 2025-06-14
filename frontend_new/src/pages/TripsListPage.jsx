import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function TripsListPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    api.get('/trips')
      .then(res => setTrips(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Мої подорожі</h2>
      <ul>
        {trips.map(trip => (
          <li 
            key={trip.id} 
            style={{ cursor: 'pointer', padding: '0.5rem 0' }}
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            <strong>{trip.country}</strong>, {trip.city}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/first-trip')}>
        Нова подорож
      </button>
    </div>
  );
}
