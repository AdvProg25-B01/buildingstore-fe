const API_PRODUCT_URL = process.env.REACT_APP_API_TRANSACTION_URL || 'http://localhost:8081';
const BASE_TRANSACTION_URL = `${API_PRODUCT_URL}/api/transactions`;

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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionRequestDTO),
        });
        return handleResponse(response);
    },

    getAllTransactions: async (params = {}) => {
        const queryParams = new URLSearchParams(params);
        const url = `${BASE_TRANSACTION_URL}${Object.keys(params).length ? `?${queryParams}` : ''}`;
        const response = await fetch(url);
        return handleResponse(response);
    },

    getTransactionById: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}`);
        return handleResponse(response);
    },

    updateTransaction: async (id, transactionUpdateDTO) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionUpdateDTO),
        });
        return handleResponse(response);
    },

    cancelTransaction: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}/cancel`, {
            method: 'PATCH',
        });
        return handleResponse(response);
    },

    completeTransaction: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}/complete`, {
            method: 'PATCH',
        });
        return handleResponse(response);
    },

    getOngoingTransactions: async () => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/ongoing`);
        return handleResponse(response);
    },

    deleteTransaction: async (id) => {
        const response = await fetch(`${BASE_TRANSACTION_URL}/${id}`, {
        method: 'DELETE',
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
