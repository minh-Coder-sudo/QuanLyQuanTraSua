import api from './api';
import useCartStore from '../store/cartStore';

// 🔥 THÊM 2 STORE
import useCartStore from '../store/cartStore';
import useAddressStore from '../store/addressStore';

const authService = {
    login: async (credentials) => {
        const data = await api.post('/auth/login', credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            useCartStore.getState().syncCartForCurrentUser(data);
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
        const data = await api.post(
            '/auth/forgot-password/verify-code',
            payload
        );
        return data;
    },

    resetPasswordWithCode: async (payload) => {
        const data = await api.post('/auth/forgot-password/reset', payload);
        return data;
    },

    logout: () => {
        useCartStore.getState().syncCartForCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 🔥 QUAN TRỌNG: reset dữ liệu theo user
        useCartStore.setState({ cart: [] });
        useAddressStore.setState({ addresses: [], selected: null });
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateProfile: async (userData) => {
        const data = await api.put('/auth/profile', userData);
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
            useCartStore.getState().syncCartForCurrentUser(data);
        }
        return data;
    }
};

export default authService;
