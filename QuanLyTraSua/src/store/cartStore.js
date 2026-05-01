import { create } from 'zustand';

const CART_STORAGE_PREFIX = 'cart';

const getCurrentUser = () => {
    const rawUser = localStorage.getItem('user');

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
};

const getCartStorageKey = (user = getCurrentUser()) => {
    const userKey = user?._id || user?.id || user?.email || 'guest';
    return `${CART_STORAGE_PREFIX}:${userKey}`;
};

const readCartFromStorage = (storageKey = getCartStorageKey()) => {
    try {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
        return [];
    }
};

const writeCartToStorage = (cart, storageKey = getCartStorageKey()) => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
};

const removeCartFromStorage = (storageKey = getCartStorageKey()) => {
    localStorage.removeItem(storageKey);
};

const savedCart = readCartFromStorage();

const useCartStore = create((set, get) => ({
    cart: savedCart,
    cartKey: getCartStorageKey(),

    syncCartForCurrentUser: (user = getCurrentUser()) => {
        const nextCartKey = getCartStorageKey(user);

        set({
            cartKey: nextCartKey,
            cart: readCartFromStorage(nextCartKey),
        });
    },

    // 👉 thêm sản phẩm
    addToCart: (item) => {
        const cart = get().cart;
        const cartKey = get().cartKey || getCartStorageKey();

        const exist = cart.find(
            (i) =>
                i._id === item._id &&
                JSON.stringify(i.size) === JSON.stringify(item.size) &&
                JSON.stringify(i.toppings) === JSON.stringify(item.toppings),
        );

        let newCart;

        if (exist) {
            newCart = cart.map((i) => (i === exist ? { ...i, qty: i.qty + item.qty } : i));
        } else {
            newCart = [...cart, item];
        }

        writeCartToStorage(newCart, cartKey);
        set({ cart: newCart, cartKey });
    },

    // 👉 xóa
    removeFromCart: (index) => {
        const cartKey = get().cartKey || getCartStorageKey();
        const newCart = get().cart.filter((_, i) => i !== index);

        writeCartToStorage(newCart, cartKey);
        set({ cart: newCart, cartKey });
    },

    // 👉 clear
    clearCart: () => {
        const cartKey = get().cartKey || getCartStorageKey();

        removeCartFromStorage(cartKey);
        set({ cart: [], cartKey });
    },
}));

export default useCartStore;
