import { useState, useEffect } from 'react';
import statsService from '../../services/statsService';

export default function Statistics() {
    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [chartMetric, setChartMetric] = useState('revenue');

    const fetchStats = async (from = '', to = '') => {
        setLoading(true);
        try {
            const [sum, chart] = await Promise.all([
                statsService.getSummary(from, to),
                statsService.getRevenueChart(from, to),
            ]);
            setSummary(sum);
            setChartData(chart);
        } catch (error) {
            console.error('Lỗi tải thống kê:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleFilterClick = () => {
        fetchStats(fromDate, toDate);
    };

    const handleResetFilter = () => {
        setFromDate('');
        setToDate('');
        fetchStats('', '');
    };

    const maxMetricValue = Math.max(
        ...chartData.map((d) => (chartMetric === 'revenue' ? Number(d.revenue || 0) : Number(d.count || 0))),
        1,
    );

    if (loading) return <div className="p-10 text-center text-gray-400 animate-pulse">Đang tổng hợp dữ liệu...</div>;

    return (
        <div className="space-y-6">
            {/* Date Range Filter */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-600">Từ ngày:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-600">Đến ngày:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <button
                    onClick={handleFilterClick}
                    className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
                >
                    Lọc
                </button>
                <button
                    onClick={handleResetFilter}
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                >
                    Đặt lại
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Doanh thu hôm nay"
                    value={`${summary?.todayRevenue?.toLocaleString()}đ`}
                    icon="💰"
                    color="bg-emerald-500 text-white"
                />
                <StatCard
                    title="Đơn hàng hôm nay"
                    value={`${summary?.todayOrdersCount} đơn`}
                    icon="🧾"
                    color="bg-amber-500 text-white"
                />
                <StatCard
                    title="Tổng doanh thu"
                    value={`${summary?.totalRevenue?.toLocaleString()}đ`}
                    icon="💎"
                    color="bg-indigo-500 text-white"
                />
                <StatCard
                    title="Tổng đơn hàng"
                    value={`${summary?.totalOrdersCount} đơn`}
                    icon="📦"
                    color="bg-rose-500 text-white"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Doanh thu 7 ngày */}
                <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">📈 Thống kê 7 ngày gần nhất</h3>
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setChartMetric('revenue')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                                    chartMetric === 'revenue'
                                        ? 'bg-white text-amber-600 shadow'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Doanh thu
                            </button>
                            <button
                                onClick={() => setChartMetric('count')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                                    chartMetric === 'count'
                                        ? 'bg-white text-amber-600 shadow'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Số đơn hoàn thành
                            </button>
                        </div>
                    </div>
                    <div className="flex items-end justify-between h-64 gap-2 px-2">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <span className="text-[10px] font-bold text-amber-600 whitespace-nowrap mb-1">
                                    {chartMetric === 'revenue'
                                        ? `${Number(d.revenue || 0).toLocaleString()}đ`
                                        : `${Number(d.count || 0)} đơn`}
                                </span>
                                <div className="w-full relative flex flex-col justify-end h-48 bg-gray-50 rounded-lg overflow-hidden border border-gray-50">
                                    <div
                                        className="bg-amber-400 hover:bg-amber-500 transition-all rounded-t-sm"
                                        style={{
                                            height: `${
                                                ((chartMetric === 'revenue'
                                                    ? Number(d.revenue || 0)
                                                    : Number(d.count || 0)) /
                                                    maxMetricValue) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-2 font-mono">
                                    {d._id.split('-').slice(1).join('/')}
                                </span>
                            </div>
                        ))}
                        {chartData.length === 0 && (
                            <p className="w-full text-center text-gray-300 py-20 italic">Chưa có đủ dữ liệu biểu đồ</p>
                        )}
                    </div>
                </div>

                {/* Sản phẩm bán chạy */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">🏆 Sản phẩm bán chạy (Best Seller)</h3>
                    <div className="space-y-5">
                        {summary?.hotProducts?.map((p, i) => (
                            <div key={p.name || i} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-800 truncate">{p.name || 'Sản phẩm'}</p>
                                    <p className="text-xs text-gray-400">{p.totalQty} phần đã bán</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-emerald-600">{p.revenue.toLocaleString()}đ</p>
                                </div>
                            </div>
                        ))}
                        {summary?.hotProducts?.length === 0 && (
                            <p className="text-center text-gray-300 py-10 italic">Chưa có số liệu sản phẩm</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{title}</p>
                <p className="text-xl font-black text-gray-800">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${color}`}>
                {icon}
            </div>
        </div>
    );
}
