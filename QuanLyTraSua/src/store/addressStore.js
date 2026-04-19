import { create } from 'zustand';

const saved = JSON.parse(localStorage.getItem('addresses')) || [];

const useAddressStore = create((set) => ({
    addresses: saved,
    selected: null,

    addAddress: (addr) =>
        set((state) => {
            const newList = [...state.addresses, addr];
            localStorage.setItem('addresses', JSON.stringify(newList));
            return { addresses: newList };
        }),

    selectAddress: (addr) => set({ selected: addr })
}));

export default useAddressStore;
