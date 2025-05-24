// src/services/customerService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/customers';

// Fungsi untuk mendapatkan semua pelanggan atau search
// GET /api/customers
// GET /api/customers?searchTerm=...&searchBy=...
const getAllCustomers = (searchTerm = '', searchBy = '') => {
    let url = API_URL;
    if (searchTerm && searchBy) {
        url += `?searchTerm=${encodeURIComponent(searchTerm)}&searchBy=${encodeURIComponent(searchBy)}`;
    }
    return axios.get(url);
};

// Fungsi untuk mendapatkan pelanggan by ID
// GET /api/customers/{id}
const getCustomerById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// Fungsi untuk membuat pelanggan baru
// POST /api/customers
// Data yang dikirim harus sesuai CreateCustomerRequestDTO
const createCustomer = (customerData) => {
    // customerData = { fullName: "...", phoneNumber: "...", email: "...", address: "..." }
    return axios.post(API_URL, customerData);
};

// Fungsi untuk update pelanggan
// PUT /api/customers/{id}
// Data yang dikirim harus sesuai UpdateCustomerRequestDTO
const updateCustomer = (id, customerData) => {
    return axios.put(`${API_URL}/${id}`, customerData);
};

// Fungsi untuk menghapus pelanggan
// DELETE /api/customers/{id}
const deleteCustomer = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Export semua fungsi agar bisa dipakai di komponen lain
const customerService = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};

export default customerService;