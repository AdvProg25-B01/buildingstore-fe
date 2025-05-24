import axios from 'axios';

const BASE_URL = 'http://localhost:8080/product';

export const getAllProducts = () => axios.get(`${BASE_URL}/list`);
export const getProductByName = (name) => axios.get(`${BASE_URL}/${name}`);
export const createProduct = (data) => axios.post(`${BASE_URL}/create`, data);
export const updateProduct = (name, data) => axios.put(`${BASE_URL}/edit/${name}`, data);
export const deleteProduct = (name) => axios.delete(`${BASE_URL}/delete/${name}`);