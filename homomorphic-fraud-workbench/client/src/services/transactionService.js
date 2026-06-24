import API from './apiClient.js';

const TransactionAPI = {
  getTransactions: async () => {
    const response = await API.get('/transactions');
    return response.data;
  },
  getTransaction: async (id) => {
    const response = await API.get(`/transactions/${id}`);
    return response.data;
  },
  createTransaction: async (payload) => {
    const response = await API.post('/transactions', payload);
    return response.data;
  },
  updateTransaction: async (id, payload) => {
    const response = await API.put(`/transactions/${id}`, payload);
    return response.data;
  },
  deleteTransaction: async (id) => {
    const response = await API.delete(`/transactions/${id}`);
    return response.data;
  },
  uploadCsv: async (formData) => {
    const response = await API.post('/transactions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default TransactionAPI;

export const getTransaction = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

export const createTransaction = async (payload) => {
  const response = await API.post('/', payload);
  return response.data;
};

export const updateTransaction = async (id, payload) => {
  const response = await API.put(`/${id}`, payload);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export const uploadCsv = async (formData) => {
  const response = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
