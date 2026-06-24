import API from './apiClient.js';

const BankAPI = {
  getBanks: async () => {
    const response = await API.get('/banks');
    return response.data;
  },
  getBank: async (id) => {
    const response = await API.get(`/banks/${id}`);
    return response.data;
  },
  createBank: async (payload) => {
    const response = await API.post('/banks', payload);
    return response.data;
  },
  updateBank: async (id, payload) => {
    const response = await API.put(`/banks/${id}`, payload);
    return response.data;
  },
  deleteBank: async (id) => {
    const response = await API.delete(`/banks/${id}`);
    return response.data;
  },
};

export default BankAPI;

export const getBank = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

export const createBank = async (payload) => {
  const response = await API.post('/', payload);
  return response.data;
};

export const updateBank = async (id, payload) => {
  const response = await API.put(`/${id}`, payload);
  return response.data;
};

export const deleteBank = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};
