import API from './apiClient.js';

const DashboardAPI = {
  getDashboardMetrics: async () => {
    const response = await API.get('/transactions');
    return response.data;
  },
};

export default DashboardAPI;
