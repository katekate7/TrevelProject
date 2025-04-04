import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Trip = {
  id: number
  name: string
}

export default function TripsList() {
  const [trips, setTrips] = useState<Trip[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/trips', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) throw new Error('Помилка при завантаженні подорожей')

        const data = await response.json()
        setTrips(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTrips()
  }, [])

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {trips.map((trip) => (
          <li key={trip.id}>
            <button
              onClick={() => navigate(`/trip/${trip.id}/dashboard`)}
              style={{ margin: '5px 0' }}
            >
              {trip.name}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/create-trip')}>➕ Додати нову подорож</button>
    </div>
  )
}
