import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/users/register', {
        username,
        email,
        password
      }, {
        withCredentials: true
      });

      setMessage(response.data.message || '✅ Реєстрація успішна');
    } catch (error) {
      setMessage(error.response?.data?.error || '❌ Помилка реєстрації');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
      <button type="submit">Зареєструватися</button>
      {message && <p>{message}</p>}
    </form>
  );
}
