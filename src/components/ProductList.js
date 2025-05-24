import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../services/ProductApi';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const res = await getAllProducts();
        setProducts(res.data);
    };

    const handleDelete = async (name) => {
        await deleteProduct(name);
        loadProducts();
    };

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map((p) => (
                    <li key={p.id}>
                        {p.name} - {p.category} - {p.stock} - ${p.price}
                        <button onClick={() => handleDelete(p.name)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;