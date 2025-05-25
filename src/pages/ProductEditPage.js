import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByName, updateProduct } from '../services/ProductApi';
import SupplierAssignment from '../components/SupplierAssignment';

const ProductEditPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: '',
    stock: 0,
    price: 0,
  });
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
        try {
        const response = await getProductByName(name);
        const productData = response.data;
        
        setProduct(productData);
        setForm({
            id: productData.id,  // Include the ID from the response
            name: productData.name || '',
            category: productData.category || '',
            stock: productData.stock || 0,
            price: productData.price || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchProduct();
    }
  }, [name]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProduct(name, form);
      setUpdateMessage({ type: 'success', text: 'Product updated successfully!' });
      // Refresh product data
      const response = await getProductByName(form.name);
      setProduct(response.data);
    } catch (err) {
      console.error('Error updating product:', err);
      setUpdateMessage({ type: 'error', text: 'Failed to update product. Please try again.' });
    } finally {
      setLoading(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setUpdateMessage(null);
    }, 3000);
  };

  const handleProductUpdate = async () => {
    // Refresh product data after supplier assignment changes
    try {
      const response = await getProductByName(name);
      setProduct(response.data);
    } catch (err) {
      console.error('Error refreshing product data:', err);
    }
  };

  if (loading && !product) {
    return <div className="container mx-auto px-4 py-8">Loading product details...</div>;
  }

  if (error && !product) {
    return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        {updateMessage && (
          <div className={`mb-4 p-3 rounded-md ${
            updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {updateMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/product/list')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Supplier Assignment Section */}
        {product && (
          <SupplierAssignment product={product} onUpdate={handleProductUpdate} />
        )}
      </div>
    </div>
  );
};

export default ProductEditPage;