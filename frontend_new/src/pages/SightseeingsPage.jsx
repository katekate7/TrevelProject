// SightseeingsPage - displays city attractions from Wikipedia
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { saveTripPlaces } from '../api';
import SEO from '../components/SEO/SEO';
import { seoConfig, generateCanonicalUrl } from '../components/SEO/seoConfig';

const fmt = d => d.toISOString().slice(0,10).replace(/-/g, '');

export default function SightseeingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedTitles, setSelTitles] = useState(new Set());
  const [phase, setPhase] = useState('loading');

  // Load trip data
  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(r => {
        setTrip(r.data);
        setPhase('loadingWiki');
      })
      .catch(e => {
        console.error(e);
        setPhase('error');
      });
  }, [id]);

  // Load Wikipedia attractions data
  useEffect(() => {
    if (phase !== 'loadingWiki' || !trip) return;
    
    (async () => {
      try {
        const cat = encodeURIComponent(`Category:Tourist attractions in ${trip.city}`);
        const list = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
          `&list=categorymembers&cmtitle=${cat}&cmtype=page&cmlimit=500`
        ).then(r => r.json());

        const bad = /^(List of|Outline of|Timeline of|Landmarks in|History of)/i;
        const raw = list.query.categorymembers.filter(p => !bad.test(p.title));

        const today = new Date();
        const end = fmt(new Date(today - 1*24*3600*1000));
        const start = fmt(new Date(today - 60*24*3600*1000));

        const loadOne = async p => {
          try {
            const sum = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.title)}`
            ).then(r => r.json());
            
            const pv = await fetch(
              `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article` +
              `/en.wikipedia.org/all-access/user/${encodeURIComponent(p.title)}` +
              `/daily/${start}/${end}`
            ).then(r => r.ok ? r.json() : {items: []});

            return {
              id: p.pageid,
              title: p.title,
              desc: sum.extract || '—',
              imageUrl: sum.thumbnail?.source || null,
              lat: sum.coordinates?.lat,
              lng: sum.coordinates?.lon,
              views: (pv.items || []).reduce((t,i) => t + (i.views || 0), 0),
            };
          } catch { 
            return null;
          }
        };

        const all = (await Promise.all(raw.map(loadOne)))
                        .filter(Boolean)
                        .filter(p => p.lat != null && p.lng != null)
                        .sort((a,b) => b.views - a.views)
                        .slice(0, 20);

        setPlaces(all);
        setPhase('loadingSaved');
      } catch(e) {
        console.error(e);
        setPhase('error');
      }
    })();
  }, [phase, trip]);

  // Load saved places
  useEffect(() => {
    if (phase !== 'loadingSaved') return;
    (async () => {
      try {
        const { data } = await api.get(`/trips/${id}/places`);
        setSelTitles(new Set(data.map(p => p.title)));
        setPhase('ready');
      } catch (e) {
        console.error('Could not load saved places:', e);
        setPhase('ready');
      }
    })();
  }, [phase, id]);

  // Toggle by title
  const toggle = title => {
    setSelTitles(s => {
      const n = new Set(s);
      n.has(title) ? n.delete(title) : n.add(title);
      return n;
    });
  };

  // Save & go to route
  const goToRoute = async () => {
    const picked = places.filter(p => selectedTitles.has(p.title));
    if (!picked.length) return;
    
    await api.patch(`/trips/${id}/sightseeings`, {
      titles: picked.map(p => p.title),
    }).catch(console.error);
    
    const waypoints = picked.map(p => ({
      title: p.title, lat: p.lat, lng: p.lng
    }));
    await saveTripPlaces(id, waypoints).catch(console.error);
    navigate(`/trip/${id}/route`);
  };

  if (phase === 'loading')        return <p className="p-6">Download...</p>;
  if (phase === 'loadingWiki')    return <p className="p-6">Downloading sights…</p>;
  if (phase === 'loadingSaved')   return <p className="p-6">Downloading marks…</p>;
  if (phase === 'error')          return <p className="p-6 text-red-600">An error occurred</p>;

  return (
    <>
      <SEO 
        title={`Que visiter à ${trip?.city} - ${seoConfig.destinations.title}`}
        description={`Découvrez les meilleurs lieux à visiter à ${trip?.city}. Guide touristique complet avec les attractions incontournables et itinéraires recommandés.`}
        keywords={`que visiter à ${trip?.city}, ${trip?.city} tourisme, attractions ${trip?.city}, ${seoConfig.destinations.keywords}`}
        url={generateCanonicalUrl(`/trip/${id}/sightseeings`)}
      />
      <div className="p-6 pt-12 md:pt-6 max-w-4xl mx-auto relative">
      
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>
        Top 20 must-see in {trip.city}
      </h1>
      <ul className="space-y-6">
        {places.map(p=>(
          <li key={p.id} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 shadow-sm items-center sm:items-start">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 self-start"
              checked={selectedTitles.has(p.title)}
              onChange={()=>toggle(p.title)}
            />
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.title}
                   className="w-40 h-28 object-cover rounded-md" />
            )}
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-1 text-white">{p.title}</h2>
              <p className="text-white">{p.desc}</p>
              <p className="text-xs text-gray-400 mt-1">
                👁 {p.views.toLocaleString()} views / 60 days
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={goToRoute}
        disabled={selectedTitles.size===0}
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        ➜ Build a route
      </button>
    </div>
    </>
  );
}
