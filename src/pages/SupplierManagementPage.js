import React, { useState, useEffect } from 'react';
import supplierService from '../services/supplierService';

const SupplierManagementPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch suppliers. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchSuppliers = async () => {
    if (!searchTerm.trim()) {
      fetchSuppliers();
      return;
    }
    
    setLoading(true);
    try {
      const data = await supplierService.searchSuppliers(searchTerm);
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError('Failed to search suppliers. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing supplier
        await supplierService.updateSupplier(editingId, formData);
      } else {
        // Create new supplier
        await supplierService.createSupplier(formData);
      }
      
      // Reset form and refresh data
      setFormData({ name: '', phoneNumber: '', address: '' });
      setEditingId(null);
      fetchSuppliers();
    } catch (err) {
      setError('Failed to save supplier. Please check your data and try again.');
      console.error(err);
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      phoneNumber: supplier.phoneNumber,
      address: supplier.address
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.deleteSupplier(id);
        fetchSuppliers();
      } catch (err) {
        setError('Failed to delete supplier.');
        console.error(err);
      }
    }
  };

  if (loading && suppliers.length === 0) {
    return <div className="flex justify-center p-4">Loading suppliers...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supplier Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span>{error}</span>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="mb-6 flex">
        <input
          type="text"
          placeholder="Search suppliers by name..."
          className="border p-2 rounded flex-grow"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button 
          onClick={searchSuppliers}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        <button 
          onClick={fetchSuppliers}
          className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Clear
        </button>
      </div>
      
      {/* Supplier Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({ name: '', phoneNumber: '', address: '' });
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingId ? 'Update Supplier' : 'Add Supplier'}
          </button>
        </div>
      </form>
      
      {/* Suppliers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.length > 0 ? (
              suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{supplier.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">No suppliers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierManagementPage;