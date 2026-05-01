import Order from '../models/Order.js';

// @desc    Lấy tổng quan thống kê (Doanh thu, Đơn hàng)
// @route   GET /api/stats/summary
export const getStatsSummary = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let dateRange = {};

    // Tính tổng doanh thu hôm nay
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: { $ne: 'CANCELLED' } // Không tính đơn đã hủy
    });

    const calculateOrderTotal = (order) => {
      if (order.total || order.totalPrice) return (order.total || order.totalPrice);
      return order.items.reduce((s, i) => s + (i.priceAtPurchase || i.price || 0) * (i.quantity || i.qty || 0), 0);
    };

    const todayRevenue = todayOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);

    // Tính tổng doanh thu mọi thời đại
    const allOrders = await Order.find({ status: { $ne: 'CANCELLED' } });
    const totalRevenue = allOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);

    // Sản phẩm bán chạy (Top 5)
    const hotProducts = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          name: { $first: '$items.name' },
          totalQty: { $sum: { $ifNull: ['$items.quantity', '$items.qty'] } },
          revenue: { $sum: { $multiply: [{ $ifNull: ['$items.priceAtPurchase', '$items.price'] }, { $ifNull: ['$items.quantity', '$items.qty'] }] } }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

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

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'CANCELLED' },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $addFields: {
          computedTotal: {
            $cond: {
              if: { $or: [{ $gt: ['$total', 0] }, { $gt: ['$totalPrice', 0] }] },
              then: { $ifNull: ['$total', '$totalPrice'] },
              else: {
                $reduce: {
                  input: '$items',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      { $multiply: [{ $ifNull: ['$$this.priceAtPurchase', '$$this.price'] }, { $ifNull: ['$$this.quantity', '$$this.qty'] }] }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$computedTotal' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

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
