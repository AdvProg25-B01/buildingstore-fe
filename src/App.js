// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import KasirDashboard from './pages/KasirDashboard';
import CreateUser from './pages/CreateUser';
import LandingPage from './pages/LandingPage';
import CustomerManagementPage from './pages/CustomerManagementPage'; // <-- 1. IMPORT HALAMAN BARU ANDA

function App() {
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Khusus ADMIN */}
        {userRole === 'ADMIN' && (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-user" element={<CreateUser />} />
            {/* Manajemen Pelanggan untuk Admin bisa juga ditaruh di sini jika path-nya berbeda,
                tapi karena bisa diakses Kasir juga, kita buat satu rute bersama di bawah. */}
          </>
        )}

        {/* Rute Khusus KASIR */}
        {userRole === 'KASIR' && (
          <>
            <Route path="/kasir-dashboard" element={<KasirDashboard />} />
            {/* Manajemen Pelanggan untuk Kasir bisa juga ditaruh di sini jika path-nya berbeda. */}
          </>
        )}

        {/* 👇 2. TAMBAHKAN ROUTE UNTUK MANAJEMEN PELANGGAN (DAPAT DIAKSES ADMIN & KASIR) */}
        { (userRole === 'ADMIN' || userRole === 'KASIR') && (
            <Route path="/manage-customers" element={<CustomerManagementPage />} />
            /* Anda bisa memilih path yang lebih umum, misal "/customers" atau "/pelanggan" */
        )}
        
        {/* Pertimbangkan untuk menambahkan route fallback untuk halaman tidak ditemukan (404) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;