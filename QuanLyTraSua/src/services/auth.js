import api from './api';

const authService = {
    login: async (credentials) => {
        const data = await api.post('/auth/login', credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },

    register: async (userData) => {
        const data = await api.post('/auth/register', userData);
        return data;
    },

    forgotPassword: async (payload) => {
        const data = await api.post('/auth/forgot-password', payload);
        return data;
    },

    verifyForgotPasswordCode: async (payload) => {
        const data = await api.post('/auth/forgot-password/verify-code', payload);
        return data;
    },

    resetPasswordWithCode: async (payload) => {
        const data = await api.post('/auth/forgot-password/reset', payload);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateProfile: async (userData) => {
        const data = await api.put('/auth/profile', userData);
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },
};

export default authService;
