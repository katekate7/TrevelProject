import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const [tab, setTab] = useState('users'); // users | items | requests
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [newItem, setNewItem] = useState({ name:'', description:'', important:false });
  const navigate = useNavigate();

  useEffect(() => {
    // захист сторінки
    axios.get('/users/me').then(r=>{
      if (!r.data.roles.includes('ROLE_ADMIN')) navigate('/');
      else fetchAll();
    }).catch(()=>navigate('/'));
  }, []);

  const fetchAll = () => {
    fetchUsers(); fetchItems(); fetchRequests();
  };
  const fetchUsers = () =>
    axios.get('/users').then(r=>setUsers(r.data))
      .catch(()=>setMessage('Не вдалось юзерів'));

  const fetchItems = () =>
    axios.get('/items').then(r=>setItems(r.data))
      .catch(()=>setMessage('Не вдалось речей'));

  const fetchRequests = () =>
    axios.get('/item-requests').then(r=>setRequests(r.data))
      .catch(()=>setMessage('Не вдалось заявок'));

  // ==== USER CRUD ====
  const updateUser = u =>
    axios.put(`/users/${u.id}`, { username:u.username, email:u.email })
      .then(()=>fetchUsers()).catch(()=>setMessage('Помилка'));

  const deleteUser = id =>
    window.confirm('Видалити юзера?') &&
    axios.delete(`/users/${id}`).then(()=>fetchUsers())
      .catch(()=>setMessage('Помилка')).finally(()=>{});

  const resetPwd = id =>
    axios.post(`/users/${id}/reset-password`).then(()=>setMessage('Лінк надіслано'))
      .catch(()=>setMessage('Помилка'));

  // ==== ITEM CRUD ====
  const addItem = () =>
    axios.post('/items', newItem)
      .then(()=>{ setNewItem({ name:'',description:'',important:false }); fetchItems(); })
      .catch(()=>setMessage('Помилка створення'));

  const updateItem = i =>
    axios.put(`/items/${i.id}`, i).then(()=>fetchItems())
      .catch(()=>setMessage('Помилка оновлення'));

  const deleteItem = id =>
    window.confirm('Видалити річ?') &&
    axios.delete(`/items/${id}`).then(()=>fetchItems())
      .catch(()=>setMessage('Помилка'));

  // ==== REQUESTS ====
  const approveReq = id =>
    axios.post(`/item-requests/${id}/approve`).then(()=>fetchItems(),fetchRequests())
      .catch(()=>setMessage('Помилка'));

  const rejectReq = id =>
    axios.delete(`/item-requests/${id}`).then(()=>fetchRequests())
      .catch(()=>setMessage('Помилка'));

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: 10 }}>
        {['users','items','requests'].map(t =>
          <button
            key={t}
            onClick={()=>{setTab(t); setMessage('');}}
            disabled={tab===t}
            style={{ marginRight: 5 }}
          >{t.toUpperCase()}</button>
        )}
      </div>
      {message && <div style={{color:'red'}}>{message}</div>}

      {tab==='users' && (
        <table><thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  <input value={u.username}
                    onChange={e=>setUsers(users.map(x=>x.id===u.id?{...x,username:e.target.value}:x))}
                  />
                </td>
                <td>
                  <input type="email" value={u.email}
                    onChange={e=>setUsers(users.map(x=>x.id===u.id?{...x,email:e.target.value}:x))}
                  />
                </td>
                <td>
                  <button onClick={()=>updateUser(u)}>Save</button>
                  <button onClick={()=>deleteUser(u.id)}>Del</button>
                  <button onClick={()=>resetPwd(u.id)}>Reset pwd</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab==='items' && (
        <div>
          <h2>New Item</h2>
          <input placeholder="Name" value={newItem.name}
            onChange={e=>setNewItem({...newItem,name:e.target.value})}
          />
          <input placeholder="Desc" value={newItem.description}
            onChange={e=>setNewItem({...newItem,description:e.target.value})}
          />
          <label>
            Important?
            <input type="checkbox" checked={newItem.important}
              onChange={e=>setNewItem({...newItem,important:e.target.checked})}
            />
          </label>
          <button onClick={addItem}>Add</button>

          <h2>All Items</h2>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Important</th><th>Action</th></tr></thead>
            <tbody>
              {items.map(it=>(
                <tr key={it.id} style={it.important?{color:'red'}:{}}>
                  <td>{it.id}</td>
                  <td>
                    <input value={it.name}
                      onChange={e=>setItems(items.map(x=>x.id===it.id?{...x,name:e.target.value}:x))}
                    />
                  </td>
                  <td>
                    <input type="checkbox" checked={it.important}
                      onChange={()=>{
                        it.important = !it.important;
                        updateItem(it);
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={()=>updateItem(it)}>Save</button>
                    <button onClick={()=>deleteItem(it.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='requests' && (
        <div>
          <h2>Pending Item Requests</h2>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>By</th><th>Action</th></tr></thead>
            <tbody>
              {requests.map(r=>(
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.requestedBy}</td>
                  <td>
                    <button onClick={()=>approveReq(r.id)}>Approve</button>
                    <button onClick={()=>rejectReq(r.id)}>Reject</button>
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
