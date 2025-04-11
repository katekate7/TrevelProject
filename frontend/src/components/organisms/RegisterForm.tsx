import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
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
          username: username,
          email: username, // можна зробити окреме поле email, якщо хочеш
          password: password,
        }),
      })

      if (!response.ok) {
        alert('Помилка при реєстрації ❌')
        return
      }

      alert('Успішно зареєстровано! 🎉')
      navigate('/login')
    } catch (error) {
      alert('Сервер недоступний 😢')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>
      <input
        type="text"
        placeholder="Username або Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
