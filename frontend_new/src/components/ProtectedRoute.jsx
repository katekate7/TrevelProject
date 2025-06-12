// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

export default function ProtectedRoute({ children }) {
  // перевіримо, чи є токен у axios-defaults
  const authHeader = api.defaults.headers.common.Authorization;
  const hasToken = typeof authHeader === 'string' && authHeader.startsWith('Bearer ');

  if (!hasToken) {
    // якщо нема токена — редіректимо на логін
    return <Navigate to="/" replace />;
  }

  return children;
}
