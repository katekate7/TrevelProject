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
    if (!window.confirm('Видалити цю подорож?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(t => t.filter(tr => tr.id !== id));
    } catch (e) {
      console.error(e);
      alert('Не вдалося видалити');
    }
  };

  /* ── update dates (отримуємо новий trip із TripsListPage) ─ */
  const handleUpdateTrip = updated => {
    setTrips(list => list.map(t => (t.id === updated.id ? updated : t)));
  };

  /* ── UI ─────────────────────────────────── */
  if (loading)         return <p className="p-6">Завантаження…</p>;
  if (trips.length===0)
    return <FirstTripPage onTripCreated={id => navigate(`/trip/${id}`)} />;

  return (
    <div className="max-w-3xl mx-auto px-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-white">
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
