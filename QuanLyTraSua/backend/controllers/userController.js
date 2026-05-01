import User from '../models/User.js';

// ================= ADMIN =================
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy user' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        user.role = req.body.role || user.role;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi update role' });
    }
};

// ================= CART =================

// GET CART
export const getCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const user = await User.findById(req.user._id);
        res.json(user.cart || []);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy giỏ hàng' });
    }
};

// ADD CART (🔥 FIX FULL)
export const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const { item } = req.body;

        if (!item || !item.productId) {
            return res.status(400).json({ message: 'Thiếu sản phẩm' });
        }

        const user = await User.findById(req.user._id);

        // 🔥 SO SÁNH FULL (product + size + topping)
        const exist = user.cart.find(
            (i) =>
                i.productId === item.productId &&
                i.size?.code === item.size?.code &&
                JSON.stringify(i.toppings || []) ===
                    JSON.stringify(item.toppings || [])
        );

        if (exist) {
            exist.qty += item.qty || 1;
        } else {
            user.cart.push({
                productId: item.productId,
                name: item.name,
                price: item.price,
                qty: item.qty || 1,
                image: item.image,

                size: item.size || null,
                toppings: item.toppings || []
            });
        }

        await user.save();

        res.json(user.cart);
    } catch (error) {
        console.error('❌ ADD CART ERROR:', error);
        res.status(500).json({ message: 'Lỗi thêm giỏ hàng' });
    }
};

// DELETE 1 ITEM
export const removeItemFromCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const { id } = req.params;

        const user = await User.findById(req.user._id);

        // 🔥 XOÁ THEO _id (KHÔNG PHẢI productId)
        user.cart = user.cart.filter((item) => item._id.toString() !== id);

        await user.save();

        res.json(user.cart);
    } catch (error) {
        console.error('❌ REMOVE CART ERROR:', error);
        res.status(500).json({ message: 'Lỗi xoá sản phẩm' });
    }
};
// CLEAR CART
export const clearCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        res.json({ message: 'Đã xoá giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xoá giỏ hàng' });
    }
};

// ================= ADDRESS =================

export const getAddress = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const user = await User.findById(req.user._id);
        res.json(user.addresses || []);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy địa chỉ' });
    }
};

export const addAddress = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const user = await User.findById(req.user._id);

        user.addresses.push(req.body);

        await user.save();

        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thêm địa chỉ' });
    }
};
