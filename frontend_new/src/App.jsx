import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FirstTripPage from './pages/FirstTripPage';
import TripsListPage from './pages/TripsListPage';
import CityPage from './pages/CityPage';
import TripDetailPage from './pages/TripDetailPage';
import WeatherPage from './pages/WeatherPage';



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/first-trip" element={<FirstTripPage />} />
      <Route path="/trips" element={<TripsListPage />} />
      <Route path="/city/:city/:country" element={<CityPage />} />
      <Route path="/trip/:id" element={<TripDetailPage />} />
      <Route path="/trip/:id/weather" element={<WeatherPage />} />

    </Routes>
  );
}
