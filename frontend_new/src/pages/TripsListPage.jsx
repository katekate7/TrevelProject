import React, { useState } from 'react';
import { useNavigate }   from 'react-router-dom';
import api               from '../api';

/**
 * props:
 *   trips         — масив поїздок
 *   onAddTrip     — клік «Нова подорож»
 *   onDeleteTrip  — (id) => void
 *   onUpdateTrip  — (updatedTrip) => void
 */
export default function TripsListPage({
  trips        = [],
  onAddTrip    = () => {},
  onDeleteTrip = () => {},
  onUpdateTrip = () => {},
}) {
  const navigate = useNavigate();
  const [editingId, setEdit]   = useState(null);
  const [tmpStart,  setStart]  = useState('');
  const [tmpEnd,    setEnd]    = useState('');
  const [busy,      setBusy]   = useState(false);

  /* ── start editing one trip ─────────── */
  const beginEdit = t => {
    setEdit(t.id);
    setStart(t.startDate);
    setEnd(t.endDate);
  };

  /* ── cancel ─────────────────────────── */
  const cancel = () => {
    setEdit(null);
    setStart('');
    setEnd('');
  };

  /* ── save ───────────────────────────── */
  const save = async id => {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await api.patch(`/trips/${id}`, {
        startDate: tmpStart,
        endDate  : tmpEnd,
      });                            // ← повертає оновлений trip
      await api.patch(`/trips/${id}/weather/update`);
      onUpdateTrip(data);
      cancel();
    } catch (e) {
      console.error(e);
      alert('Could not save trip dates');
    } finally { setBusy(false); }
  };

  /* ── UI ─────────────────────────────── */
  return (
    <div>
      <ul className="space-y-8">
        {trips.map(trip => (
          <li key={trip.id} className="border-b border-white/30 pb-6">
            {/* ---------------- normal view ---------------- */}
            {editingId !== trip.id && (
              <div className="flex items-start justify-between gap-4">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/trip/${trip.id}`)}
                >
                  <p className="text-lg text-white">
                    <span className="font-semibold">{trip.country}</span>, {trip.city}
                  </p>
                  <p className="text-sm text-gray-400">
                    {trip.startDate} — {trip.endDate}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => beginEdit(trip)}
                    className="text-[#FF9091] hover:text-[#e6818c]"
                    title="Редагувати дати"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="text-red-600 hover:text-red-400"
                    title="Видалити"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- edit mode ---------------- */}
            {editingId === trip.id && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white">Starting</label>
                    <input
                      type="date"
                      value={tmpStart}
                      onChange={e => setStart(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white">Finishing</label>
                    <input
                      type="date"
                      value={tmpEnd}
                      onChange={e => setEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => save(trip.id)}
                    disabled={busy}
                    className="px-4 py-2 bg-[#FF9091] text-white rounded hover:bg-[#e6818c] disabled:opacity-50"
                  >
                    {busy ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={cancel}
                    className="px-4 py-2 text-gray-300 hover:text-white"
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* -------- NEW TRIP BUTTON -------- */}
      <button
        onClick={onAddTrip}
        className="mt-8 px-6 py-3 bg-[#FF9091] text-white rounded-lg hover:bg-[#e6818c]"
      >
        New trip
      </button>
    </div>
  );
}
