import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingCart, Package, CreditCard, Truck, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Product Management",
      description: "Add, edit, or remove products from inventory",
      icon: Package,
      link: "/product/list",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Transaction Management",
      description: "Create and monitor all sales transactions and payments",
      icon: ShoppingCart,
      link: "/manajemen-transaksi",
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Customer Management",
      description: "Manage customer data and purchase history",
      icon: Users,
      link: "/manage-customers",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Supplier Management",
      description: "Handle supplier information and orders",
      icon: Truck,
      link: "/suppliers",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    },
    {
      title: "Payment Management",
      description: "Track payments and installment status",
      icon: CreditCard,
      link: "/payment",
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50">

      <div className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome back, Admin!</h2>
          <p className="text-blue-700">Here's what's happening with your building store today.</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`${action.color} p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer`}
                onClick={() => navigate(action.link)}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <action.icon className="text-blue-700" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">{action.title}</h4>
                    <p className="text-sm text-blue-700">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">User Management</h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create New User</span>
            </Link>
            <Link 
              to="/"
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <Users size={20} />
              <span>Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
