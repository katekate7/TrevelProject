import React, { useState } from 'react';
import LoginForm    from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function Home() {
  const [mode, setMode] = useState('login');
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Welcome</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setMode('login')}    disabled={mode === 'login'}>Login</button>
        <button onClick={() => setMode('register')} disabled={mode === 'register'}>Register</button>
      </div>
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
