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

function App() {
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {userRole === 'ADMIN' && (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-user" element={<CreateUser />} />
          </>
        )}
        {userRole === 'KASIR' && <Route path="/kasir-dashboard" element={<KasirDashboard />} />}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
