import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f9fafb'
    }}>
      <button
        onClick={() => navigate('/start')}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.25rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        Заплануй свою подорожі
      </button>
    </div>
  )
}
