import { Routes, Route, Navigate } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import CreateTrip from '../pages/CreateTrip'
import TripsOverview from '../pages/TripsOverview'
import TripDashboard from '../pages/TripDashboard'


const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
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

    </Routes>
  )
}
