// src/pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm    from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import logoPink from '../images/logopink.png';

export default function Home() {
  const [mode, setMode] = useState('login'); // 'login' або 'register'
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center ${mode === 'login' ? 'bg-[#FF9091]' : 'bg-[#282A54]'} relative`}>
      {/* Logo in top right */}
      <img 
        src={logoPink} 
        alt="Logo" 
        className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 z-20"
      />
      
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
            -top-[2.5rem] sm:-top-[3rem] md:-top-[6rem]   /* slightly higher than before */
            text-white font-abril leading-none select-none
            text-[56px] sm:text-[72px] md:text-[96px] lg:text-[112px]
            z-10
          "
        >
          {mode === 'login' ? 'Login' : 'Register'} 
        </h1>

        {/* Вміст картки */}
      {mode === 'login' ? (
                <>
                  <LoginForm
                    onNeedRegister={() => setMode('register')}
                    onForgotPassword={() => navigate('/forgot-password')}
                  />
                  {/* (Duplicate bottom links removed, now only LoginForm renders them) */}
                </>
              ) : (
                <>
                  <RegisterForm onNeedLogin={() => setMode('login')} />
                  {/* (Duplicate login link removed, now only RegisterForm renders it) */}
                </>
              )}
            </div>
          </div>
        );
      }