import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FirstTripPage from './pages/FirstTripPage';
import TripsListPage from './pages/TripsListPage';
import CityPage       from './pages/CityPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/first-trip" element={<FirstTripPage />} />
      <Route path="/trips" element={<TripsListPage />} />
      <Route path="/city"        element={<CityPage />} />
    </Routes>
  );
}
