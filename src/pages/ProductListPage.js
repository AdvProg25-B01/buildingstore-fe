import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Search } from 'lucide-react';

const ProductListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Navigate to edit page with the searched product name
            navigate(`/product/edit/${encodeURIComponent(searchTerm.trim())}`); // <--- CHANGED HERE
        }
    };

    // const handleQuickSearch = () => { // This function seems unused, consider removing if not needed
    //     navigate('/search');
    // };

    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
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
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            {/* Quick Search Form */}
                            <form onSubmit={handleSearchSubmit} className="flex">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Enter product name to edit..."
                                    className="w-72 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
                                className="bg-white text-blue-800 hover:bg-blue-100 font-semibold px-4 py-2 rounded-lg transition duration-300 flex items-center shadow-lg"
                            >
                                <Plus size={20} className="mr-2"/>
                                Add New Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Section (Content unchanged) */}
            <div className="bg-white py-6 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* ... stats ... */}
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
                    <div className="bg-white rounded-lg shadow-lg">
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
                                        to="/product/create" // <--- ALSO CHANGED THIS for consistency and absolute path
                                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 flex items-center"
                                    >
                                        <Plus size={20} className="mr-1" />
                                        Add
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Product List Component */}
                        <div className="p-6">
                            <ProductList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;