import React, { useState } from 'react';
import { getProductById } from '../services/ProductApi';

const ProductByIdPage = () => {
    const [id, setId] = useState('');
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            const res = await getProductById(id);
            setProduct(res.data);
            setError('');
        } catch (err) {
            setProduct(null);
            setError('Product not found');
        }
    };

    return (
        <div>
            <h2>Find Product by ID</h2>
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter ID" />
            <button onClick={handleSearch}>Search</button>
            {product && (
                <div>
                    <p>Name: {product.name}</p>
                    <p>Category: {product.category}</p>
                    <p>Stock: {product.stock}</p>
                    <p>Price: {product.price}</p>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ProductByIdPage;