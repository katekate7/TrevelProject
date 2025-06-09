import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/login', { email, password });
      setMessage('✅ Успішний вхід!');
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Помилка входу');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вхід</h2>
      <input type="email"   value={email}    onChange={e => setEmail(e.target.value)}     placeholder="Email"    required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль"  required />
      <button type="submit">Увійти</button>
      {message && <p>{message}</p>}
    </form>
  );
}
