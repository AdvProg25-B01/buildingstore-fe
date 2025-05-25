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
import PaymentPage      from './Payment/pages/PaymentPage'
import CreatePaymentPage from "./Payment/pages/CreatePaymentPage";
import UpdatePaymentStatusPage from "./Payment/pages/UpdatePaymentStatusPage";
import PaymentHistoryPage from "./Payment/pages/PaymentHistoryPage";
import ProfilePage from './pages/Profile';

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

            <Route
                path="/payment/update/:paymentId"
                element={
                    <ProtectedRoute allowedRoles={['KASIR', 'ADMIN']}>
                        <UpdatePaymentStatusPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payment/history"
                element={
                    <ProtectedRoute allowedRoles={['KASIR', 'ADMIN']}>
                        <PaymentHistoryPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={['KASIR', 'ADMIN']}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;