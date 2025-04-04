import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateTripForm() {
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !destination || !startDate || !endDate) {
      setError('Будь ласка, заповніть усі поля.')
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('Дата завершення не може бути раніше за дату початку.')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name,
          destination,
          startDate,
          endDate,
        }),
      })

      if (!response.ok) {
        throw new Error('Не вдалося створити подорож.')
      }

      const data = await response.json()
      const tripId = data.id // або data.trip.id — залежно від API

      navigate(`/trip/${tripId}/dashboard`)
    } catch (err) {
      console.error(err)
      setError('Сталася помилка при створенні подорожі.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Назва подорожі"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Місто призначення"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <br />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <br />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <br />
      <button type="submit">Створити подорож</button>
    </form>
  )
}
