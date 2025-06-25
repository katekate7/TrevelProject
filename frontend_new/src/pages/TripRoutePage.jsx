import React, { useEffect, useState } from 'react';
import {
  MapContainer, TileLayer, Polyline, Marker, Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import openrouteservice from 'openrouteservice-js';
import api from '../api';

const MODES = [
  { id: 'driving-car',  label: '🚗', title: 'Car' },
  { id: 'foot-walking', label: '🚶', title: 'Walk' },
  { id: 'cycling-regular', label: '🚲', title: 'Bike' },
];

export default function TripRoutePage() {
  const { id }      = useParams();
  const nav         = useNavigate();
  const location    = useLocation();
  const wpFromState = location.state?.waypoints ?? [];

  /* waypoints / map */
  const [waypoints,  setWaypoints]  = useState(wpFromState);
  const [coordinates, setCoordinates] = useState([]);
  const [mode,       setMode]       = useState('foot-walking');
  const [loading,    setLoading]    = useState(true);

  /* items list */
  const [items,      setItems]      = useState([]);
  const [packed,     setPacked]     = useState(new Set());

  /* ─── fetch waypoints from DB after refresh ─────────────────────────── */
  useEffect(() => {
    if (wpFromState.length) return;
    (async () => {
      try {
        const { data } = await api.get(`/trips/${id}/route`);
        if (!data.waypoints?.length) throw 0;
        setWaypoints(data.waypoints);
      } catch {
        alert('Маршрут не знайдено');
        nav(-1);
      }
    })();
  }, [id]);

  /* ─── fetch items once ──────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/items'); // ordered DESC by controller
        setItems(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* ─── build route whenever waypoints or mode change ─────────────────── */
  useEffect(() => {
    if (!waypoints.length) return;

    let canceled = false;
    setLoading(true);

    (async () => {
      const ors    = new openrouteservice.Directions({ api_key: import.meta.env.VITE_ORS_API_KEY });
      const coords = waypoints.map(w => [w.lng, w.lat]);
      const base   = { coordinates: coords, profile: mode, format: 'geojson' };
      const tryCalc = p =>
        ors.calculate(p).then(r =>
          r.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
        );

      let line = null;
      try {
        const first = mode === 'driving-car'
          ? { ...base, radiuses: coords.map(() => 100) }
          : base;
        line = await tryCalc(first);
      } catch {
        try { line = await tryCalc(base); } catch {}
      }

      if (!canceled) {
        if (line) setCoordinates(line);
        else if (!coordinates.length) alert('Не вдалося побудувати маршрут');
        setLoading(false);
      }
    })();

    return () => { canceled = true; };
  }, [waypoints, mode]);

  /* ─── UI skeleton ──────────────────────────────────────────────────── */
  if (loading)           return <p className="p-6">Завантаження маршруту…</p>;
  if (!waypoints.length) return <p className="p-6 text-red-600">Маршрут не знайдено</p>;

  const center = [waypoints[0].lat, waypoints[0].lng];

  return (
    <div className="p-6 space-y-4">
      <button onClick={() => nav(-1)} className="text-blue-500">← Назад</button>
      <h1 className="text-2xl font-bold">Маршрут поїздки</h1>

      {/* transport buttons */}
      <div className="flex gap-2">
        {MODES.map(m => (
          <button
            key={m.id}
            title={m.title}
            className={`px-3 py-1 border rounded
                        ${mode === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}
                        hover:bg-gray-200`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* map */}
      <MapContainer center={center} zoom={13} style={{ height: '60vh', width: '100%' }}>
        <TileLayer attribution="&copy; OpenStreetMap"
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {coordinates.length > 0 && <Polyline positions={coordinates} color="blue" />}
        {waypoints.map((wp, i) => (
          <Marker position={[wp.lat, wp.lng]} key={i}>
            <Popup>{wp.title}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* comment placeholder */}
      <div className="prose max-w-none">
        <h2>Коментар до маршруту</h2>
        <p>Тут буде текст з описом маршруту, цікавими фактами або нотатками користувача.</p>
      </div>

      {/* packing list */}
      <div className="prose max-w-none">
        <h2>Перелік речей</h2>

        <ul className="space-y-2">
          {items.map(it => (
            <li key={it.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0"
                checked={packed.has(it.id)}
                onChange={() =>
                  setPacked(s => {
                    const n = new Set(s);
                    n.has(it.id) ? n.delete(it.id) : n.add(it.id);
                    return n;
                  })
                }
              />
              <span className="flex-1">{it.name}</span>
              <span className="text-xs text-gray-500">-lvl&nbsp;{it.importanceLevel}</span>
            </li>
          ))}
        </ul>

        <button
          className="mt-4 px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600"
          onClick={() => alert('TODO: implement new-item request flow')}
        >
          Request New Item
        </button>
      </div>
    </div>
  );
}
