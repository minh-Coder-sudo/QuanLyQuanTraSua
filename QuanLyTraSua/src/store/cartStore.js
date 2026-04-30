import { create } from 'zustand';
import api from '../services/api';

const useCartStore = create((set) => ({
    cart: [],

    fetchCart: async () => {
        const data = await api.get('/users/cart');
        set({ cart: data });
    },

    addToCart: async (item) => {
        await api.post('/users/cart', { item });

        const data = await api.get('/users/cart');
        set({ cart: data });
    },

    // 🔥 FIX XOÁ
    removeFromCart: async (id) => {
        console.log('🗑️ REMOVE ITEM:', id);

        await api.delete(`/users/cart/${id}`);

        const data = await api.get('/users/cart');

        console.log('🟢 CART AFTER DELETE:', data);

        set({ cart: data });
    },

    clearCart: async () => {
        await api.delete('/users/cart');
        set({ cart: [] });
    }
}));

export default useCartStore;
