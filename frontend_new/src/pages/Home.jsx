/**
 * @fileoverview Home page component for user authentication
 * This component provides login and registration functionality with dynamic UI
 * that changes based on the current authentication mode.
 */

// src/pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm    from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import logoPink from '../images/logopink.png';
import logoBlue from '../images/logoblue.png';

/**
 * Home Component
 * 
 * Main landing page that handles user authentication (login/register).
 * Features dynamic background colors and logos that change based on the current mode.
 * Uses a glassmorphism design with backdrop blur effects.
 * 
 * @component
 * @returns {JSX.Element} The rendered home page with authentication forms
 * 
 * @example
 * // Used as the main entry point of the application
 * <Route path="/" element={<Home />} />
 */
export default function Home() {
  /** @type {[string, Function]} Current authentication mode - 'login' or 'register' */
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  /** React Router navigation hook for programmatic navigation */
  const navigate = useNavigate();

  return (
    /* Main container with dynamic background color based on authentication mode */
    <div className={`min-h-screen flex items-center justify-center ${mode === 'login' ? 'bg-[#FF9091]' : 'bg-[#282A54]'} relative`}>
      {/* Logo in top right - changes based on mode */}
      {/* Blue logo for login mode (pink background), pink logo for register mode (blue background) */}
      <img 
        src={mode === 'login' ? logoBlue : logoPink} 
        alt="Logo" 
        className="absolute top-1.5 right-1.5 w-16 h-16 md:w-20 md:h-20 z-20"
      />
      
      {/*──────────── Authentication form container ────────────*/}
      {/* Glassmorphism card with responsive sizing and backdrop blur */}
      <div
        className="
          relative w-full
          /* Responsive maximum width scaling */
          max-w-[320px]   sm:max-w-[400px]
          md:max-w-[500px] lg:max-w-[600px]
          xl:max-w-[700px] 2xl:max-w-[800px]

          /* Responsive padding scaling */
          p-6 sm:p-8 md:p-10

          /* Glassmorphism styling with rounded corners and backdrop blur */
          rounded-3xl bg-white/30 backdrop-blur-md
          shadow-[0_0_40px_rgba(255,255,255,0.5)]
        "
      >
        {/* Dynamic title positioned above the card */}
        <h1
          className="
            absolute left-1/2 -translate-x-1/2
            -top-[2.5rem] sm:-top-[3rem] md:-top-[6rem]   /* Responsive top positioning */
            text-white font-abril leading-none select-none
            text-[56px] sm:text-[72px] md:text-[96px] lg:text-[112px]
            z-10
          "
        >
          {mode === 'login' ? 'Login' : 'Register'} 
        </h1>

        {/* Conditional rendering of authentication forms based on current mode */}
        {mode === 'login' ? (
          <>
            {/* Login form with callbacks for mode switching and password recovery */}
            <LoginForm
              onNeedRegister={() => setMode('register')}
              onForgotPassword={() => navigate('/forgot-password')}
            />
            {/* Note: Duplicate bottom links removed, now only LoginForm renders them */}
          </>
        ) : (
          <>
            {/* Registration form with callback for switching to login mode */}
            <RegisterForm onNeedLogin={() => setMode('login')} />
            {/* Note: Duplicate login link removed, now only RegisterForm renders it */}
          </>
        )}
      </div>
    </div>
  );
}