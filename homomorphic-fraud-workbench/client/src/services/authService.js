import API from './apiClient.js';

export const register = async (payload) => {
  try {
    const response = await API.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error;
  }
};

export const login = async (payload) => {
  try {
    const response = await API.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};
