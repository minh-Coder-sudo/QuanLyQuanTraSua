import { useState, useEffect } from 'react';
import statsService from '../../services/statsService';

export default function Statistics() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sum, chart] = await Promise.all([
          statsService.getSummary(),
          statsService.getRevenueChart()
        ]);
        setSummary(sum);
        setChartData(chart);
      } catch (error) {
        console.error('Lỗi tải thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  if (loading) return <div className="p-10 text-center text-gray-400 animate-pulse">Đang tổng hợp dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Doanh thu hôm nay" value={`${summary?.todayRevenue?.toLocaleString()}đ`} icon="💰" color="bg-emerald-500 text-white" />
        <StatCard title="Đơn hàng hôm nay" value={`${summary?.todayOrdersCount} đơn`} icon="🧾" color="bg-amber-500 text-white" />
        <StatCard title="Tổng doanh thu" value={`${summary?.totalRevenue?.toLocaleString()}đ`} icon="💎" color="bg-indigo-500 text-white" />
        <StatCard title="Tổng đơn hàng" value={`${summary?.totalOrdersCount} đơn`} icon="📦" color="bg-rose-500 text-white" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Doanh thu 7 ngày */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">📈 Doanh thu 7 ngày gần nhất</h3>
          <div className="flex items-end justify-between h-64 gap-2 px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="w-full relative flex flex-col justify-end h-48 bg-gray-50 rounded-lg overflow-hidden border border-gray-50">
                  <div 
                    className="bg-amber-400 hover:bg-amber-500 transition-all rounded-t-sm"
                    style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      {d.revenue.toLocaleString()}đ
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 font-mono">
                  {d._id.split('-').slice(1).join('/')}
                </span>
              </div>
            ))}
            {chartData.length === 0 && <p className="w-full text-center text-gray-300 py-20 italic">Chưa có đủ dữ liệu biểu đồ</p>}
          </div>
        </div>

        {/* Sản phẩm bán chạy */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">🏆 Sản phẩm bán chạy (Best Seller)</h3>
          <div className="space-y-5">
            {summary?.hotProducts?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-4 group">
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
            {summary?.hotProducts?.length === 0 && <p className="text-center text-gray-300 py-10 italic">Chưa có số liệu sản phẩm</p>}
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
