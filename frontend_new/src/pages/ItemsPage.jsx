import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SEO from '../components/SEO/SEO';
import { seoConfig, generateCanonicalUrl } from '../components/SEO/seoConfig';

export default function ItemsPage() {
  const { id: tripId } = useParams();
  const nav            = useNavigate();

  const [items, setItems]   = useState([]);
  const [checked, setChk]   = useState(new Set());
  const [showReq, setShow]  = useState(false);
  const [reqName, setName]  = useState('');
  const [busy, setBusy]     = useState(false);

  /* ───────── load items for trip ───────── */
  useEffect(() => {
    api.get(`/trips/${tripId}/items`)
       .then(r => {
         setItems(r.data);
         setChk(new Set(r.data.filter(i => i.isChecked).map(i => i.id)));
       })
       .catch(console.error);
  }, [tripId]);

  /* ───────── toggle taken ───────── */
  const toggle = id => {
    setChk(s => {
      const nxt = new Set(s);
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);
      api.post(`/trips/${tripId}/items/${id}`).catch(console.error);
      return nxt;
    });
  };

  /* ───────── send new-item request ───────── */
  const sendReq = async () => {
    if (!reqName.trim()) return;
    setBusy(true);
    try {
      await api.post('/item-requests', { name: reqName.trim() });
      alert('Запит відправлено!');
      setShow(false);
      setName('');
    } catch {
      alert('Помилка відправки');
    } finally { setBusy(false); }
  };

  return (
    <>
      <SEO 
        title={seoConfig.checklist.title}
        description={seoConfig.checklist.description}
        keywords={seoConfig.checklist.keywords}
        url={generateCanonicalUrl(`/trip/${tripId}/items`)}
      />
      <div className="p-6 pt-12 md:pt-6 max-w-md mx-auto relative">
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Abril Fatface, cursive' }}>Things for packing</h1>

      <ul className="space-y-2 list-disc pl-4">
        {items.map(it => (
          <li
            key={it.id}
            className={`flex items-center gap-3
                        ${it.important ? 'text-red-600 font-semibold marker:text-red-600' : ''}`}
          >
            <input
              type="checkbox"
              className={`h-5 w-5 rounded
                          ${it.important ? 'accent-red-600' : 'accent-blue-600'}`}
              checked={checked.has(it.id)}
              onChange={() => toggle(it.id)}
            />
            <span className="flex-1">{it.name}</span>
          </li>
        ))}
      </ul>


      <button onClick={() => setShow(true)}
              className="mt-6 px-4 py-2 text-white rounded hover:bg-[#e6818c]"
              style={{ backgroundColor: '#FF9091' }}>
        Offer a new item
      </button>

      {showReq && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-black">Offer a new item</h2>
            <input type="text"
                   placeholder="Name of the item"
                   className="w-full border px-3 py-2 rounded mb-4"
                   value={reqName}
                   onChange={e => setName(e.target.value)}
                   disabled={busy}/>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShow(false)}
                      className="px-4 py-2 text-gray-600 hover:underline text-white rounded"
                      disabled={busy}>Cancel</button>
              <button onClick={sendReq}
                      className="px-4 py-2 text-white rounded hover:bg-[#e6818c]"
                      style={{ backgroundColor: '#FF9091' }}
                      disabled={busy}>{busy ? 'Sending...' : 'Send'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
