import React, { useEffect, useState } from 'react'

type Item = {
  id: number
  name: string
  packed: boolean
}

type Props = {
  tripId: string
}

export default function TripItems({ tripId }: Props) {
  const [items, setItems] = useState<Item[]>([])

  const fetchItems = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/trip/${tripId}/items`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Помилка при завантаженні речей')

      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [tripId])

  const handleMarkPacked = async (itemId: number) => {
    try {
      await fetch(`http://localhost:8000/api/trip/${tripId}/items/${itemId}/toggle-packed`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemove = async (itemId: number) => {
    try {
      await fetch(`http://localhost:8000/api/trip/${tripId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <section>
      <h3>🧳 Речі для подорожі</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '8px' }}>
            {item.name} {item.packed && '✅'}
            <button onClick={() => handleMarkPacked(item.id)} style={{ marginLeft: '10px' }}>
              {item.packed ? 'Скасувати' : 'Позначити як зібрано'}
            </button>
            <button onClick={() => handleRemove(item.id)} style={{ marginLeft: '10px' }}>
              🗑️ Видалити
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
