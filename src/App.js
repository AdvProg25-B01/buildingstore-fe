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
import ProductListPage from './pages/ProductListPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';
import TransactionManagement from './pages/transaction/TransactionManagement';
import CreateTransaction from './pages/transaction/CreateTransaction';
import TransactionHistory from './pages/transaction/TransactionHistory';
import UpdateTransaction from './pages/transaction/UpdateTransaction';
import TransactionDetail from './pages/transaction/TransactionDetail';

import CustomerManagementPage from './pages/CustomerManagementPage';

import { ToastContainer } from 'react-toastify'; // <-- Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // <-- Import CSS Toastify

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
        <Route
          path="/product/list"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ProductListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/create"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ProductCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/edit/:name"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ProductEditPage />
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
          path="/manage-customers" // Pastikan path ini SAMA dengan yang ada di <Link> Navbar
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KASIR']}> {/* Izinkan ADMIN dan KASIR */}
              <CustomerManagementPage />
            </ProtectedRoute>
          }
          />

        {/* Common for Kasir and Admin */}
        <Route
          path="/manajemen-transaksi"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KASIR']}>
              <TransactionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemen-transaksi/create"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KASIR']}>
              <CreateTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemen-transaksi/history"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KASIR']}>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemen-transaksi/detail/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KASIR']}>
              <TransactionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemen-transaksi/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KASIR']}>
              <UpdateTransaction />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;