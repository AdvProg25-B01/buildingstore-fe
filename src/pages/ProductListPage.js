import React from 'react';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
    return (
        <div>
            <h1>Product List</h1>
            <Link to="/create">
                <button>Add New Product</button>
            </Link>
            <ProductList />
        </div>
    );
};

export default ProductListPage;