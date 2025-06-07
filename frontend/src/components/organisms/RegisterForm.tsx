import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert('❌ Помилка: ' + (errorData.error || 'Невідомо'))
        return
      }

      alert('✅ Успішно зареєстровано!')
      navigate('/login')
    } catch (error) {
      alert('❌ Сервер недоступний 😢')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Реєстрація</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />

      <button type="submit">Зареєструватись</button>
    </form>
  )
}
