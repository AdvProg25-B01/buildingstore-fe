import ProductListPage from "./pages/ProductListPage";

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
import ProductByIdPage from './pages/ProductByIdPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProductListPage />} />
        <Route path="/create" element={<ProductCreatePage />} />
        <Route path="/edit/:name" element={<ProductEditPage />} />
        <Route path="/findById" element={<ProductByIdPage />} />
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;