/**
 * @fileoverview AdminPage component for administrative dashboard
 * This component provides a comprehensive admin interface for managing users, items,
 * and item requests with full CRUD operations and administrative controls.
 */

import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

/**
 * AdminPage Component
 * 
 * Administrative dashboard with tabbed interface for managing:
 * - Users (create, read, update, delete, password reset)
 * - Items (create, read, update, delete)
 * - Item requests (approve/reject pending requests)
 * 
 * Includes role-based access control and authentication guard.
 * 
 * @component
 * @returns {JSX.Element} The rendered admin dashboard with tabbed interface
 * 
 * @example
 * // Used for admin users only with role-based access
 * <Route path="/admin" element={<AdminPage />} />
 */
export default function AdminPage() {
  /* ───────── State Management ───────── */
  /** @type {[string, Function]} Current active tab - 'users', 'items', or 'requests' */
  const [tab, setTab]       = useState('users');
  
  /** @type {[Array<Object>, Function]} Array of all users in the system */
  const [users, setUsers]   = useState([]);
  
  /** @type {[Array<Object>, Function]} Array of all items in the system */
  const [items, setItems]   = useState([]);
  
  /** @type {[Array<Object>, Function]} Array of pending item requests */
  const [requests, setRequests] = useState([]);
  
  /** @type {[string, Function]} Status/error message to display to admin */
  const [message, setMsg]   = useState('');
  
  /** @type {[string, Function]} Type of message - 'success' or 'error' */
  const [messageType, setMessageType] = useState('error');

  /** @type {[Object, Function]} Form state for creating new items */
  const [newItem, setNewItem] = useState({ name: '', important: false });

  /** @type {[Object, Function]} Form state for creating new users/admins */
  const [newUser, setNewUser] = useState({
    username: '', email: '', role: 'user',
  });

  /** React Router navigation hook for programmatic navigation */
  const nav = useNavigate();
  /**
   * Handles user logout by clearing authentication tokens
   * Removes token from localStorage and redirects to start page
   * 
   * @function
   */
  // ───────── AUTHENTICATION ─────────
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear authentication token
    nav('/start'); // Redirect to start page
  };

  /**
   * Effect hook for authentication guard and initial data loading
   * Verifies admin role and loads all administrative data
   * 
   * @async
   * @function
   */
  /* ───────── Authentication guard + initial data loading ───────── */
  useEffect(() => {
    // Verify user has admin role
    axios.get('/users/me')
      .then(r => {
        // Check if user has admin role
        if (!r.data.roles.includes('ROLE_ADMIN')) {
          nav('/'); // Redirect non-admin users
        } else {
          fetchAll(); // Load all admin data
        }
      })
      .catch(() => nav('/')); // Redirect on authentication failure
  }, []);

  /**
   * Loads all administrative data (users, items, requests)
   * @function
   */
  const fetchAll = () => { fetchUsers(); fetchItems(); fetchRequests(); };
  
  /**
   * Fetches all users from the API
   * @async
   * @function
   */
  const fetchUsers = () => 
    axios.get('/users')
         .then(r => setUsers(r.data))
         .catch(() => setMsg('Failed to load users'));
  
  /**
   * Fetches all items from the API
   * @async
   * @function
   */
  const fetchItems = () => 
    axios.get('/items')
         .then(r => setItems(r.data))
         .catch(() => setMsg('Failed to load items'));
  
  /**
   * Fetches pending item requests from the API
   * @async
   * @function
   */
  const fetchRequests = () => 
    axios.get('/item-requests?status=pending')
         .then(r => setRequests(r.data))
         .catch(() => setMsg('Failed to load applications'));

  /**
   * Creates a new user account with specified role
   * Sends password reset email to new user and provides admin feedback
   * 
   * @async
   * @function
   */
  /* ───────── USER MANAGEMENT (CRUD) ───────── */
  const createUser = () => {
    const { username, email, role } = newUser;
    
    // Validate required fields
    if (!username || !email) return;
    
    // Create user via API
    axios.post('/users', newUser)
         .then(() => { 
           // Reset form and refresh user list
           setNewUser({ username:'', email:'', role:'user' }); 
           fetchUsers(); 
           
           // Show success message
           setMsg(`User ${username} created successfully. Password reset email sent to ${email}`);
           setMessageType('success');
         })
         .catch((err) => {
           // Handle creation errors
           const errorMsg = err.response?.data?.error || 'Error creating user';
           setMsg(`Error: ${errorMsg}`);
           setMessageType('error');
         });
  };

  /**
   * Updates an existing user's information
   * 
   * @async
   * @function
   * @param {Object} u - User object with updated information
   * @param {number} u.id - User ID
   * @param {string} u.username - Updated username
   * @param {string} u.email - Updated email
   * @param {string} u.role - Updated user role
   */
  const updateUser = u =>
    axios.put(`/users/${u.id}`, { username: u.username, email: u.email, role: u.role })
         .then(fetchUsers) // Refresh user list on success
         .catch(() => setMsg('Failed to update user'));

  /**
   * Deletes a user after confirmation
   * 
   * @async
   * @function
   * @param {number} id - User ID to delete
   */
  const deleteUser = id =>
    window.confirm('Delete a user?') &&
    axios.delete(`/users/${id}`)
         .then(fetchUsers) // Refresh user list on success
         .catch(() => setMsg('Failed to delete user'));

  /**
   * Sends password reset email to a specific user
   * 
   * @async
   * @function
   * @param {number} id - User ID to send reset email to
   */
  const resetPwd = id => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    // Confirm action with admin
    if (!window.confirm(`Send password reset link to ${user.email}?`)) return;
    
    // Send reset email
    axios.post(`/users/${id}/reset-password`)
         .then(() => {
           setMsg(`Password reset link sent to ${user.email}`);
           setMessageType('success');
         })
         .catch((err) => {
           const errorMsg = err.response?.data?.error || 'Failed to send email';
           setMsg(`Error: ${errorMsg}`);
           setMessageType('error');
         });
  };

  /**
   * Creates a new item in the system
   * 
   * @async
   * @function
   */
  /* ───────── ITEM MANAGEMENT (CRUD) ───────── */
  const addItem = () =>
    axios.post('/items', newItem)
         .then(() => { 
           // Reset form and refresh items list
           setNewItem({ name:'', important:false }); 
           fetchItems(); 
         })
         .catch(() => setMsg('Failed to create item'));

  /**
   * Updates an existing item's information
   * 
   * @async
   * @function
   * @param {Object} i - Item object with updated information
   * @param {number} i.id - Item ID
   * @param {string} i.name - Updated item name
   * @param {boolean} i.important - Updated importance flag
   */
  const updateItem = i =>
    axios.patch(`/items/${i.id}`, { name: i.name, important: i.important })
         .then(fetchItems) // Refresh items list on success
         .catch(() => setMsg('Failed to update item'));

  /**
   * Deletes an item after confirmation
   * 
   * @async
   * @function
   * @param {number} id - Item ID to delete
   */
  const deleteItem = id =>
    window.confirm('Delete item?') &&
    axios.delete(`/items/${id}`)
         .then(fetchItems) // Refresh items list on success
         .catch(() => setMsg('Failed to delete item'));

  /**
   * Approves a pending item request
   * Refreshes both items and requests lists after approval
   * 
   * @async
   * @function
   * @param {number} id - Request ID to approve
   */
  /* ───────── REQUEST MANAGEMENT ───────── */
  const approveReq = id =>
    axios.patch(`/item-requests/${id}`, { action: 'approve' })
         .then(() => { 
           // Refresh both items and requests lists
           fetchItems(); 
           fetchRequests(); 
         })
         .catch(() => setMsg('Failed to approve request'));

  /**
   * Rejects a pending item request
   * 
   * @async
   * @function
   * @param {number} id - Request ID to reject
   */
  const rejectReq = id =>
    axios.patch(`/item-requests/${id}`, { action: 'reject' })
         .then(fetchRequests) // Refresh requests list on success
         .catch(() => setMsg('Failed to reject request'));

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
          <h2 style={{ marginTop: '25px', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Create new user / admin</h2>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center', marginBottom: '30px' }}>
            <input placeholder="Username" value={newUser.username}
                   onChange={e => setNewUser({ ...newUser, username: e.target.value })}/>
            <input placeholder="Email" type="email" value={newUser.email}
                   onChange={e => setNewUser({ ...newUser, email: e.target.value })}/>
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
              Create & Send Email
            </button>
          </div>
          <div style={{ 
            backgroundColor: '#e7f3ff', 
            border: '1px solid #b3d9ff', 
            borderRadius: '4px', 
            padding: '10px', 
            marginBottom: '20px',
            fontSize: '14px',
            color: '#004085'
          }}>
            <strong>Security Note:</strong> No password required. The system will automatically generate a secure password reset token and send an email to the user with instructions to set their password.
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
                  <td style={{color: 'white'}}>{r.name}</td>
                  <td style={{color: 'white'}}>{r.requestedBy}</td>
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
