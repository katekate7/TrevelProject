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
      const msg = err.response?.data?.message || '❌ Помилка входу';
      setMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 text-gray-800">

      <h2 className="text-xl font-semibold text-center text-gray-800">Вхід</h2>

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
        Увійти
      </button>

      {message && (
        <p className="text-center text-sm text-red-600">{message}</p>
      )}

      {/* Нижній блок посилань */}
      <div className="text-sm text-center flex flex-col gap-2 mt-3">
        <button type="button"
                onClick={onForgotPassword}
                className="text-blue-600 hover:underline">
          Забули пароль?
        </button>

        <span>
          У вас немає облікового запису?{' '}
          <button type="button"
                  onClick={onNeedRegister}
                  className="text-blue-600 hover:underline">
            Зареєструватися
          </button>
        </span>
      </div>
    </form>
  );
}
