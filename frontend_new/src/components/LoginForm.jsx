import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios instance with baseURL "/api" and withCredentials=true

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      /* 1️⃣  POST /api/login  (cookie JWT створюється у браузері) */
      await api.post("/login", { email, password });

      /* 2️⃣  одразу дізнаємось ролі */
      const { data } = await api.get("/users/me"); // { roles: [ ... ] }

      /* 3️⃣  перенаправляємо */
      if (data.roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "❌ Помилка входу";
      setMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xs mx-auto">
      <h2 className="text-xl font-semibold text-center">Вхід</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
        className="border p-2 rounded"
      />

      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        Увійти
      </button>

      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
}