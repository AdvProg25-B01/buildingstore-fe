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
import CustomerManagementPage from './pages/CustomerManagementPage';

import { ToastContainer } from 'react-toastify'; // <-- Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // <-- Import CSS Toastify

function App() {
  return (
    <Router>
      <Navbar />
            <ToastContainer // <-- Tambahkan ToastContainer di sini
        position="top-right"
        autoClose={3000} // Durasi notifikasi (ms)
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // atau "light", "dark"
      />
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

        {/* 👇 2. TAMBAHKAN ROUTE UNTUK MANAJEMEN PELANGGAN DI SINI */}
        <Route
          path="/manage-customers" // Pastikan path ini SAMA dengan yang ada di <Link> Navbar
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KASIR']}> {/* Izinkan ADMIN dan KASIR */}
              <CustomerManagementPage />
            </ProtectedRoute>
          }
          />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;