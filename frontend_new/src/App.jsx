import React from 'react';
import {   BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TripLayout         from './layouts/TripLayout';


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
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      

  <Route path="trip/:id" element={<TripLayout />}>
    <Route index          element={<TripDetailPage />} />   {/* /trip/7 */}
    <Route path="weather" element={<WeatherPage />} />      {/* /trip/7/weather */}
    <Route path="sightseeings" element={<SightseeingsPage />} />
    <Route path="route"   element={<TripRoutePage />} />
    <Route path="items"   element={<ItemsPage />} />
  </Route>

    </Routes>
  );
}
