// src/pages/ItemsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ItemsPage() {
  // Список всех доступных вещей (админская зона)
  const [items, setItems] = useState([]);
  // Какие вещи уже взял пользователь
  const [checked, setChecked] = useState(new Set());
  // Состояние модалки для запроса новой вещи
  const [showReqForm, setShowReqForm] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqBusy, setReqBusy] = useState(false);

  // 1️⃣ — подгружаем все вещи
  useEffect(() => {
    api.get('/items')
       .then(r => setItems(r.data))
       .catch(console.error);
  }, []);

    useEffect(() => {
    // 1) всі речі
    api.get('/api/items')
        .then(r => setItems(r.data))
        .catch(console.error);

    // 2) які вже взяв поточний користувач
    api.get('/api/users/items')
        .then(r => {
        const takenIds = r.data
            .filter(x => x.taken)
            .map(x => x.itemId);
        setChecked(new Set(takenIds));
        })
        .catch(console.error);
    }, []);

  // 3️⃣ — переключаем взял/не взял
  const toggle = id => {
    setChecked(s => {
      const nxt = new Set(s);
      if (nxt.has(id)) nxt.delete(id);
      else nxt.add(id);
      // тут сразу шлём на бэк
      api.post('/user/items', { itemId: id, taken: nxt.has(id) })
         .catch(console.error);
      return nxt;
    });
  };

  // 4️⃣ — запрос новой вещи админам
  const sendRequest = async () => {
    if (!reqName.trim()) return;
    setReqBusy(true);
    try {
      await api.post('/item-requests', { name: reqName.trim() });
      alert('Запрос отправлен администраторам!');
      setReqName('');
      setShowReqForm(false);
    } catch {
      alert('Не удалось отправить запрос');
    } finally {
      setReqBusy(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Речи для упаковки</h1>

      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={checked.has(it.id)}
              onChange={() => toggle(it.id)}
            />
            <span className="flex-1">{it.name}</span>
            <span className="text-xs text-gray-500">
              уровень {it.importanceLevel}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowReqForm(true)}
        className="mt-6 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
      >
        Запропонувати нову річ
      </button>

      {showReqForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">
              Запропонувати нову річ
            </h2>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Назва речі"
              value={reqName}
              onChange={e => setReqName(e.target.value)}
              disabled={reqBusy}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReqForm(false)}
                className="px-4 py-2 text-gray-600 hover:underline disabled:opacity-50"
                disabled={reqBusy}
              >
                Скасувати
              </button>
              <button
                onClick={sendRequest}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
                disabled={reqBusy}
              >
                {reqBusy ? 'Надсилання…' : 'Надіслати'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
