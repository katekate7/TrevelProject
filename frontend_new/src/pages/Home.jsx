// src/pages/Home.jsx
import { useState } from 'react';
import LoginForm    from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function Home() {
  const [mode, setMode] = useState('login'); // 'login' або 'register'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF9091]">
      {/*──────────── Контейнер форми ────────────*/}
      <div
        className="
          relative w-full
          /* адаптивна стеля ширини */
          max-w-[320px]   sm:max-w-[400px]
          md:max-w-[500px] lg:max-w-[600px]
          xl:max-w-[700px] 2xl:max-w-[800px]

          /* падінги теж адаптивні */
          p-6 sm:p-8 md:p-10

          /* стилі картки */
          rounded-3xl bg-white/30 backdrop-blur-md
          shadow-[0_0_40px_rgba(255,255,255,0.5)]
        "
      >
        {/* Заголовок поверх картки */}
        <h1
          className="
            absolute left-1/2 -translate-x-1/2
             -top-[4.5rem] sm:-top-[5rem] md:-top-[9.5rem]   /* різні відступи */
            text-white font-abril leading-none select-none
            text-[56px] sm:text-[72px] md:text-[96px] lg:text-[112px]
            z-10
          "
        >
          {mode === 'login' ? 'Login' : 'Register'} 
        </h1>

        {/* Вміст картки */}
        {mode === 'login' ? (
          <LoginForm
            onNeedRegister={() => setMode('register')}
            onForgotPassword={() => alert('TODO: password reset')}
          />
        ) : (
          <RegisterForm onNeedLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}
