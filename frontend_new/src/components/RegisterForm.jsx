import { useState }   from 'react';
import { useNavigate } from 'react-router-dom';
import api             from '../api';

export default function RegisterForm({ onNeedLogin }) {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [message,  setMessage]  = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    try {
      await api.post('/users/register', { username, email, password });
      await api.post('/login', { email, password });

      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || '❌ Registration error';
      setMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        required
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="
          w-full rounded-lg py-3 px-4
          bg-white bg-opacity-90 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-white
        "
      />

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

      {/* Register button */}
      <button
        type="submit"
        className="
          w-full py-3 rounded-full
          bg-[#282A54] border-2 border-white text-white font-semibold
          transition hover:bg-opacity-90
        "
      >
        Register
      </button>

      {/* Error message */}
      {message && (
        <p className="text-center text-sm text-red-600">{message.replace('Registration error', 'Registration error')}</p>
      )}

      {/* Links (same style as login) */}
      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between text-sm text-black">
        <span>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNeedLogin}
            className="
              bg-transparent p-0 m-0
              font-semibold underline hover:text-[#d14b4c]
              focus:outline-none
            "
          >
            Log in
          </button>
        </span>
      </div>
    </form>
  );
}
