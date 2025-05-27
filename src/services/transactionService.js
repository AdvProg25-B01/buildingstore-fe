const API_PRODUCT_URL = process.env.REACT_APP_API_PRODUCT_URL || 'http://localhost:8081';
const BASE_TRANSACTION_URL = `${API_PRODUCT_URL}/api/transactions`;

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const getAuthOnlyHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

export const transactionService = {
    createTransaction: async (transactionRequestDTO) => {
        const response = await fetch(BASE_TRANSACTION_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(transactionRequestDTO),
        });
        return handleResponse(response);
    },

    getAllTransactions: async (params = {}) => {
        const queryParams = new URLSearchParams(params);
        const url = `${BASE_TRANSACTION_URL}${queryParams.toString() ? `?${queryParams}` : ''}`;
        const response = await fetch(url, { headers: getAuthOnlyHeaders() });
        return handleResponse(response);
    },
    
    getTransactionById: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}`, {
            headers: getAuthOnlyHeaders(),
        });
        return handleResponse(response);
    },

    updateTransaction: async (id, transactionUpdateDTO) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(transactionUpdateDTO),
        });
        return handleResponse(response);
    },

    cancelTransaction: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}/cancel`, {
            method: 'PATCH',
            headers: getAuthOnlyHeaders(),
        });
        return handleResponse(response);
    },
    

    completeTransaction: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}/complete`, {
            method: 'PATCH',
            headers: getAuthOnlyHeaders(),
        });
        return handleResponse(response);
    },

    getOngoingTransactions: async () => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/ongoing`, {
            headers: getAuthOnlyHeaders(),
        });
        return handleResponse(response);
    },

    deleteTransaction: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthOnlyHeaders(),
        });
        return handleResponse(response);
    }
};

export const TransactionStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};
