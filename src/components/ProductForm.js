import React, { useState } from 'react';
import { createProduct } from '../services/ProductApi';

const ProductForm = ({ onProductCreated }) => {
    const [form, setForm] = useState({
        name: '',
        category: '',
        stock: 0,
        price: 0,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createProduct(form);
        onProductCreated(); // Refresh list
        setForm({ name: '', category: '', stock: 0, price: 0 });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Product</h2>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default ProductForm;