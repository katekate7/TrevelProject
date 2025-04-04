import React from 'react'
import { useParams } from 'react-router-dom'
import TripItems from '../components/organisms/TripItems'
import TripWeather from '../components/organisms/TripWeather'
import TripRoute from '../components/organisms/TripRoute'

export default function TripDashboard() {
  const { id } = useParams()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Дашборд подорожі #{id}</h2>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <TripItems tripId={id as string} />
        </div>
        <div style={{ flex: 1 }}>
          <TripWeather tripId={id as string} />
        </div>
        <div style={{ flex: 1 }}>
          <TripRoute tripId={id as string} />
        </div>
      </div>
    </div>
  )
}
