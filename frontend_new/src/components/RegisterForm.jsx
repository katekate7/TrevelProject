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
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || '❌ Помилка реєстрації';
      setMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 text-gray-800">

      <h2 className="text-xl font-semibold text-center text-gray-800">
        Реєстрація
      </h2>

      <input className="border rounded p-3"
             placeholder="Username"
             value={username}
             onChange={e => setUsername(e.target.value)}
             required />

      <input type="email"
             className="border rounded p-3"
             placeholder="Email"
             value={email}
             onChange={e => setEmail(e.target.value)}
             required />

      <input type="password"
             className="border rounded p-3"
             placeholder="Пароль"
             value={password}
             onChange={e => setPassword(e.target.value)}
             required />

      <button type="submit"
              className="bg-blue-600 text-white py-3 rounded shadow-sm">
        Зареєструватися
      </button>

      {message && (
        <p className="text-center text-sm text-red-600">{message}</p>
      )}

      <p className="text-sm text-center mt-3">
        Уже маєте акаунт?{' '}
        <button type="button"
                onClick={onNeedLogin}
                className="text-blue-600 hover:underline">
          Увійти
        </button>
      </p>
    </form>
  );
}
