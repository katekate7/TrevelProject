// src/pages/TripRoutePage.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import openrouteservice from 'openrouteservice-js';

export default function TripRoutePage() {
  const { id }      = useParams();
  const nav         = useNavigate();
  const location    = useLocation();
  const wpFromState = location.state?.waypoints ?? [];

  const [waypoints,   setWaypoints]   = useState(wpFromState);
  const [coordinates, setCoordinates] = useState([]);
  const [loading,     setLoading]     = useState(true);

  /* 1️⃣  build route if we already have way-points */
  useEffect(() => {
    if (waypoints.length === 0) return;
    (async () => {
      try {
        const Directions = new openrouteservice.Directions({
          api_key: import.meta.env.VITE_ORS_API_KEY,
        });

        const coords = waypoints.map(p => [p.lng, p.lat]); // ORS uses [lon, lat]
        const result = await Directions.calculate({
          coordinates: coords,
          profile: 'foot-walking',
          format: 'geojson',
        });

        const line = result.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        console.log('Waypoints:', waypoints);
        setCoordinates(line);
      } catch (e) {
        console.error(e);
        alert('Не вдалося побудувати маршрут');
      } finally {
        setLoading(false);
      }
    })();
  }, [waypoints]);

  /* 2️⃣  if user refreshed and we have no state – fallback to DB */
  useEffect(() => {
    if (wpFromState.length > 0) return; // already handled
    (async () => {
      try {
        const res = await api.get(`/trips/${id}/route`);
        const wps = res.data.waypoints;
        console.log('Fetched waypoints:', wps);
        if (!wps || wps.length === 0) throw 0;
        setWaypoints(wps);
      } catch (e) {
        console.error(e);
        alert('Маршрут не знайдено');
        nav(-1);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-6">Завантаження маршруту…</p>;
  if (waypoints.length === 0) return <p className="p-6 text-red-600">Маршрут не знайдено</p>;

  const center = [waypoints[0].lat, waypoints[0].lng];

  return (
    <div className="p-6">
      <button onClick={() => nav(-1)} className="mb-4 text-blue-500">← Назад</button>
      <h1 className="text-2xl font-bold mb-4">Маршрут поїздки</h1>

      <MapContainer center={center} zoom={13} style={{ height: '60vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.length > 0 && <Polyline positions={coordinates} />}
        {waypoints.map((wp, idx) => (
          <Marker position={[wp.lat, wp.lng]} key={idx}>
            <Popup>{wp.title}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="mt-6 prose max-w-none">
        <h2>Коментар до маршруту</h2>
        <p>Тут буде текст з описом маршруту, цікавими фактами або нотатками користувача.</p>
      </div>
    </div>
  );
}
