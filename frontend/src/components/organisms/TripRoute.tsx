import React from 'react'

type Props = {
  tripId: string
}

export default function TripRoute({ tripId }: Props) {
  return (
    <section>
      <h3>📍 Маршрут</h3>
      <p>[Маршрут визначних місць]</p>
    </section>
  )
}
