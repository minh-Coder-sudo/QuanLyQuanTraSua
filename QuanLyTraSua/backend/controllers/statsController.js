import Order from '../models/Order.js';

// @desc    Lấy tổng quan thống kê (Doanh thu, Đơn hàng)
// @route   GET /api/stats/summary
export const getStatsSummary = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let dateRange = {};

        if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
            dateRange = { createdAt: { $gte: start, $lte: end } };
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateRange = { createdAt: { $gte: today } };
        }

        // Tính tổng doanh thu trong khoảng ngày
        const todayOrders = await Order.find({
            ...dateRange,
            status: 'COMPLETED',
        });

        const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Tính tổng doanh thu mọi thời đại
        const allOrders = await Order.find({ status: 'COMPLETED' });
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Sản phẩm bán chạy (Top 5)
        const hotProducts = [];

        res.json({
            todayRevenue,
            todayOrdersCount: todayOrders.length,
            totalRevenue,
            totalOrdersCount: allOrders.length,
            hotProducts,
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
        let dateRange = {};

        if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
            dateRange = { $gte: start, $lte: end };
        } else {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            dateRange = { $gte: sevenDaysAgo };
        }

        const revenueData = await Order.aggregate([
            {
                $match: {
                    status: 'COMPLETED',
                    createdAt: dateRange,
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json(revenueData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
