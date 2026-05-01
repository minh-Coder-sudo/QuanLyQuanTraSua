const BASE_URL = 'http://localhost:5000/api';

const api = {
    request: async (endpoint, options = {}) => {
        try {
            const token = localStorage.getItem('token');

            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra!');
            }

            return data;
        } catch (error) {
            console.error('❌ API ERROR:', error);
            throw error;
        }
    },

    get: (endpoint) => api.request(endpoint, { method: 'GET' }),
    post: (endpoint, body) =>
        api.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        }),
    put: (endpoint, body) =>
        api.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        }),
    delete: (endpoint) => api.request(endpoint, { method: 'DELETE' })
};

export default api;
