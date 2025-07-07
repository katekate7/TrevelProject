// src/components/LoginForm.jsx
import { useState }   from 'react';
import { useNavigate } from 'react-router-dom';
import api             from '../api';

export default function LoginForm({ onNeedRegister, onForgotPassword }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [message,  setMessage]  = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post('/login', { email, password });
      const { data } = await api.get('/users/me');
      navigate(data.roles.includes('ROLE_ADMIN') ? '/admin' : '/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Помилка входу');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="
          w-full
          bg-white bg-opacity-90
          rounded-lg
          py-3 px-4
          placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-white
        "
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="
          w-full
          bg-white bg-opacity-90
          rounded-lg
          py-3 px-4
          placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-white
        "
      />

      <button
        type="submit"
        className="
          w-full
          bg-[#FF9091] border-2 border-white
          rounded-full
          py-3
          text-white font-semibold
          hover:bg-opacity-90
          transition
        "
      >
        Login
      </button>

      {message && (
        <p className="text-center text-sm text-red-600">{message}</p>
      )}

      {/* Нижній рядок лінків */}
      <div className="flex justify-between text-sm text-white mt-4">
        <button
          type="button"
          onClick={onNeedRegister}
          className="hover:underline"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={onForgotPassword}
          className="hover:underline"
        >
          Forget password?
        </button>
      </div>
    </form>
  );
}
