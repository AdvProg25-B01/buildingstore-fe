import React, { useEffect, useState } from 'react';
import { getProductByName, updateProduct } from '../services/ProductApi';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Package, ArrowLeft, Save, AlertCircle } from 'lucide-react';

const ProductEditPage = () => {
    // Rename 'name' from useParams to avoid confusion with product.name
    const { name: originalProductNameFromUrl } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [productId, setProductId] = useState(null); // <-- NEW STATE FOR PRODUCT ID
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch product by its original name from the URL
        getProductByName(originalProductNameFromUrl)
            .then((res) => {
                setProduct(res.data);
                setProductId(res.data.id); // <-- Store the actual product ID from the response
                setLoading(false);
            })
            .catch(() => {
                setError("Product not found");
                setLoading(false);
            });
    }, [originalProductNameFromUrl]); // Re-run effect if URL name changes

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(''); // Clear any previous error messages

        if (!productId) { // Safety check: ensure we have an ID to update
            setError("Product ID is missing. Cannot update.");
            setSaving(false);
            return;
        }

        try {
            // Call updateProduct with the immutable productId, and the full product object (which now contains the potentially new name)
            await updateProduct(productId, product);
            navigate('/product/list'); // Redirect to home/list page on success
        } catch (err) {
            console.error("Update failed:", err.response?.data || err.message); // Log full error
            setError(err.response?.data?.message || "Update failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleGoBack = () => {
        navigate('/');
    };

    // ... rest of your JSX remains largely the same ...
    // Your current JSX already uses `product.name`, `product.category`, etc.,
    // which are correctly updated by `handleChange`
    // The loading/error/main form structure is fine.
    // Make sure the input for name still uses `name="name"` and `value={product.name}`
    // which it already does.

    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center text-blue-100 hover:text-white transition-colors duration-200 mr-4"
                        >
                            <ArrowLeft size={20} className="mr-1" />
                            Back to Products
                        </button>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-blue-600 rounded-full p-3 mr-4">
                            <Edit className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Edit Product</h1>
                            <p className="text-blue-100 mt-2">Update product information</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 rounded-full p-3 mr-4">
                                    <Package className="text-blue-700" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-blue-900">Product Information</h2>
                                    <p className="text-gray-600 mt-1">Update the product details below</p>
                                </div>
                            </div>

                            {/* Render form only if product data is available */}
                            {product && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-blue-900 mb-2">
                                                Product Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={product.name} // This will reflect new name from state
                                                onChange={handleChange}
                                                placeholder="Enter product name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-blue-900 mb-2">
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={product.category}
                                                onChange={handleChange}
                                                placeholder="Enter product category"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-blue-900 mb-2">
                                                Stock Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={product.stock}
                                                onChange={handleChange}
                                                placeholder="Enter stock quantity"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-blue-900 mb-2">
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={product.price}
                                                onChange={handleChange}
                                                placeholder="Enter product price"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                                            <AlertCircle className="text-red-500 mr-3" size={20} />
                                            <span className="text-red-700">{error}</span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={handleGoBack}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center disabled:opacity-50"
                                        >
                                            <Save size={20} className="mr-2" />
                                            {saving ? 'Updating...' : 'Update Product'}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {/* If product is null but not loading, show error */}
                            {!product && !loading && error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center justify-center">
                                    <AlertCircle className="text-red-500 mr-3" size={24} />
                                    <span className="text-red-700 text-lg">{error}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductEditPage;