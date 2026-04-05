import Order from '../models/Order.js';

// @desc    Lấy tổng quan thống kê (Doanh thu, Đơn hàng)
// @route   GET /api/stats/summary
export const getStatsSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tính tổng doanh thu hôm nay
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: 'COMPLETED'
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Tính tổng doanh thu mọi thời đại
    const allOrders = await Order.find({ status: 'COMPLETED' });
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Sản phẩm bán chạy (Top 5)
    const hotProducts = await Order.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalQty: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.priceAtPurchase', '$items.quantity'] } }
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
      hotProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy doanh thu theo ngày (Dành cho biểu đồ)
// @route   GET /api/stats/revenue-chart
export const getRevenueChart = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: 'COMPLETED',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
