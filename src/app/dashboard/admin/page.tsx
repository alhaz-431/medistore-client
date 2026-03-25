"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiAlertTriangle, 
  FiActivity,
  FiRefreshCcw
} from "react-icons/fi";

// ব্যাকএন্ড ইউআরএল
const API_URL = "https://medistore-backend-server.vercel.app/api";

// ইন্টারফেসগুলো ডিফাইন করা (Type Safety এর জন্য)
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
}

interface IStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "green" | "blue" | "purple" | "red";
  alert?: boolean;
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
    <div className="flex justify-center items-center min-h-[60vh] text-blue-600 font-black animate-pulse">
      LOADING ADMIN DATA... 💊
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-black font-sans">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 italic">
            <FiActivity className="text-blue-600" /> Admin <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Management Portal</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 text-blue-600 transition-all shadow-sm">
          <FiRefreshCcw />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<FiDollarSign/>} label="Revenue" value={`৳ ${stats?.totalRevenue.toLocaleString()}`} color="green" />
        <StatCard icon={<FiShoppingBag/>} label="Orders" value={stats?.totalOrders || 0} color="blue" />
        <StatCard icon={<FiUsers/>} label="Users" value={stats?.totalUsers || 0} color="purple" />
        <StatCard icon={<FiAlertTriangle/>} label="Low Stock" value={stats?.lowStockCount || 0} color="red" alert={!!(stats?.lowStockCount && stats.lowStockCount > 0)} />
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black mb-6 uppercase tracking-tighter italic">Recent <span className="text-blue-600">Orders Management</span></h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                  <td className="py-5 text-blue-600 font-black uppercase">#{order.id.slice(-6)}</td>
                  <td className="py-5">
                    <p className="text-gray-900 leading-none">{order.user?.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{order.user?.email}</p>
                  </td>
                  <td className="py-5 text-[9px] font-black uppercase text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">{order.status}</span>
                  </td>
                  <td className="py-5 text-right">
                    <select 
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="bg-gray-50 border-none rounded-xl px-3 py-2 text-[10px] font-black cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none text-black transition-all"
                    >
                      <option value="">CHANGE</option>
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, alert }: IStatCardProps) {
  const colorStyles: Record<string, string> = {
    green: "bg-green-50 text-green-600 group-hover:bg-green-600",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600",
    red: "bg-red-50 text-red-600 group-hover:bg-red-600"
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl transition-all group-hover:text-white ${colorStyles[color]}`}>
          {icon}
        </div>
        {alert && <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase animate-pulse">Critical</span>}
      </div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <h2 className={`text-3xl font-black mt-1 ${alert ? 'text-red-600' : 'text-gray-900'}`}>{value}</h2>
    </div>
  );
}