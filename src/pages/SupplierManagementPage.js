import React, { useState, useEffect } from 'react';
import { X, Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import supplierService from '../services/supplierService';
import { getProductsBySupplier } from '../services/ProductApi';

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

  // Products modal state
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

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

const handleViewProducts = async (supplier) => {
  setSelectedSupplier(supplier);
  setShowProductsModal(true);
  setLoadingProducts(true);
  
  try {
    // Using our workaround function that filters products client-side
    const response = await getProductsBySupplier(supplier.id);
    setSupplierProducts(response.data || []);
    
    // If no products were found through the filter, show an appropriate message
    if (response.data.length === 0) {
      console.log(`No products found for supplier: ${supplier.name}`);
    }
  } catch (err) {
    console.error('Error fetching supplier products:', err);
  } finally {
    setLoadingProducts(false);
  }
};

  const closeProductsModal = () => {
    setShowProductsModal(false);
    setSelectedSupplier(null);
    setSupplierProducts([]);
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
                      onClick={() => handleViewProducts(supplier)}
                      className="text-blue-600 hover:text-blue-900 mr-3 bg-blue-100 px-3 py-1 rounded-lg flex items-center"
                    >
                      <Package className="w-4 h-4 mr-1" /> View Products
                    </button>
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

      {/* Supplier Products Modal */}
      {showProductsModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Products from {selectedSupplier.name}
              </h2>
              <button
                onClick={closeProductsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              {loadingProducts ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                </div>
              ) : supplierProducts.length > 0 ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Showing {supplierProducts.length} products supplied by {selectedSupplier.name}
                  </p>
                  
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {supplierProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${parseInt(product.stock) > 10 ? 'bg-green-100 text-green-800' : 
                                parseInt(product.stock) > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Rp {parseFloat(product.price).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link 
                              to={`/product/edit/${encodeURIComponent(product.name)}`}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <ExternalLink size={16} className="mr-1" /> View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-flex bg-blue-100 rounded-full p-3 mb-4">
                    <Package className="text-blue-700" size={32} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-500">
                    This supplier doesn't have any products assigned yet.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeProductsModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagementPage;