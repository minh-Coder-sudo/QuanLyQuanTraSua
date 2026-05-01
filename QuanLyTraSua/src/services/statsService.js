import api from './api';

const statsService = {
    getSummary: (fromDate = '', toDate = '') => {
        const params = new URLSearchParams();
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        const queryStr = params.toString() ? `?${params.toString()}` : '';
        return api.get(`/stats/summary${queryStr}`);
    },
    getRevenueChart: (fromDate = '', toDate = '') => {
        const params = new URLSearchParams();
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        const queryStr = params.toString() ? `?${params.toString()}` : '';
        return api.get(`/stats/revenue-chart${queryStr}`);
    },
};

export default statsService;
