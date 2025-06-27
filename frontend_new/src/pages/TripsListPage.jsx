// src/pages/TripsListPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TripsListPage({ trips, onAddTrip }) {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
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
      <button onClick={onAddTrip}>Нова подорож</button>
    </div>
  );
}
