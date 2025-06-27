// src/pages/TripsListPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TripsListPage({ trips, onAddTrip, onDeleteTrip }) {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Мої подорожі</h2>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {trips.map(trip => (
          <li
            key={trip.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/trip/${trip.id}`)}
            >
              <strong>{trip.country}</strong>, {trip.city}
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                {trip.startDate} — {trip.endDate}
              </div>
            </div>
            <button
              onClick={() => onDeleteTrip(trip.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#c00',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
              title="Видалити"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onAddTrip} style={{ marginTop: '1rem' }}>
        Нова подорож
      </button>
    </div>
  );
}
