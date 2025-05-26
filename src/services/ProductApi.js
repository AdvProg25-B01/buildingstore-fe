import axios from 'axios';

const API_PRODUCT_URL = process.env.REACT_APP_API_PRODUCT_URL;
const BASE_PRODUCT_URL = `${API_PRODUCT_URL}/product`;

// Get all products with supplier information
export const getAllProducts = () => axios.get(`${BASE_PRODUCT_URL}/list?includeSupplier=true`);

// Get product by name with supplier information
export const getProductByName = (name) => axios.get(`${BASE_PRODUCT_URL}/${name}?includeSupplier=true`);

export const createProduct = (data) => axios.post(`${BASE_PRODUCT_URL}/create`, data);
export const updateProduct = (name, data) => axios.put(`${BASE_PRODUCT_URL}/edit/${name}`, data);
export const deleteProduct = (name) => axios.delete(`${BASE_PRODUCT_URL}/delete/${name}`);

export const assignSupplierToProduct = (productId, supplierId) => 
  axios.post(`${BASE_PRODUCT_URL}/${productId}/assign-supplier`, { supplierId });

export const removeSupplierFromProduct = (productId) => 
  axios.post(`${BASE_PRODUCT_URL}/${productId}/assign-supplier`, { supplierId: null });

// New function to fetch supplier details for a product
export const getSupplierForProduct = (productId) =>
  axios.get(`${BASE_PRODUCT_URL}/${productId}/supplier`);

export const getProductsBySupplier = async (supplierId) => {
  try {
    const response = await getAllProducts();
    
    const filteredProducts = response.data.filter(product => 
      product.supplierId === supplierId || 
      (product.supplier && product.supplier.id === supplierId)
    );
    
    return {
      data: filteredProducts,
      status: 200
    };
  } catch (error) {
    console.error("Error filtering products by supplier:", error);
    throw error;
  }
};