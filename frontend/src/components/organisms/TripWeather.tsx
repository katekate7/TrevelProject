import React from 'react'

type Props = {
  tripId: string
}

export default function TripWeather({ tripId }: Props) {
  return (
    <section>
      <h3>🌦 Погода</h3>
      <p>[Погода для цієї подорожі]</p>
    </section>
  )
}
