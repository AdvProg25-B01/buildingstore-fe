import React from 'react';
import ProductForm from '../components/ProductForm';
import { useNavigate } from 'react-router-dom';

const ProductCreatePage = () => {
    const navigate = useNavigate();

    const handleProductCreated = () => {
        navigate('/'); // Redirect ke halaman list setelah create
    };

    return (
        <div>
            <h1>Create Product</h1>
            <ProductForm onProductCreated={handleProductCreated} />
        </div>
    );
};

export default ProductCreatePage;