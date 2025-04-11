import { useState } from "react"
import axios from "axios"

const ItemForm = () => {
  const [name, setName] = useState("")

  const handleAdd = async () => {
    await axios.post("/api/admin/items", { name })
    alert("Річ додано")
  }

  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Назва речі" />
      <button onClick={handleAdd}>Додати</button>
    </div>
  )
}

export default ItemForm
