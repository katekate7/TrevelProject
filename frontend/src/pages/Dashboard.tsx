import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div>
      <h2>Welcome to your Dashboard!</h2>
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
}
