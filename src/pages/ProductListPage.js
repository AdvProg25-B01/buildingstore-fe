import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Search, Edit, Trash2, AlertCircle, Check } from 'lucide-react';
import { getAllProducts, deleteProduct, getSupplierForProduct } from '../services/ProductApi';
import supplierService from '../services/supplierService';

const ProductListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [supplierMap, setSupplierMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch all suppliers and create a map for quick lookup
    const fetchSuppliers = async () => {
        try {
            const suppliers = await supplierService.getAllSuppliers();
            const mapping = {};
            suppliers.forEach(supplier => {
                mapping[supplier.id] = supplier;
            });
            setSupplierMap(mapping);
            return mapping;
        } catch (err) {
            console.error('Error fetching suppliers:', err);
            return {};
        }
    };

    // Fetch products and enhance with supplier data
    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Get supplier map for lookup
            const supplierMapping = await fetchSuppliers();
            
            // Get products
            const response = await getAllProducts();
            const productsData = response.data || [];
            
            // Enhance products with supplier information
            const enhancedProducts = await Promise.all(productsData.map(async (product) => {
                if (product.supplierId) {
                    // If supplier map has this supplier, use it
                    if (supplierMapping[product.supplierId]) {
                        return {
                            ...product,
                            supplier: supplierMapping[product.supplierId]
                        };
                    }
                    
                    // Otherwise try to fetch supplier specifically for this product
                    try {
                        const supplierResponse = await getSupplierForProduct(product.id);
                        if (supplierResponse && supplierResponse.data) {
                            return {
                                ...product,
                                supplier: supplierResponse.data
                            };
                        }
                    } catch (err) {
                        console.warn(`Could not fetch supplier for product ${product.name}`);
                    }
                }
                return product;
            }));
            
            setProducts(enhancedProducts);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/product/edit/${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleDeleteProduct = async (name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteProduct(name);
                setDeleteMessage({ type: 'success', text: `Product "${name}" successfully deleted.` });
                fetchProducts(); // Refresh product list
            } catch (err) {
                console.error('Error deleting product:', err);
                setDeleteMessage({ type: 'error', text: `Failed to delete "${name}". Please try again.` });
            }

            // Clear message after 3 seconds
            setTimeout(() => {
                setDeleteMessage(null);
            }, 3000);
        }
    };

    // Helper function to determine if a product has a supplier
    const getSupplierInfo = (product) => {
        // If product already has supplier data
        if (product.supplier && product.supplier.name) {
            return product.supplier;
        }
        
        // If product has supplierId and we have that supplier in our map
        if (product.supplierId && supplierMap[product.supplierId]) {
            return supplierMap[product.supplierId];
        }
        
        // No supplier info available
        return null;
    };

    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center">
                            <div className="bg-blue-600 rounded-full p-3 mr-4">
                                <Package className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Product Management</h1>
                                <p className="text-blue-100 mt-2">Manage your inventory and product catalog</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Quick Search Form */}
                            <form onSubmit={handleSearchSubmit} className="flex">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Enter product name to edit..."
                                    className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-r-lg transition duration-300 flex items-center flex-shrink-0"
                                >
                                    <Search size={16}/>
                                </button>
                            </form>
                            <Link
                                to="/product/create"
                                className="bg-white text-blue-800 hover:bg-blue-100 font-semibold px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center shadow-lg"
                            >
                                <Plus size={20} className="mr-2"/>
                                Add New Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Section */}
            <div className="bg-white py-6 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <div className="bg-blue-100 rounded-full p-2 mr-3">
                                    <Package className="text-blue-700" size={20}/>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-blue-900">Total Products</h3>
                                    <p className="text-2xl font-bold text-blue-700">--</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <div className="bg-green-100 rounded-full p-2 mr-3">
                                    <Package className="text-green-700" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-green-900">In Stock</h3>
                                    <p className="text-2xl font-bold text-green-700">--</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 rounded-full p-2 mr-3">
                                    <Package className="text-yellow-700" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-yellow-900">Low Stock</h3>
                                    <p className="text-2xl font-bold text-yellow-700">--</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <div className="bg-red-100 rounded-full p-2 mr-3">
                                    <Package className="text-red-700" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-red-900">Out of Stock</h3>
                                    <p className="text-2xl font-bold text-red-700">--</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Status Messages */}
                        {deleteMessage && (
                            <div className={`p-4 ${deleteMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center`}>
                                {deleteMessage.type === 'success' ? (
                                    <Check className="mr-2" size={18} />
                                ) : (
                                    <AlertCircle className="mr-2" size={18} />
                                )}
                                {deleteMessage.text}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-100 text-red-800 flex items-center">
                                <AlertCircle className="mr-2" size={18} />
                                {error}
                            </div>
                        )}

                        {/* Table Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-blue-900">Product List</h2>
                                    <p className="text-gray-600 mt-1">View and manage all your products</p>
                                </div>

                                {/* Mobile Add Button */}
                                <div className="md:hidden">
                                    <Link
                                        to="/product/create"
                                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 flex items-center"
                                    >
                                        <Plus size={20} className="mr-1" />
                                        Add
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="py-8 text-center text-gray-500">Loading products...</div>
                            ) : products.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Supplier
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => {
                                            const supplierInfo = getSupplierInfo(product);
                                            
                                            return (
                                                <tr key={product.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{product.category}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${parseInt(product.stock) > 10 ? 'bg-green-100 text-green-800' : 
                                                              parseInt(product.stock) > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                                              'bg-red-100 text-red-800'}`}>
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        Rp {parseFloat(product.price).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {supplierInfo ? (
                                                            <div>
                                                                <div className="font-medium">{supplierInfo.name}</div>
                                                                <div className="text-gray-500 text-xs">{supplierInfo.phoneNumber}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 italic">No supplier</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-3">
                                                            <Link 
                                                                to={`/product/edit/${encodeURIComponent(product.name)}`}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit size={18} />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product.name)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    No products found. Start by adding a new product!
                                </div>
                            )}
                        </div>

                        {/* Pagination could be added here */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{products.length}</span> products
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;