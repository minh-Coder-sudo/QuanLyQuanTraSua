import { create } from 'zustand';
import api from '../services/api';

const useAddressStore = create((set) => ({
    addresses: [],
    selected: null,

    fetchAddress: async () => {
        const data = await api.get('/users/address');
        set({ addresses: data });
    },

    addAddress: async (addr) => {
        const data = await api.post('/users/address', addr);
        set({ addresses: data });
    },

    selectAddress: (addr) => set({ selected: addr })
}));

export default useAddressStore;
