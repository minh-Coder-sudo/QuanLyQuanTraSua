import { create } from 'zustand';

// 🔥 Load từ localStorage
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

const useCartStore = create((set, get) => ({
    cart: savedCart,

    // 👉 thêm sản phẩm
    addToCart: (item) => {
        const cart = get().cart;

        const exist = cart.find(
            (i) =>
                i._id === item._id &&
                JSON.stringify(i.size) === JSON.stringify(item.size) &&
                JSON.stringify(i.toppings) === JSON.stringify(item.toppings)
        );

        let newCart;

        if (exist) {
            newCart = cart.map((i) =>
                i === exist ? { ...i, qty: i.qty + item.qty } : i
            );
        } else {
            newCart = [...cart, item];
        }

        localStorage.setItem('cart', JSON.stringify(newCart));
        set({ cart: newCart });
    },

    // 👉 xóa
    removeFromCart: (index) =>
        set((state) => ({
            cart: state.cart.filter((_, i) => i !== index)
        })),

    // 👉 clear
    clearCart: () => {
        localStorage.removeItem('cart');
        set({ cart: [] });
    }
}));

export default useCartStore;
