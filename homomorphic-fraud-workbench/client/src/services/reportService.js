import API from './apiClient.js';

const ReportAPI = {
  getFraudSummary: async () => {
    const response = await API.get('/reports/fraud-summary');
    return response.data;
  },
};

export default ReportAPI;
