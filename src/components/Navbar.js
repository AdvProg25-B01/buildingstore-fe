import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };
  
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-between">
          <li className="flex items-center">
            <Store className="text-blue-300 mr-2" size={24} />
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
                    Manajemen Transaksi
                  </Link>
                </li>

                <li>
                  <Link to="/product/list" className="text-white hover:text-blue-200 transition duration-300">
                    Manajemen Produk
                  </Link>
                </li>

                <li>
                  <Link to="/create-user" className="text-white hover:text-blue-200 transition duration-300">
                    Create New User
                  </Link>
                </li>
                
                <li>
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Logout
                  </button>
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
                    Manajemen Transaksi
                  </Link>
                </li>

                <li>
                  <button
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
