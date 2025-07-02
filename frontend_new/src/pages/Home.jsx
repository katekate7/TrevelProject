import { useState } from 'react';
import LoginForm    from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function Home() {
  const [mode, setMode] = useState('login');   // 'login' | 'register'

  return (
    <div className="auth-wrapper bg-pink-100 min-h-screen flex">
      <div className="w-full max-w-sm mx-auto flex flex-col
                      justify-center items-center
                      px-4 py-8 sm:py-0">

        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Welcome
        </h1>

        {mode === 'login' ? (
          <LoginForm
            onNeedRegister={() => setMode('register')}
            onForgotPassword={() => alert('TODO: Password reset')}
          />
        ) : (
          <RegisterForm
            onNeedLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
}
