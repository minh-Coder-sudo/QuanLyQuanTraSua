import api from './api';

const statsService = {
  getSummary: () => api.get('/stats/summary'),
  getRevenueChart: () => api.get('/stats/revenue-chart'),
};

export default statsService;
