import React, { useState } from 'react';
import axios from 'axios';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      setMessage('✅ Успішний вхід!');
      // TODO: редирект або отримання профілю
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Помилка входу');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вхід</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
      <button type="submit">Увійти</button>
      {message && <p>{message}</p>}
    </form>
  );
}
