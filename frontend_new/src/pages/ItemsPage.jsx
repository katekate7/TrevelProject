// src/pages/ItemsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ItemsPage() {
  const { id: tripId } = useParams();
  const navigate       = useNavigate();

  const [items,  setItems]  = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [showReq, setShowReq] = useState(false);
  const [reqName, setReqName] = useState('');
  const [busy,    setBusy]    = useState(false);

  // 1️⃣ — завантажуємо items для цієї поїздки
  useEffect(() => {
    api.get(`/trips/${tripId}/items`)
       .then(r => {
         setItems(r.data);
         setChecked(new Set(
           r.data.filter(i => i.isChecked).map(i => i.id)
         ));
       })
       .catch(console.error);
  }, [tripId]);

  // 2️⃣ — переключаємо
  const toggle = id => {
    setChecked(s => {
      const nxt = new Set(s);
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);

      // POST /api/trips/:tripId/items/:itemId
      api.post(`/trips/${tripId}/items/${id}`)
         .catch(console.error);

      return nxt;
    });
  };

  // 3️⃣ — запит на створення нової
  const sendReq = async () => {
    if (!reqName.trim()) return;
    setBusy(true);
    try {
      await api.post('/item-requests', { name: reqName.trim() });
      alert('Запит відправлено!');
      setShowReq(false);
      setReqName('');
    } catch {
      alert('Помилка відправки');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <button onClick={()=>navigate(-1)} className="mb-4 text-blue-500">← Назад</button>
      <h1 className="text-2xl font-bold mb-4">Речі для пакування</h1>

      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={checked.has(it.id)}
              onChange={()=>toggle(it.id)}
            />
            <span className="flex-1">{it.name}</span>
            <span className="text-xs text-gray-500">
              lvl {it.importanceLevel}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={()=>setShowReq(true)}
        className="mt-6 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
      >
        Запропонувати нову річ
      </button>

      {showReq && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Запропонувати нову річ</h2>
            <input
              type="text"
              placeholder="Назва речі"
              className="w-full border px-3 py-2 rounded mb-4"
              value={reqName}
              onChange={e=>setReqName(e.target.value)}
              disabled={busy}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={()=>setShowReq(false)}
                className="px-4 py-2 text-gray-600 hover:underline"
                disabled={busy}
              >Скасувати</button>
              <button
                onClick={sendReq}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                disabled={busy}
              >{busy ? 'Надсилання…' : 'Надіслати'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
