import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function CreateAdminForm() {
  const user = useSelector(state => state.auth.user);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  if (!user?.roles.includes("ROLE_ADMIN")) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/users/create-admin", form, {
        withCredentials: true,
      });
      setMessage(`✅ Створено адміна: ${res.data.admin.username}`);
    } catch (err) {
      setMessage("❌ Помилка: " + (err.response?.data?.error || "невідома"));
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Створити нового адміна</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} type="email" required />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} type="password" required />
        <button type="submit" className="bg-green-600 text-white py-1 rounded hover:bg-green-700">
          ➕ Створити адміна
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-gray-800">{message}</p>}
    </div>
  );
}
