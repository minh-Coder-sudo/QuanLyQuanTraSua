import Order, { ORDER_STATUS } from '../models/Order.js';
import Product from '../models/Product.js';

// 🔥 HELPER: Validate & recalculate order items từ database
const validateAndCalculateOrderTotal = async (items, user) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
        if (!item.productId) {
            throw new Error('Sản phẩm phải có ID');
        }

        const product = await Product.findById(item.productId);
        if (!product) {
            throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
        }

        // 🔥 SECURITY: Kiểm tra sản phẩm còn hàng
        if (product.status !== 'AVAILABLE') {
            throw new Error(`Sản phẩm "${product.name}" đã hết hàng`);
        }

        const qty = Math.max(1, parseInt(item.qty || item.quantity || 1));

        // 🔥 SECURITY: Lấy giá từ DB, không tin giá từ client
        const basePrice = Number(product.basePrice) || 0;
        const sizeExtra = item.size?.extra ? Number(item.size.extra) : 0;
        const finalPrice = basePrice + sizeExtra;

        if (finalPrice <= 0) {
            throw new Error(`Giá sản phẩm "${product.name}" không hợp lệ`);
        }

        const itemTotal = finalPrice * qty;
        calculatedTotal += itemTotal;

        validatedItems.push({
            ...item,
            productId: product._id,
            name: product.name,
            basePrice,
            finalPrice,
            qty,
            subtotal: itemTotal,
        });
    }

    if (calculatedTotal < 1000) {
        throw new Error('Tổng tiền đơn hàng phải >= 1000 VNĐ');
    }

    return { validatedItems, calculatedTotal };
};

// @desc    Tạo đơn hàng mới (COD hoặc POSManual)
// @route   POST /api/orders
export const createOrder = async (req, res) => {
    try {
        const { items, address, paymentMethod } = req.body;

        // 🔥 SECURITY: Lấy user từ token, không tin req.body.user
        const user = req.user ? req.user._id : null;

        // Validate & calculate
        const { validatedItems, calculatedTotal } = await validateAndCalculateOrderTotal(items, user);

        const orderCode = Date.now() + Math.floor(Math.random() * 10000);

        // 🔥 SECURITY: Backend quyết định status, luôn bắt đầu = PENDING hoặc COD
        const initialStatus = paymentMethod === 'COD' ? ORDER_STATUS.COD : ORDER_STATUS.PENDING;

        const order = new Order({
            orderCode,
            user,
            items: validatedItems,
            total: calculatedTotal,
            address,
            status: initialStatus,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Lấy toàn bộ đơn hàng (chỉ STAFF/ADMIN)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'username fullname phone').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy đơn hàng của người dùng hiện tại
// @route   GET /api/orders/my-orders/:userId
export const getMyOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        // 🔥 SECURITY: Kiểm tra user chỉ xem được đơn của chính họ (hoặc staff xem tất cả)
        if (req.user.role !== 'ADMIN' && req.user.role !== 'EMPLOYEE' && req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không có quyền xem đơn hàng này!' });
        }

        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cập nhật trạng thái đơn hàng (chỉ STAFF/ADMIN)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // 🔥 SECURITY: Kiểm tra status hợp lệ
        if (!Object.values(ORDER_STATUS).includes(status)) {
            return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ!' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
        }

        // 🔥 BUSINESS LOGIC: Kiểm tra chuyển đổi trạng thái hợp lệ
        const validTransitions = {
            [ORDER_STATUS.PENDING]: [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED],
            [ORDER_STATUS.COD]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
            [ORDER_STATUS.PAID]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
            [ORDER_STATUS.COMPLETED]: [ORDER_STATUS.DELIVERED],
            [ORDER_STATUS.DELIVERED]: [],
            [ORDER_STATUS.CANCELLED]: [],
        };

        if (!validTransitions[order.status] || !validTransitions[order.status].includes(status)) {
            return res.status(400).json({
                message: `Không thể chuyển từ ${order.status} sang ${status}!`,
                currentStatus: order.status,
                allowedStatuses: validTransitions[order.status],
            });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
