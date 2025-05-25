import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-between">
          <li className="flex items-center">
            <img
              src={require('../assets/logo/BuildingStore-StrokePutih.png')}
              alt="Logo"
              className="w-10 h-auto"
            />
            <Link to="/" className="text-white hover:text-blue-200 font-semibold transition duration-300">
              Building Store POS
            </Link>
          </li>
          
          <div className="flex space-x-6 items-center">
            {!token && (
              <>
                <li>
                  <Link to="/login" className="text-white hover:text-blue-200 transition duration-300">
                    Sign In
                  </Link>
                </li>
                
                <li>
                  <Link to="/register" className="text-white hover:text-blue-200 transition duration-300">
                    Register
                  </Link>
                </li>
              </>
            )}
            
            {token && role === 'ADMIN' && (
              <>
                <li>
                  <Link to="/admin-dashboard" className="text-white hover:text-blue-200 transition duration-300">
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link to="/manajemen-transaksi" className="text-white hover:text-blue-200 transition duration-300">
                    Transaksi
                  </Link>
                </li>

                <li>
                  <Link to="/payment" className="text-white hover:text-blue-200 transition duration-300">
                    Pembayaran
                  </Link>
                </li>

                  <li>
                    <Link to="/manage-customers" className="text-white hover:text-blue-200 transition duration-300">
                      Manajemen Pelanggan
                    </Link>
                  </li>

                <li>
                  <Link to="/payment" className="text-white hover:text-blue-200 transition duration-300">
                    Manajemen Pembayaran
                  </Link>
                </li>

                <li>
                  <Link to="/product/list" className="text-white hover:text-blue-200 transition duration-300">
                    Produk
                  </Link>
                </li>
                
                <li>
                  <Link to="/suppliers" className="text-white hover:text-blue-200 transition duration-300">
                    Manajemen Supplier
                  </Link>
                </li>

                <li>
                  <Link to="/suppliers" className="text-white hover:text-blue-200 transition duration-300">
                    Supplier
                  </Link>
                </li>

                <li>
                  <Link to="/create-user" className="text-white hover:text-blue-200 transition duration-300">
                    Create New User
                  </Link>
                </li>
              </>
            )}
            
            {token && role === 'KASIR' && (
              <>
                <li>
                  <Link to="/kasir-dashboard" className="text-white hover:text-blue-200 transition duration-300">
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link to="/manajemen-transaksi" className="text-white hover:text-blue-200 transition duration-300">
                    Transaksi
                  </Link>
                </li>

                    <li>
                    <Link to="/manage-customers" className="text-white hover:text-blue-200 transition duration-300">
                      Manajemen Pelanggan
                    </Link>
                  </li>

                <li>
                  <Link to="/payment" className="text-white hover:text-blue-200 transition duration-300">
                    Manajemen Pembayaran
                  </Link>
                </li>

                <li>
                  <Link to="/payment" className="text-white hover:text-blue-200 transition duration-300">
                    Pembayaran
                  </Link>
                </li>
              </>
            )}

            {token && (
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-white hover:text-blue-200 transition duration-300 focus:outline-none"
                >
                  <div className="bg-blue-600 p-2 rounded-full">
                    <User size={20} />
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      Profile
                    </button>
                    
                    <hr className="border-gray-200" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                    >
                      <svg 
                        className="mr-3 h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
