import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(({ data }) => {
        if (!data.roles.includes('ROLE_ADMIN')) navigate('/');
        else fetchUsers();
      })
      .catch(() => navigate('/'));
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users', { withCredentials: true });
      setUsers(data);
    } catch {
      setMessage('Failed to fetch users');
    }
  };

  const handleUpdate = async (user) => {
    try {
      await axios.put(`/api/users/${user.id}`, { username: user.username, email: user.email }, { withCredentials: true });
      setMessage('User updated');
      fetchUsers();
    } catch {
      setMessage('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/users/${id}`, { withCredentials: true });
      setMessage('User deleted');
      fetchUsers();
    } catch {
      setMessage('Delete failed');
    }
  };

  const handleReset = async (id) => {
    try {
      await axios.post(`/api/users/${id}/reset-password`, {}, { withCredentials: true });
      setMessage('Reset email sent');
    } catch {
      setMessage('Reset failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr><th>ID</th><th>Username</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <input
                  value={user.username}
                  onChange={e => setUsers(users.map(u => u.id === user.id ? { ...u, username: e.target.value } : u))}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={user.email}
                  onChange={e => setUsers(users.map(u => u.id === user.id ? { ...u, email: e.target.value } : u))}
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(user)}>Save</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
                <button onClick={() => handleReset(user.id)}>Send Reset</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
