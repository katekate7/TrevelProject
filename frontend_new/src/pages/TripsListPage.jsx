// src/pages/TripsListPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TripsListPage({ trips, onAddTrip }) {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Мої подорожі</h2>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {trips.map(trip => (
          <li
            key={trip.id}
            style={{
              cursor: 'pointer',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            <strong>{trip.country}</strong>, {trip.city}
            <div style={{ fontSize: '0.9rem', color: '#555' }}>
              {trip.startDate} — {trip.endDate}
            </div>
          </li>
        ))}
      </ul>
      <button onClick={onAddTrip} style={{ marginTop: '1rem' }}>
        Нова подорож
      </button>
    </div>
  );
}
