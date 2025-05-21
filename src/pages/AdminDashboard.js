import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      <Link to="/create-user">Create New User</Link>
    </div>
  );
};

export default AdminDashboard;
