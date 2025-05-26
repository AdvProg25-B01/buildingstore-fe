import axios from 'axios';

const API_SUPPLIER_URL = process.env.REACT_APP_SUPPLIER_API_URL || 'http://localhost:8083';

const supplierService = {
  getAllSuppliers: async () => {
    try {
      const response = await axios.get(`${API_SUPPLIER_URL}/suppliers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  getSupplierById: async (id) => {
    try {
      const response = await axios.get(`${API_SUPPLIER_URL}/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
  },

  createSupplier: async (supplierData) => {
    try {
      const response = await axios.post(`${API_SUPPLIER_URL}/suppliers`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      const response = await axios.put(`${API_SUPPLIER_URL}/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
  },

  deleteSupplier: async (id) => {
    try {
      const response = await axios.delete(`${API_SUPPLIER_URL}/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting supplier ${id}:`, error);
      throw error;
    }
  },

  searchSuppliers: async (name) => {
    try {
      const response = await axios.get(`${API_SUPPLIER_URL}/suppliers/search?name=${name}`);
      return response.data;
    } catch (error) {
      console.error('Error searching suppliers:', error);
      throw error;
    }
  }
};

export default supplierService;