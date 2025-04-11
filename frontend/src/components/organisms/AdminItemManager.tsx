import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AdminItemManager.css'

type Item = {
  id: number
  name: string
}

export default function AdminItemManager() {
  const [items, setItems] = useState<Item[]>([])
  const [newItem, setNewItem] = useState('')
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editedName, setEditedName] = useState('')

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/items', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setItems(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleAddItem = async () => {
    if (!newItem.trim()) return

    try {
      await axios.post(
        'http://localhost:8000/api/admin/items',
        { name: newItem },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setNewItem('')
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditItem = async () => {
    if (!editedName.trim() || editingItemId === null) return

    try {
      await axios.patch(
        `http://localhost:8000/api/admin/items/${editingItemId}`,
        { name: editedName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setEditingItemId(null)
      setEditedName('')
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="admin-panel">
      <h3>Глобальні речі</h3>

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="item-row">
            {editingItemId === item.id ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Нова назва"
                />
                <button className="save-btn" onClick={handleEditItem}>💾 Зберегти</button>
                <button className="cancel-btn" onClick={() => setEditingItemId(null)}>❌ Скасувати</button>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <button className="edit-btn" onClick={() => {
                  setEditingItemId(item.id)
                  setEditedName(item.name)
                }}>✏️ Редагувати</button>
                <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>🗑️ Видалити</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="add-item-form">
        <input
          type="text"
          placeholder="Нова річ"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button className="add-btn" onClick={handleAddItem}>➕ Додати</button>
      </div>
    </div>
  )
}
