// src/components/LoginForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function LoginForm({ onNeedRegister, onForgotPassword }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState(null);
  const navigate                = useNavigate();

  // Clear any error messages when component mounts
  useEffect(() => {
    setMessage(null);
  }, []);

  /* ─────────────────── SUBMIT ─────────────────── */
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    try {
      const loginResponse = await api.post('/login', { email, password });
      
      // Store the JWT token if provided
      if (loginResponse.data.token) {
        localStorage.setItem('jwt_token', loginResponse.data.token);
      }
      
      // Only try to get user data if login was successful
      if (loginResponse.status === 200) {
        const { data } = await api.get('/users/me');
        navigate(data.roles.includes('ROLE_ADMIN') ? '/admin' : '/dashboard');
      }
    } catch (err) {
      // Handle different types of errors more gracefully
      if (err.response?.status === 401) {
        setMessage('❌ Невірний email або пароль');
      } else if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage('❌ Помилка входу. Спробуйте ще раз.');
      }
    }
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="
          w-full rounded-lg py-3 px-4
          bg-white bg-opacity-90 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-white
        "
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="
          w-full rounded-lg py-3 px-4
          bg-white bg-opacity-90 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-white
        "
      />

      {/* Login button */}
      <button
        type="submit"
        className="
          w-full py-3 rounded-full
          bg-[#FF9091] border-2 border-white text-white font-semibold
          transition hover:bg-opacity-90
        "
      >
        Login
      </button>

      {/* Error message */}
      {message && (
        <p className="text-center text-sm text-red-600">{message}</p>
      )}

      {/* Links (без чорного фону) */}
      <div className=" flex flex-col text-sm text-black">
        <span className="flex flex-row">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={onNeedRegister}
            className="
              bg-transparent p-0 m-0
              font-semibold underline hover:text-[#d14b4c]
              focus:outline-none ml-1"
          >
            Sign in
          </button>
        </span>
        <button
          type="button"
          onClick={onForgotPassword}
          className="
            bg-transparent p-0 m-0 mt-2 sm:mt-0
            font-semibold underline hover:text-[#d14b4c]
            focus:outline-none self-start"
        >
          Forget password?
        </button>
      </div>
    </form>
  );
}
