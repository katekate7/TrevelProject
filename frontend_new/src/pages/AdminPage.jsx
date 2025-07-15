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
  // ───────── LOGOUT ─────────
  const handleLogout = () => {
    localStorage.removeItem('token'); // or sessionStorage, or cookie, depending on your auth
    nav('/start');
  };

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
  return (
    <>
      <style>{`
        table {
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        tbody tr {
          margin-bottom: 8px;
        }
        tbody tr td {
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          color: black;
        }
        tbody tr td:first-child {
          border-radius: 4px 0 0 4px;
          color: white;
          background-color: rgba(108, 117, 125, 0.8);
        }
        tbody tr td:last-child {
          border-radius: 0 4px 4px 0;
        }
        thead tr th {
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          font-weight: bold;
          color: white;
        }
        thead tr th:first-child {
          border-radius: 4px 0 0 4px;
        }
        thead tr th:last-child {
          border-radius: 0 4px 4px 0;
        }
        input, select {
          width: 250px;
          padding: 6px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        input[type="checkbox"] {
          width: auto;
          margin: 0;
        }
        .admin-dashboard-title {
          font-family: 'Abril Fatface, cursive';
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          margin-bottom: 20px;
        }
        @media (max-width: 768px) {
          .admin-dashboard-title {
            font-size: 1.8rem;
            margin-bottom: 30px;
          }
        }
        @media (max-width: 480px) {
          .admin-dashboard-title {
            font-size: 1.5rem;
            margin-bottom: 40px;
          }
        }
      `}</style>
      <div style={{ padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <button
          onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#FF9091', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Log out
        </button>
      </div>
      
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>

      {/* вкладки */}
      <div style={{ marginBottom: 10 }}>
        {['users', 'items', 'requests'].map(t => (
          <button key={t}
                  onClick={() => { setTab(t); setMsg(''); }}
                  disabled={tab === t}
                  style={{ 
                    marginRight: 5, 
                    padding: '8px 12px',
                    background: tab === t ? '#FF9091' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}>
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
          {/* форма «новий» - moved to top */}
          <h2 style={{ marginTop: '25px', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Create new user / admin</h2>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center', marginBottom: '30px' }}>
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
            <button 
              onClick={createUser}
              style={{ 
                padding: '8px 16px', 
                background: '#FF9091', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4, 
                cursor: 'pointer' 
              }}
            >
              Add
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {users.map(u => (
              <div key={u.id} style={{ 
                border: '1px solid #dee2e6', 
                borderRadius: '8px', 
                padding: '15px',
                backgroundColor: '#f9f9f9'
              }}>
                {/* ID Row */}
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: 'black' }}>ID: {u.id}</span>
                </div>
                
                {/* Username Row */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'black' }}>Username:</label>
                  <input value={u.username}
                         onChange={e => setUsers(
                           users.map(x => x.id === u.id ? { ...x, username: e.target.value } : x)
                         )}/>
                </div>
                
                {/* Email Row */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'black' }}>Email:</label>
                  <input type="email" value={u.email}
                         onChange={e => setUsers(
                           users.map(x => x.id === u.id ? { ...x, email: e.target.value } : x)
                         )}/>
                </div>
                
                {/* Role Row */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: 'black' }}>Role:</label>
                  <select value={u.role}
                          onChange={e => setUsers(
                            users.map(x => x.id === u.id ? { ...x, role: e.target.value } : x)
                          )}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                
                {/* Fourth line: Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => updateUser(u)}
                          style={{ 
                            padding: '6px 12px', 
                            background: '#6c757d', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}>
                    Save
                  </button>
                  <button onClick={() => deleteUser(u.id)}
                          style={{ 
                            padding: '6px 12px', 
                            background: '#6c757d', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}>
                    Delete
                  </button>
                  <button onClick={() => resetPwd(u.id)}
                          style={{ 
                            padding: '6px 12px', 
                            background: '#6c757d', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}>
                    Reset password
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------- ITEMS ---------- */}
      {tab === 'items' && (
        <div>
          <h2 style={{ color: 'white' }}>New Item</h2>
          <input placeholder="Name" value={newItem.name}
                 onChange={e => setNewItem({ ...newItem, name: e.target.value })}/>
          <label style={{ marginLeft: 8, color: 'white' }}>
            Important?
            <input type="checkbox" checked={newItem.important}
                   onChange={e => setNewItem({ ...newItem, important: e.target.checked })}/>
          </label>
          <button onClick={addItem} style={{ marginLeft: 8, background: '#FF9091', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 12px' }}>Add</button>

          <h2 style={{ marginTop: 25, color: 'white' }}>All Items</h2>
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
                    <button onClick={() => updateItem(it)} style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 12px', marginRight: '5px' }}>Save</button>
                    <button onClick={() => deleteItem(it.id)} style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 12px' }}>Del</button>
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
          <h2 style={{ color: 'white' }}>Pending Item Requests</h2>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>By</th><th>Action</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.requestedBy}</td>
                  <td>
                    <button onClick={() => approveReq(r.id)} style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 12px', marginRight: '5px' }}>Approve</button>
                    <button onClick={() => rejectReq(r.id)} style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '6px 12px' }}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
