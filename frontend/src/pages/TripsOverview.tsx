import React from 'react'
import TripsList from '../components/organisms/TripsList'

export default function TripsOverview() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Мої подорожі</h2>
      <TripsList />
    </div>
  )
}
