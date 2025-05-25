import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';
import { User, Mail, Shield, Lock, CheckCircle,AlertCircle,Eye,EyeOff
} from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
        try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            setMessage({ type: 'error', text: 'You are not logged in' });
            setLoading(false);
            return;
        }

        const response = await AuthService.getProfile(token);
        setProfile(response.data);
        } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
        } finally {
        setLoading(false);
        }
    };

    fetchProfile();
    }, []);


  const handlePasswordChange = async () => {
    try {
        setUpdating(true);
        
        // Validate password form
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setMessage({ type: 'error', text: 'All password fields are required' });
        return;
        }
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
        }
        
        if (passwordForm.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
        return;
        }

        // Get user email from profile and token from localStorage
        const userEmail = profile.email; // Use profile email instead of user.email
        const token = localStorage.getItem('token');
        
        if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found. Please log in again.' });
        return;
        }

        if (!userEmail) {
        setMessage({ type: 'error', text: 'User email not found. Please refresh and try again.' });
        return;
        }

        // Make the actual API call
        const response = await AuthService.changePassword(
        userEmail,
        passwordForm.currentPassword,
        passwordForm.newPassword,
        token
        );
        
        // Success - reset form and show success message
        setShowPasswordForm(false);
        setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
        });
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        
    } catch (error) {
        // Handle different types of errors
        let errorMessage = 'Failed to change password';
        
        if (error.response) {
        // Server responded with error status
        if (error.response.status === 400) {
            errorMessage = error.response.data.message || 'Invalid request data';
        } else if (error.response.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.response.status === 403) {
            errorMessage = 'Old password is incorrect';
        } else {
            errorMessage = error.response.data.message || 'Server error occurred';
        }
        } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
        }
        
        setMessage({ type: 'error', text: errorMessage });
    } finally {
        setUpdating(false);
    }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'KASIR':
        return 'Kasir';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-blue-200 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-blue-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-blue-200 rounded w-1/2 mx-auto"></div>
              <div className="h-8 bg-blue-200 rounded w-full"></div>
              <div className="h-8 bg-blue-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile.name || "Admin"}</h2>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 border-b ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  {message.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* Profile Information */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-blue-900">Profile Information</h3>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                    {profile.name || "Admin"}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                    {profile.email}
                  </div>
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    <Shield size={16} className="inline mr-2" />
                    Role
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {getRoleDisplayName(profile.role)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-lg shadow-md border border-blue-100 mt-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-900">Change Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setMessage({ type: '', text: '' });
                    if (showPasswordForm) {
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors duration-300"
                  disabled={updating}
                >
                  <Lock size={16} />
                  <span>{showPasswordForm ? 'Cancel' : 'Change Password'}</span>
                </button>
              </div>

              {showPasswordForm && (
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={updating}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    {updating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
