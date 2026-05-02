import Order from '../models/Order.js';

// @desc    Lấy tổng quan thống kê (Doanh thu, Đơn hàng)
// @route   GET /api/stats/summary
export const getStatsSummary = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        // determine range: if provided use that, otherwise default to today
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

        // Aggregation for summary
        const todayAgg = await Order.aggregate([
            { $match: { status: 'COMPLETED', createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: null, revenue: { $sum: { $ifNull: ['$total', 0] } }, count: { $sum: 1 } } },
        ]);

        const totalAgg = await Order.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, revenue: { $sum: { $ifNull: ['$total', 0] } }, count: { $sum: 1 } } },
        ]);

        const todayRevenue = (todayAgg[0] && todayAgg[0].revenue) || 0;
        const todayOrdersCount = (todayAgg[0] && todayAgg[0].count) || 0;
        const totalRevenue = (totalAgg[0] && totalAgg[0].revenue) || 0;
        const totalOrdersCount = (totalAgg[0] && totalAgg[0].count) || 0;

        // Hot products (top 5) across COMPLETED orders
        const hotProductsAgg = await Order.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $unwind: '$items' },
            {
                $addFields: {
                    'items._qty': { $ifNull: ['$items.qty', '$items.quantity'] },
                    'items._unitPrice': {
                        $ifNull: [
                            '$items.unitPrice',
                            {
                                $ifNull: [
                                    '$items.finalPrice',
                                    { $ifNull: ['$items.price', { $ifNull: ['$items.basePrice', 0] }] },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: { name: '$items.name', slug: '$items.productSlug' },
                    totalQty: { $sum: { $ifNull: ['$items._qty', 1] } },
                    revenue: {
                        $sum: {
                            $cond: [
                                { $ifNull: ['$items.lineTotal', false] },
                                '$items.lineTotal',
                                { $multiply: [{ $ifNull: ['$items._unitPrice', 0] }, { $ifNull: ['$items._qty', 1] }] },
                            ],
                        },
                    },
                },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    name: '$_id.name',
                    slug: '$_id.slug',
                    totalQty: 1,
                    revenue: 1,
                },
            },
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
            start.setDate(start.getDate() - 6); // last 7 days including today
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }
      },
      { $sort: { _id: 1 } }
    ]);

        const agg = await Order.aggregate([
            { $match: { status: 'COMPLETED', createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: { $ifNull: ['$total', 0] } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill missing dates between start and end
        const days = [];
        const cur = new Date(start);
        while (cur <= end) {
            const key = cur.toISOString().slice(0, 10);
            days.push(key);
            cur.setDate(cur.getDate() + 1);
        }

        const aggMap = new Map(agg.map((d) => [d._id, { revenue: d.revenue || 0, count: d.count || 0 }]));

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
