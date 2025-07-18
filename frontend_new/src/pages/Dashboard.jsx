import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api                from '../api';
import FirstTripPage      from './FirstTripPage';
import TripsListPage      from './TripsListPage';

export default function Dashboard() {
  const [trips,    setTrips]   = useState([]);
  const [loading,  setLoad]    = useState(true);
  const navigate               = useNavigate();

  /* ── initial load ──────────────────────── */
  useEffect(() => {
    api.get('/trips')
       .then(r => setTrips(r.data))
       .catch(console.error)
       .finally(() => setLoad(false));
  }, []);

  /* ── delete ────────────────────────────── */
  const handleDelete = async id => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(t => t.filter(tr => tr.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  };

  /* ── update dates (отримуємо новий trip із TripsListPage) ─ */
  const handleUpdateTrip = updated => {
    setTrips(list => list.map(t => (t.id === updated.id ? updated : t)));
  };

  /* ── UI ─────────────────────────────────── */
  if (loading)         return <p className="p-6">Download...</p>;
  if (trips.length===0)
    return <FirstTripPage onTripCreated={id => navigate(`/trip/${id}`)} />;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-8 relative">
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'Abril Fatface, cursive', fontSize: '48px' }}>
        <style>{`
          @media (min-width: 768px) {
            h1 {
              font-size: 54px !important;
            }
          }
        `}</style>
        My trips
      </h1>

      <TripsListPage
        trips={trips}
        onAddTrip={() => navigate('/first-trip')}
        onDeleteTrip={handleDelete}
        onUpdateTrip={handleUpdateTrip}   /* ← новий */
      />
    </div>
  );
}
