import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FirstTripPage from './pages/FirstTripPage';
import TripsListPage from './pages/TripsListPage';
import CityPage from './pages/CityPage';
import TripDetailPage from './pages/TripDetailPage';
import WeatherPage from './pages/WeatherPage';
import SightseeingsPage from './pages/SightseeingsPage';
import TripRoutePage from './pages/TripRoutePage';
import AdminPage   from './pages/AdminPage';
import ItemsPage   from './pages/ItemsPage';
import HomePage from './pages/HomePage'


export default function App() {
  return (
    <Routes>
      <Route path="/start" element={<Home />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/first-trip" element={<FirstTripPage />} />
      <Route path="/trips" element={<TripsListPage />} />
      <Route path="/city/:city/:country" element={<CityPage />} />
      <Route path="/trip/:id" element={<TripDetailPage />} />
      <Route path="/trip/:id/weather" element={<WeatherPage />} />
      <Route path="/trip/:id/sightseeings" element={<SightseeingsPage />} />
      <Route path="/trip/:id/route" element={<TripRoutePage />} />
      <Route path="/trip/:id/items" element={<ItemsPage   />} />
    </Routes>
  );
}
