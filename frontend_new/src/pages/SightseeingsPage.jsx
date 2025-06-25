import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

// Helper – YYYYMMDD
const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, '');

export default function SightseeingsPage() {
  const { id } = useParams();
  const nav    = useNavigate();

  const [trip,     setTrip]     = useState(null);
  const [places,   setPlaces]   = useState([]);
  const [selected, setSel]      = useState(new Set());
  const [phase,    setPhase]    = useState('loading'); // loading | ready | error

  /* 1️⃣  load trip */
  useEffect(() => {
    api.get(`/trips/${id}`)
       .then(r => setTrip(r.data))
       .catch(err => { console.error(err); setPhase('error'); });
  }, [id]);

  /* 2️⃣  load attractions when trip is ready */
  useEffect(() => {
    if (!trip) return;
    (async () => {
      try {
        const cat = encodeURIComponent(`Category:Tourist attractions in ${trip.city}`);
        const list = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
          `&list=categorymembers&cmtitle=${cat}&cmtype=page&cmlimit=500`
        ).then(r => r.json());

        const rawMembers = list?.query?.categorymembers ?? [];
        const bad = /^(List of|Outline of|Timeline of|Landmarks in|History of)/i;
        const candidates = rawMembers.filter(p => !bad.test(p.title));

        /* time window for page-views */
        const today = new Date();
        const end   = fmt(new Date(today - 1 * 24 * 3600 * 1000));
        const start = fmt(new Date(today - 60 * 24 * 3600 * 1000));

        const load = async p => {
          try {
            const sum = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.title)}`
            ).then(r => r.json());

            const pv  = await fetch(
              `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article` +
              `/en.wikipedia.org/all-access/user/${encodeURIComponent(p.title)}` +
              `/daily/${start}/${end}`
            ).then(r => r.ok ? r.json() : { items: [] });

            return {
              id:       p.pageid,
              title:    p.title,
              desc:     sum.extract ?? '—',
              imageUrl: sum.thumbnail?.source ?? null,
              lat:      sum.coordinates?.lat ?? null,
              lng:      sum.coordinates?.lon ?? null,
              views:    pv.items?.reduce((t, i) => t + (i.views || 0), 0),
            };
          } catch { return null; }
        };

        const all = (await Promise.all(candidates.map(load)))
                      .filter(Boolean)
                      .filter(p => p.lat !== null && p.lng !== null);

        all.sort((a, b) => b.views - a.views);
        setPlaces(all.slice(0, 20));
        setPhase('ready');
      } catch (e) {
        console.error(e);
        setPhase('error');
      }
    })();
  }, [trip]);

  /* toggle checkbox */
  const toggle = id => setSel(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  /* save titles + navigate */
  const goToRoute = async () => {
    const picked = places.filter(p => selected.has(p.id));
    if (picked.length === 0) return;

    /* PATCH titles to API */
    try {
      const titles = picked.map(p => p.title);
      await api.patch(`/trips/${id}/sightseeings`, { titles });
    } catch (e) {
      console.error(e);
      // not fatal – keep UX smooth
    }

    /* forward to the map */
    const waypoints = picked.map(({ title, lat, lng }) => ({ title, lat, lng }));
    nav(`/trip/${id}/route`, { state: { waypoints } });
  };

  /* UI */
  if (phase === 'loading') return <p className="p-6">Завантаження пам’яток…</p>;
  if (phase === 'error')   return <p className="p-6 text-red-600">Помилка завантаження даних</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => nav(-1)} className="mb-4 text-blue-500">← Назад</button>
      <h1 className="text-3xl font-bold mb-6">Top 20 «must-see» у&nbsp;{trip.city}</h1>

      <ul className="space-y-6">
        {places.map(p => (
          <li key={p.id} className="border rounded-lg p-4 flex gap-4 shadow-sm">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0"
              checked={selected.has(p.id)}
              onChange={() => toggle(p.id)}
            />
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.title}
                   className="w-40 h-28 object-cover rounded-md shrink-0" />
            )}
            <div>
              <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
              <p className="text-gray-700">{p.desc}</p>
              <p className="text-xs text-gray-400 mt-1">
                👁 {p.views.toLocaleString()} views / 60 днів
              </p>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={goToRoute}
        disabled={selected.size === 0}
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        ➜ Побудувати маршрут
      </button>
    </div>
  );
}
