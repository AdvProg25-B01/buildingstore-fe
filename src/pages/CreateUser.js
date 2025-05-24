import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, Shield, Save, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../services/authService';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      role: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password.trim()) {
      newErrors.password = 'Password harus diisi';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Harus mengandung huruf besar, kecil, angka, dan karakter khusus';
      isValid = false;
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role harus dipilih';
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      await authService.createUser(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.role, 
        token
      );
      
      setSuccessMessage(`User ${formData.name} berhasil dibuat dengan role ${formData.role}!`);
      setFormData({ name: '', email: '', password: '', role: '' });
    } catch (error) {
      setErrorMessage(error.message || 'Gagal membuat user. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      'ADMIN': 'Administrator',
      'KASIR': 'Kasir'
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <UserPlus className="text-blue-700 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-blue-900">Buat User Baru</h1>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
              <CheckCircle className="mr-2" size={20} />
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <div onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="mr-2" size={16} />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    fieldErrors.name ? 'border-red-400' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="mr-2" size={16} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    fieldErrors.email ? 'border-red-400' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="contoh@email.com"
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="mr-2" size={16} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    fieldErrors.password ? 'border-red-400' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Minimal 8 karakter"
                  disabled={loading}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Password minimal 8 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus
                </p>
              </div>

              {/* Role Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Shield className="mr-2" size={16} />
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    fieldErrors.role ? 'border-red-400' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  disabled={loading}
                >
                  <option value="">Pilih Role</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="KASIR">Kasir</option>
                </select>
                {fieldErrors.role && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.role}</p>
                )}
              </div>
            </div>

            {/* Form Summary */}
            {(formData.name || formData.email || formData.role) && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Preview User:</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  {formData.name && <p><strong>Nama:</strong> {formData.name}</p>}
                  {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
                  {formData.role && <p><strong>Role:</strong> {getRoleLabel(formData.role)}</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setFormData({ name: '', email: '', password: '', role: '' })}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Reset Form
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.email || !formData.password || !formData.role}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors"
              >
                <Save className="mr-2" size={16} />
                {loading ? 'Membuat User...' : 'Buat User'}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Informasi Role:</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start">
                <Shield className="mr-2 mt-0.5 text-blue-500" size={12} />
                <div>
                  <strong>Administrator:</strong> Memiliki akses penuh ke semua sistem dan fitur.
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="mr-2 mt-0.5 text-green-500" size={12} />
                <div>
                  <strong>Kasir:</strong> Dapat mengelola transaksi penjualan, mengelola pelanggan, serta mencatat pembayaran.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
