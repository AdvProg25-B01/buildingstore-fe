// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar           from './components/Navbar';
import Footer           from './components/Footer';
import LandingPage      from './pages/LandingPage';
import Login            from './pages/Login';
import Register         from './pages/Register';
import AdminDashboard   from './pages/AdminDashboard';
import KasirDashboard   from './pages/KasirDashboard';
import CreateUser       from './pages/CreateUser';
import ProtectedRoute   from './components/ProtectedRoute';
import PaymentPage      from './Payment/pages/PaymentPage'
import CreatePaymentPage from "./Payment/pages/CreatePaymentPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin-only */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CreateUser />
            </ProtectedRoute>
          }
        />

        {/* Kasir-only */}
        <Route
          path="/kasir-dashboard"
          element={
            <ProtectedRoute allowedRoles={['KASIR']}>
              <KasirDashboard />
            </ProtectedRoute>
          }
        />

          <Route
              path="/payment"
              element={
                  <ProtectedRoute allowedRoles={['KASIR', 'ADMIN']}>
                      <PaymentPage />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/payment/create"
              element={
                  <ProtectedRoute allowedRoles={['KASIR', 'ADMIN']}>
                      <CreatePaymentPage />
                  </ProtectedRoute>
              }
          />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
