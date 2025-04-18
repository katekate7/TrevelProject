import { Routes, Route, Navigate } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import CreateTrip from '../pages/CreateTrip'
import TripsOverview from '../pages/TripsOverview'
import TripDashboard from '../pages/TripDashboard'
import AdminPanel from '../pages/AdminPanel'
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode'


const getUserRole = () => {
  const token = Cookies.get('token');
  if (!token) return null;

  // Декодуємо JWT (за допомогою бібліотеки, наприклад, `jwt-decode`)
  const decodedToken = jwt_decode(token);
  return decodedToken?.role;  // Якщо токен має роль
}

const isAuthenticated = () => {
  return Cookies.get('token') !== undefined;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/create-trip"
        element={isAuthenticated() ? <CreateTrip /> : <Navigate to="/login" />}
      />
      <Route
        path="/trips"
        element={isAuthenticated() ? <TripsOverview /> : <Navigate to="/login" />}
      />

      <Route
        path="/trip/:id/dashboard"
        element={isAuthenticated() ? <TripDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={isAuthenticated() ? <AdminPanel /> : <Navigate to="/login" />}
      />

    </Routes>
  )
}
