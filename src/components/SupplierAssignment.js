import React, { useState, useEffect } from 'react';
import { assignSupplierToProduct, removeSupplierFromProduct } from '../services/ProductApi';
import supplierService from '../services/supplierService';

const SupplierAssignment = ({ product, onUpdate }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(product.supplierId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierData = await supplierService.getAllSuppliers();
        setSuppliers(supplierData);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setError('Failed to load suppliers. Please try again.');
      }
    };

    fetchSuppliers();
  }, []);

  const handleSupplierChange = (e) => {
    setSelectedSupplierId(e.target.value);
  };

  const handleAssignSupplier = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedSupplierId) {
        await assignSupplierToProduct(product.id, selectedSupplierId);
        setSuccess('Supplier assigned successfully');
      } else {
        await removeSupplierFromProduct(product.id);
        setSuccess('Supplier removed successfully');
      }
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error assigning/removing supplier:', err);
      setError('Failed to update supplier assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Supplier Assignment</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleAssignSupplier}>
        <div className="mb-3">
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
            Select Supplier
          </label>
          <select
            id="supplier"
            value={selectedSupplierId}
            onChange={handleSupplierChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">-- No Supplier --</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} ({supplier.phoneNumber})
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setSelectedSupplierId('')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Supplier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierAssignment;