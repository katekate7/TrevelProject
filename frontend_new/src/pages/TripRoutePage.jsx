// src/pages/TripRoutePage.jsx
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

  const [waypoints,  setWaypoints]  = useState(wpFromState);
  const [coordinates, setCoordinates] = useState([]);
  const [mode,       setMode]       = useState('foot-walking');
  const [loading,    setLoading]    = useState(true);

  /* fetch from DB if no state (page refresh) */
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

  /* build route whenever waypoints OR mode change */
  useEffect(() => {
    if (!waypoints.length) return;

    let canceled = false;          // simple “abort” flag for rapid clicks
    setLoading(true);

    (async () => {
        const ors    = new openrouteservice.Directions({ api_key: import.meta.env.VITE_ORS_API_KEY });
        const coords = waypoints.map(w => [w.lng, w.lat]);
        const base   = { coordinates: coords, profile: mode, format: 'geojson' };

        const tryCalc = p => ors.calculate(p).then(r =>
        r.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
        );

        let line = null;
        try {
        /* 1st attempt (with radiuses for car) */
        const p = mode === 'driving-car'
            ? { ...base, radiuses: coords.map(() => 100) }
            : base;
        line = await tryCalc(p);
        } catch (err) {
        /* fallback – one more try without radiuses (ORS occasionally 404s) */
        try {
            line = await tryCalc(base);
        } catch (err2) {
            console.error(err2);
        }
        }

        if (!canceled) {
        if (line) setCoordinates(line);
        else if (coordinates.length === 0) alert('Не вдалося побудувати маршрут');
        setLoading(false);
        }
    })();

    return () => { canceled = true; }; // abort on unmount / quick toggle
    }, [waypoints, mode]);  

  if (loading)           return <p className="p-6">Завантаження маршруту…</p>;
  if (!waypoints.length) return <p className="p-6 text-red-600">Маршрут не знайдено</p>;

  const center = [waypoints[0].lat, waypoints[0].lng];

  return (
    <div className="p-6 space-y-4">
      <button onClick={() => nav(-1)} className="text-blue-500">← Назад</button>
      <h1 className="text-2xl font-bold">Маршрут поїздки</h1>

      {/* transport mode buttons */}
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

      <MapContainer center={center} zoom={13} style={{ height: '60vh', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.length > 0 && <Polyline positions={coordinates} color="blue" />}
        {waypoints.map((wp, i) => (
          <Marker position={[wp.lat, wp.lng]} key={i}>
            <Popup>{wp.title}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="prose max-w-none">
        <h2>Коментар до маршруту</h2>
        <p>Тут буде текст з описом маршруту, цікавими фактами або нотатками користувача.</p>
      </div>
    </div>
  );
}
