import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

// Helper – YYYYMMDD
const fmt = d =>
  d.toISOString().slice(0, 10).replace(/-/g, '');

export default function SightseeingsPage() {
  const { id }  = useParams();
  const nav     = useNavigate();

  const [trip,     setTrip]     = useState(null);
  const [places,   setPlaces]   = useState([]);
  const [selected, setSel]      = useState(new Set());
  const [phase,    setPhase]    = useState('loading'); // loading | ready | error | saving

  /* 1️⃣  get trip -> we know city */
  useEffect(() => {
    api.get(`/trips/${id}`)
       .then(r => setTrip(r.data))
       .catch(err => { console.error(err); setPhase('error'); });
  }, [id]);

  /* 2️⃣  once city is known -> load attractions */
  useEffect(() => {
    if (!trip) return;

    (async () => {
      try {
        const city = trip.city;
        const cat  = encodeURIComponent(`Category:Tourist attractions in ${city}`);

        /* 2.a pull up to 500 pages in that category */
        const listRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
          `&list=categorymembers&cmtitle=${cat}&cmtype=page&cmlimit=500`
        );
        const members = (await listRes.json())?.query?.categorymembers ?? [];

        /* 2.b filter out non-attraction pages (lists, outlines, timelines ...) */
        const bad = /^(List of|Outline of|Timeline of|Landmarks in|History of)/i;
        const candidates = members.filter(p => !bad.test(p.title));

        /* 2.c for each candidate get 60-day page-view sum + summary */
        const today   = new Date();
        const end     = fmt(new Date(today.getTime() - 24 * 3600 * 1000)); // yesterday
        const start   = fmt(new Date(today.getTime() - 60 * 24 * 3600 * 1000));

        const loadOne = async p => {
          try {
            // summary
            const sumResp = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.title)}`
            );
            if (!sumResp.ok) throw 0;
            const sum = await sumResp.json();

            // page-views
            const pvResp = await fetch(
              `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article` +
              `/en.wikipedia.org/all-access/user/${encodeURIComponent(p.title)}` +
              `/daily/${start}/${end}`
            );
            const pvs = pvResp.ok ? await pvResp.json() : { items: [] };
            const views = pvs.items?.reduce((t, i) => t + (i.views || 0), 0);

            return {
              id:        p.pageid,
              title:     p.title,
              desc:      sum.extract ?? '—',
              imageUrl:  sum.thumbnail?.source ?? null,
              views,
            };
          } catch (_) {
            return null;
          }
        };

        const all = (await Promise.all(candidates.map(loadOne))).filter(Boolean);

        /* 2.d sort by views, take top-20 */
        all.sort((a, b) => b.views - a.views);
        setPlaces(all.slice(0, 20));
        setPhase('ready');
      } catch (e) {
        console.error(e);
        setPhase('error');
      }
    })();
  }, [trip]);

  /* 3️⃣  checkbox toggle */
  const toggle = id => setSel(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  /* 4️⃣  save route */
  const save = async () => {
    if (selected.size === 0) return;
    setPhase('saving');
    try {
      const { data } = await api.post(
        `/trips/${id}/route-from-sightseeings`,
        { sightseeingIds: Array.from(selected) }
      );
      nav(`/trip/${id}/route/${data.routeId}`);
    } catch (err) {
      console.error(err);
      alert('Не вдалося створити маршрут');
      setPhase('ready');
    }
  };

  /* 5️⃣  UI */
  if (phase === 'loading') return <p className="p-6">Завантаження пам’яток…</p>;
  if (phase === 'error')   return <p className="p-6 text-red-600">Помилка завантаження даних</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => nav(-1)} className="mb-4 text-blue-500">← Назад</button>
      <h1 className="text-3xl font-bold mb-6">Top 20 «must-see» у {trip.city}</h1>

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
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-40 h-28 object-cover rounded-md shrink-0"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
              <p className="text-gray-700">{p.desc}</p>
              <p className="text-xs text-gray-400 mt-1">👁 {p.views.toLocaleString()} views/60d</p>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={save}
        disabled={phase === 'saving' || selected.size === 0}
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {phase === 'saving' ? 'Збереження…' : 'To Route'}
      </button>
    </div>
  );
}
