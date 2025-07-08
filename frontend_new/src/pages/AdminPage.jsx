import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const [tab, setTab]       = useState('users');              // users | items | requests
  const [users, setUsers]   = useState([]);
  const [items, setItems]   = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMsg]   = useState('');
  const [messageType, setMessageType] = useState('error'); // 'success' or 'error'

  /* форма «новий айтем» */
  const [newItem, setNewItem] = useState({ name: '', important: false });

  /* форма «новий юзер / адмін» */
  const [newUser, setNewUser] = useState({
    username: '', email: '', password: '', role: 'user',
  });

  const nav = useNavigate();

  /* ───────── guard + первинне завантаження ───────── */
  useEffect(() => {
    axios.get('/users/me')
      .then(r => {
        if (!r.data.roles.includes('ROLE_ADMIN')) nav('/');
        else fetchAll();
      })
      .catch(() => nav('/'));
  }, []);

  const fetchAll = () => { fetchUsers(); fetchItems(); fetchRequests(); };
  const fetchUsers    = () => axios.get('/users').then(r => setUsers(r.data)).catch(()=>setMsg('Не вдалось юзерів'));
  const fetchItems    = () => axios.get('/items').then(r => setItems(r.data)).catch(()=>setMsg('Не вдалось речей'));
  const fetchRequests = () => axios.get('/item-requests?status=pending')
                                   .then(r => setRequests(r.data))
                                   .catch(()=>setMsg('Не вдалось заявок'));

  /* ───────── USER CRUD ───────── */
  const createUser = () => {
    const { username, email, password, role } = newUser;
    if (!username || !email || !password) return;
    axios.post('/users', newUser)
         .then(() => { 
           setNewUser({ username:'', email:'', password:'', role:'user' }); 
           fetchUsers(); 
           setMsg(`Користувача ${username} створено успішно`);
           setMessageType('success');
         })
         .catch(() => {
           setMsg('Помилка створення користувача');
           setMessageType('error');
         });
  };

  const updateUser = u =>
    axios.put(`/users/${u.id}`, { username: u.username, email: u.email, role: u.role })
         .then(fetchUsers)
         .catch(() => setMsg('Помилка'));

  const deleteUser = id =>
    window.confirm('Видалити юзера?') &&
    axios.delete(`/users/${id}`).then(fetchUsers).catch(() => setMsg('Помилка'));

  const resetPwd = id => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    if (!window.confirm(`Надіслати лінк скидання пароля на ${user.email}?`)) return;
    
    axios.post(`/users/${id}/reset-password`)
         .then(() => {
           setMsg(`Лінк скидання пароля надіслано на ${user.email}`);
           setMessageType('success');
         })
         .catch((err) => {
           const errorMsg = err.response?.data?.error || 'Помилка відправки листа';
           setMsg(`Помилка: ${errorMsg}`);
           setMessageType('error');
         });
  };

  /* ───────── ITEM CRUD ───────── */
  const addItem = () =>
    axios.post('/items', newItem)
         .then(() => { setNewItem({ name:'', important:false }); fetchItems(); })
         .catch(() => setMsg('Помилка створення'));

  const updateItem = i =>
    axios.patch(`/items/${i.id}`, { name: i.name, important: i.important })
         .then(fetchItems)
         .catch(() => setMsg('Помилка оновлення'));

  const deleteItem = id =>
    window.confirm('Видалити річ?') &&
    axios.delete(`/items/${id}`).then(fetchItems).catch(()=>setMsg('Помилка'));

  /* ───────── REQUESTS ───────── */
  const approveReq = id =>
    axios.patch(`/item-requests/${id}`, { action: 'approve' })
         .then(()=>{ fetchItems(); fetchRequests(); })
         .catch(()=>setMsg('Помилка'));

  const rejectReq = id =>
    axios.patch(`/item-requests/${id}`, { action: 'reject' })
         .then(fetchRequests)
         .catch(()=>setMsg('Помилка'));

  /* ───────── UI ───────── */
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    nav('/start');
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}
        >
          Log out
        </button>
      </div>

      {/* вкладки */}
      <div style={{ marginBottom: 10 }}>
        {['users', 'items', 'requests'].map(t => (
          <button key={t}
                  onClick={() => { setTab(t); setMsg(''); }}
                  disabled={tab === t}
                  style={{ marginRight: 5 }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {message && (
        <div style={{ 
          color: messageType === 'success' ? 'green' : 'red',
          padding: '10px',
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {message}
        </div>
      )}

      {/* ---------- USERS ---------- */}
      {tab === 'users' && (
        <>
          <table>
            <thead>
              <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    <input value={u.username}
                           onChange={e => setUsers(
                             users.map(x => x.id === u.id ? { ...x, username: e.target.value } : x)
                           )}/>
                  </td>
                  <td>
                    <input type="email" value={u.email}
                           onChange={e => setUsers(
                             users.map(x => x.id === u.id ? { ...x, email: e.target.value } : x)
                           )}/>
                  </td>
                  <td>
                    <select value={u.role}
                            onChange={e => setUsers(
                              users.map(x => x.id === u.id ? { ...x, role: e.target.value } : x)
                            )}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => updateUser(u)}>Save</button>
                    <button onClick={() => deleteUser(u.id)}>Del</button>
                    <button onClick={() => resetPwd(u.id)}>Reset pwd</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* форма «новий» */}
          <h2 style={{ marginTop: 25 }}>Create new user / admin</h2>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
            <input placeholder="Username" value={newUser.username}
                   onChange={e => setNewUser({ ...newUser, username: e.target.value })}/>
            <input placeholder="Email" type="email" value={newUser.email}
                   onChange={e => setNewUser({ ...newUser, email: e.target.value })}/>
            <input placeholder="Password" type="password" value={newUser.password}
                   onChange={e => setNewUser({ ...newUser, password: e.target.value })}/>
            <select value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <button onClick={createUser}>Add</button>
          </div>
        </>
      )}

      {/* ---------- ITEMS ---------- */}
      {tab === 'items' && (
        <div>
          <h2>New Item</h2>
          <input placeholder="Name" value={newItem.name}
                 onChange={e => setNewItem({ ...newItem, name: e.target.value })}/>
          <label style={{ marginLeft: 8 }}>
            Important?
            <input type="checkbox" checked={newItem.important}
                   onChange={e => setNewItem({ ...newItem, important: e.target.checked })}/>
          </label>
          <button onClick={addItem} style={{ marginLeft: 8 }}>Add</button>

          <h2 style={{ marginTop: 25 }}>All Items</h2>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Important</th><th>Action</th></tr></thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} style={it.important ? { color:'red' } : {}}>
                  <td>{it.id}</td>
                  <td>
                    <input value={it.name}
                           onChange={e => setItems(
                             items.map(x => x.id === it.id ? { ...x, name: e.target.value } : x)
                           )}/>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={it.important}
                      className={it.important ? 'accent-red-600' : 'accent-blue-600'}
                      onChange={() => {
                        const upd = items.map(x =>
                          x.id === it.id ? { ...x, important: !x.important } : x
                        );
                        setItems(upd);
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={() => updateItem(it)}>Save</button>
                    <button onClick={() => deleteItem(it.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- REQUESTS ---------- */}
      {tab === 'requests' && (
        <div>
          <h2>Pending Item Requests</h2>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>By</th><th>Action</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.requestedBy}</td>
                  <td>
                    <button onClick={() => approveReq(r.id)}>Approve</button>
                    <button onClick={() => rejectReq(r.id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
