import Order, { ORDER_STATUS } from '../models/Order.js';

// @desc    Lấy tổng quan thống kê (Doanh thu, Đơn hàng)
// @route   GET /api/stats/summary
export const getStatsSummary = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        let start, end;
        if (fromDate && toDate) {
            start = new Date(fromDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
        } else {
            start = new Date();
            start.setHours(0, 0, 0, 0);
            end = new Date();
            end.setHours(23, 59, 59, 999);
        }

        // 🔥 SECURITY: Chỉ tính doanh thu từ các đơn PAID, COMPLETED, DELIVERED
        // PENDING, COD chưa thanh toán, CANCELLED bị huỷ không tính
        const paidStatuses = [ORDER_STATUS.PAID, ORDER_STATUS.COMPLETED, ORDER_STATUS.DELIVERED, ORDER_STATUS.COD];

        const todayOrders = await Order.find({
            status: { $in: paidStatuses },
            createdAt: { $gte: start, $lte: end },
        });
        const todayRevenue = todayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const todayOrdersCount = todayOrders.length;

        // Tất cả đơn hàng được trả tiền
        const totalOrders = await Order.find({ status: { $in: paidStatuses } });
        const totalRevenue = totalOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const totalOrdersCount = totalOrders.length;

        // 🔥 Hot products - chỉ từ đơn thanh toán thành công
        const hotProductsAgg = await Order.aggregate([
            { $match: { status: { $in: paidStatuses } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    totalQty: { $sum: { $ifNull: ['$items.qty', { $ifNull: ['$items.quantity', 1] }] } },
                    revenue: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ['$items.finalPrice', { $ifNull: ['$items.basePrice', 0] }] },
                                { $ifNull: ['$items.qty', { $ifNull: ['$items.quantity', 1] }] },
                            ],
                        },
                    },
                },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, name: '$_id', totalQty: 1, revenue: 1 } },
        ]);

        res.json({
            todayRevenue,
            todayOrdersCount,
            totalRevenue,
            totalOrdersCount,
            hotProducts: hotProductsAgg,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy doanh thu theo ngày (Dành cho biểu đồ)
// @route   GET /api/stats/revenue-chart
export const getRevenueChart = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        let start, end;
        if (fromDate && toDate) {
            start = new Date(fromDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
        } else {
            end = new Date();
            start = new Date();
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }

        const orders = await Order.find({
            status: { $ne: 'CANCELLED' },
            createdAt: { $gte: start, $lte: end },
        });

        const aggMap = new Map();
        orders.forEach((order) => {
            const date = order.createdAt.toISOString().slice(0, 10);
            let total = Number(order.total || order.totalPrice || 0);
            if (total === 0 && order.items) {
                total = order.items.reduce((sum, item) => {
                    const price = Number(item.unitPrice || item.priceAtPurchase || item.price || item.basePrice || 0);
                    const qty = Number(item.qty || item.quantity || 1);
                    return sum + price * qty;
                }, 0);
            }

            const current = aggMap.get(date) || { revenue: 0, count: 0 };
            aggMap.set(date, {
                revenue: current.revenue + total,
                count: current.count + 1,
            });
        });

        const days = [];
        const cur = new Date(start);
        while (cur <= end) {
            const key = cur.toISOString().slice(0, 10);
            days.push(key);
            cur.setDate(cur.getDate() + 1);
        }

        const result = days.map((d) => ({
            _id: d,
            revenue: aggMap.get(d)?.revenue || 0,
            count: aggMap.get(d)?.count || 0,
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
