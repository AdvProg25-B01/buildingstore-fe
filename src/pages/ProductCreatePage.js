import React from 'react';
import ProductForm from '../components/ProductForm';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';

const ProductCreatePage = () => {
    const navigate = useNavigate();

    const handleProductCreated = () => {
        navigate('/product/list'); // Redirect ke halaman list setelah create
    };

    const handleGoBack = () => {
        navigate('/product/list'); // Navigate back to product list
    };

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
                            <Package className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Create New Product</h1>
                            <p className="text-blue-100 mt-2">Add a new product to your inventory</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-blue-900 mb-2">Product Information</h2>
                                <p className="text-gray-600">Fill in the details below to create a new product in your inventory.</p>
                            </div>

                            <ProductForm onProductCreated={handleProductCreated} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCreatePage;