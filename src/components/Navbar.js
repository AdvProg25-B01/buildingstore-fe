import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>

        {!token && (
          <>
            <li>
              <Link to="/login" style={styles.link}>Login</Link>
            </li>
            <li>
              <Link to="/register" style={styles.link}>Register</Link>
            </li>
          </>
        )}

        {token && role === 'ADMIN' && (
          <>
            <li>
              <Link to="/create-user" style={styles.link}>Create New User</Link>
            </li>
            <li>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </li>
          </>
        )}

        {token && role === 'KASIR' && (
          <li>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '10px',
    backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #ccc'
  },
  ul: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    padding: 0,
    margin: 0
  },
  link: {
    textDecoration: 'none',
    color: '#333'
  },
  button: {
    background: 'none',
    border: 'none',
    color: '#333',
    cursor: 'pointer',
    padding: 0,
    fontSize: '1em'
  }
};

export default Navbar;
