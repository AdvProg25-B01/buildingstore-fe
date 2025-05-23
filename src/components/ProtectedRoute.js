// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, children }) {
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
