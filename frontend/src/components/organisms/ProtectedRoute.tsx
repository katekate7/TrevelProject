import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/Store'; // 🔄 відносний шлях!

interface ProtectedRouteProps {
  children: React.ReactNode; // Замінено JSX.Element на React.ReactNode
  requiredRole?: 'ROLE_ADMIN' | 'ROLE_USER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>; // Рендерити children
};

export default ProtectedRoute;
