import axios from 'axios';

const API_PRODUCT_URL = process.env.REACT_APP_API_TRANSACTION_URL || 'http://localhost:8081';
const BASE_PRODUCT_URL = `${API_PRODUCT_URL}/product`;

export const getAllProducts = () => axios.get(`${BASE_PRODUCT_URL}/list`);
export const getProductByName = (name) => axios.get(`${BASE_PRODUCT_URL}/${name}`);
export const createProduct = (data) => axios.post(`${BASE_PRODUCT_URL}/create`, data);
export const updateProduct = (name, data) => axios.put(`${BASE_PRODUCT_URL}/edit/${name}`, data);
export const deleteProduct = (name) => axios.delete(`${BASE_PRODUCT_URL}/delete/${name}`);