import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('KASIR');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    
    const validatePassword = () => {
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one special characters, and one number');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validatePassword()) {
            return;
        }
        
        try {
            const response = await authService.register(name, email, password, role);
            
            navigate('/login');
            alert('Registration successful! Please login with your credentials.');
        } catch (error) {
            setErrorMessage('Registration failed! Please try again.');
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-100 rounded-full p-3 mb-4">
                        <Users size={40} className="text-blue-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-blue-900">Register</h2>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center" role="alert">
                        <AlertCircle size={18} className="mr-2" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-blue-900 mb-2">
                            Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-blue-600" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 block w-full py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-blue-600" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 block w-full py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-blue-600" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (confirmPassword) validatePassword();
                                }}
                                onBlur={validatePassword}
                                className={`pl-10 block w-full py-3 border ${
                                    passwordError ? 'border-red-400' : 'border-blue-200'
                                } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {passwordError && (
                            <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-blue-600" />
                            </div>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (password) validatePassword();
                                }}
                                onBlur={validatePassword}
                                className={`pl-10 block w-full py-3 border ${
                                    passwordError ? 'border-red-400' : 'border-blue-200'
                                } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {passwordError && (
                            <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-blue-900 mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="block w-full py-3 px-4 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="KASIR">Kasir</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-900 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Register
                    </button>
                </form>
                
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-700 hover:text-blue-800 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
