import { create } from 'zustand';
import api from '../services/api';

const useAddressStore = create((set) => ({
    addresses: [],
    selected: null,

    fetchAddress: async () => {
        try {
            const data = await api.get('/users/address');
            set({ addresses: data });
            return data;
        } catch (err) {
            // Nếu lỗi 401 (chưa đăng nhập), đừng throw, chỉ log warning
            if (err.message.includes('Chưa đăng nhập')) {
                console.warn('⚠️ Chưa đăng nhập, bỏ qua fetch address');
                set({ addresses: [] });
                return [];
            }
            throw err;
        }
    },

    addAddress: async (addr) => {
        try {
            const data = await api.post('/users/address', addr);
            set({ addresses: data });
            return data;
        } catch (err) {
            if (err.message.includes('Chưa đăng nhập')) {
                console.warn('⚠️ Chưa đăng nhập, không thể thêm địa chỉ');
                throw new Error('Vui lòng đăng nhập để thêm địa chỉ');
            }
            throw err;
        }
    },

    selectAddress: (addr) => set({ selected: addr }),
}));

export default useAddressStore;
