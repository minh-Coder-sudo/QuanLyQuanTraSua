import Order from '../models/Order.js';

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
export const createOrder = async (req, res) => {
    try {
        const { items, total, paymentMethod, user } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Đơn hàng trống!' });
        }

        const order = new Order({
            items,
            total,
            status: 'PENDING',
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Lấy toàn bộ đơn hàng
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'username fullname')
      .sort({ createdAt: -1 }); // Mới nhất lên đầu
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy đơn hàng của người dùng hiện tại
// @route   GET /api/orders/my-orders/:userId
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy đơn hàng của người dùng hiện tại
// @route   GET /api/orders/my-orders/:userId
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cập nhật trạng thái đơn hàng
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
