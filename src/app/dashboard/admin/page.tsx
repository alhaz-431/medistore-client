"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiAlertTriangle, 
  FiActivity, FiRefreshCcw, FiPieChart, FiArrowUpRight,
  FiTruck, FiCheckCircle, FiXCircle, FiClock
} from "react-icons/fi";

// ব্যাকএন্ড ইউআরএল (Environment Variable থেকে নিলে ভালো হয়)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://medistore-backend-server.vercel.app/api";

interface IStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  lowStockCount: number;
  totalCategories: number;
}

interface IOrder {
  id: string;
  totalAmount: number;
  status: string;
  user: { name: string; email: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<IStats | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const [statsRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!newStatus) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Order is now ${newStatus}! ✅`);
      fetchData(); 
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#fafbfc]">
      <FiActivity className="text-5xl text-blue-600 animate-spin mb-4" />
      <span className="text-blue-600 font-black tracking-[0.3em] uppercase text-xs">Syncing MediStore Data...</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 bg-[#fafbfc] min-h-screen text-black font-sans"
    >
      {/* ─── HEADER SECTION ─── */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3 italic text-[#040610]">
            Control <span className="text-blue-600">Center</span>
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">
            System Administrator • Real-time Monitoring
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData} 
            className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 text-blue-600 transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
          >
            <FiRefreshCcw className={loading ? "animate-spin" : ""} /> Refresh
          </motion.button>
        </div>
      </div>

      {/* ─── STATS GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<FiDollarSign/>} label="Total Revenue" value={`৳${stats?.totalRevenue.toLocaleString()}`} color="green" trend="+12.5%" />
        <StatCard icon={<FiShoppingBag/>} label="Active Orders" value={stats?.totalOrders || 0} color="blue" trend="+5.2%" />
        <StatCard icon={<FiUsers/>} label="Total Users" value={stats?.totalUsers || 0} color="purple" trend="+2.1%" />
        <StatCard icon={<FiAlertTriangle/>} label="Low Stock" value={stats?.lowStockCount || 0} color="red" alert={!!(stats?.lowStockCount && stats.lowStockCount > 0)} />
      </div>

      {/* ─── ORDERS TABLE ─── */}
      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">
            Order <span className="text-blue-600">Pipeline</span>
          </h3>
          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-full uppercase tracking-widest">
            {orders.length} Total Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="pb-6">Reference</th>
                <th className="pb-6">Customer Profile</th>
                <th className="pb-6">Amount</th>
                <th className="pb-6">Current Status</th>
                <th className="pb-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold">
              {orders.map((order) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={order.id} 
                  className="border-b border-gray-50 group hover:bg-blue-50/30 transition-all"
                >
                  <td className="py-7 text-blue-600 font-black uppercase tracking-tighter">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="py-7">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-500">
                        {order.user?.name[0]}
                      </div>
                      <div>
                        <p className="text-gray-900 font-black leading-none uppercase italic text-xs">{order.user?.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-bold">{order.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-7 font-black text-gray-900 italic text-lg">৳{order.totalAmount}</td>
                  <td className="py-7">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-7 text-right">
                    <select 
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-[10px] font-black cursor-pointer focus:border-blue-600 outline-none text-black transition-all shadow-sm hover:border-blue-300"
                    >
                      <option value="">CHANGE STATUS</option>
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── HELPER COMPONENTS ───

function StatCard({ icon, label, value, color, alert, trend }: any) {
  const colorStyles: any = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-5 rounded-[1.5rem] text-2xl transition-all group-hover:scale-110 ${colorStyles[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full italic">
            <FiArrowUpRight /> {trend}
          </div>
        )}
      </div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none mb-2">{label}</p>
      <h2 className={`text-4xl font-black italic tracking-tighter ${alert ? 'text-red-600' : 'text-[#040610]'}`}>
        {value}
      </h2>
      {alert && (
        <div className="absolute top-4 right-4 animate-pulse">
          <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase">Action Required</span>
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: "bg-yellow-50 text-yellow-600 border-yellow-100",
    SHIPPED: "bg-blue-50 text-blue-600 border-blue-100",
    DELIVERED: "bg-green-50 text-green-600 border-green-100",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
  };

  const icons: any = {
    PENDING: <FiClock />,
    SHIPPED: <FiTruck />,
    DELIVERED: <FiCheckCircle />,
    CANCELLED: <FiXCircle />,
  };

  return (
    <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${styles[status] || styles.PENDING}`}>
      {icons[status] || <FiClock />} {status}
    </span>
  );
}