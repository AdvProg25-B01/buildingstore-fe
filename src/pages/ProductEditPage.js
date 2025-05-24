import React, { useEffect, useState } from 'react';
import { getProductByName, updateProduct } from '../services/ProductApi';
import { useParams, useNavigate } from 'react-router-dom';

const ProductEditPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getProductByName(name)
            .then((res) => setProduct(res.data))
            .catch(() => setError("Product not found"));
    }, [name]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(name, product);
            navigate('/');
        } catch (err) {
            setError("Update failed");
        }
    };

    if (!product) return <div>{error || "Loading..."}</div>;

    return (
        <div>
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" value={product.name} onChange={handleChange} placeholder="Name" />
                <input name="category" value={product.category} onChange={handleChange} placeholder="Category" />
                <input name="stock" value={product.stock} onChange={handleChange} type="number" placeholder="Stock" />
                <input name="price" value={product.price} onChange={handleChange} type="number" placeholder="Price" />
                <button type="submit">Update</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ProductEditPage;