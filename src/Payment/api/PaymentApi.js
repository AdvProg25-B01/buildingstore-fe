import axios from 'axios';

const API_PRODUCT_URL = process.env.REACT_APP_API_PRODUCT_URL || 'http://localhost:8081';

export const createPayment = async (payment) => {
    try {
        const response = await axios.post(`${API_PRODUCT_URL}/payments`, payment);
        return response.data;
    } catch (error) {
        console.error("Create payment failed:", error);
        throw error;
    }
};

export const getPaymentsByCustomerId = async (customerId) => {
    const response = await axios.get(`${API_PRODUCT_URL}/payments/customer/${customerId}`);
    return response.data;
};

export const getPaymentById = async (paymentId) => {
    const response = await axios.get(`${API_PRODUCT_URL}/payments/${paymentId}`);
    return response.data;
};

export const updatePaymentStatus = async (paymentId, status) => {
    return axios.put(`${API_PRODUCT_URL}/payments/${paymentId}/status?status=${status}`);
};

export const deletePayment = async (paymentId) => {
    return axios.delete(`${API_PRODUCT_URL}/payments/${paymentId}`);
};
