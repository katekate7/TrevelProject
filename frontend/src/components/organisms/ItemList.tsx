import { useEffect, useState } from "react"
import axios from "axios"
import ItemForm from "../molecules/ItemForm"

const ItemList = ({ isAdmin = false }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    axios.get("/api/items").then(res => setItems(res.data))
  }, [])

  const deleteItem = async (id: number) => {
    await axios.delete(`/api/admin/items/${id}`)
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div>
      <h2>Список речей</h2>
      {isAdmin && <ItemForm />}
      <ul>
        {items.map((item: any) => (
          <li key={item.id}>
            {item.name}
            {isAdmin && (
              <>
                <button onClick={() => deleteItem(item.id)}>Видалити</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ItemList
