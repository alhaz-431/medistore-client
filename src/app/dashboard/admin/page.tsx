"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiAlertTriangle, 
  FiActivity 
} from "react-icons/fi";

// ব্যাকএন্ড ইউআরএল (আপনার ভার্সেল লিংক)
const API_URL = "https://medistore-backend-server.vercel.app/api";

interface IStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  lowStockCount: number;
  totalCategories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<IStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-black">
      {/* হেডার সেকশন */}
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
          <FiActivity className="text-blue-600" /> 
          Admin <span className="text-blue-600">Overview</span>
        </h1>
        <p className="text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest">
          MediStore Management Dashboard
        </p>
      </div>

      {/* স্ট্যাটাস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* টোটাল রেভিনিউ */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <FiDollarSign size={24} />
            </div>
            <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase">Live</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
          <h2 className="text-3xl font-black mt-1">৳ {stats?.totalRevenue.toLocaleString()}</h2>
        </div>

        {/* টোটাল অর্ডার */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FiShoppingBag size={24} />
            </div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase">Orders</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Orders</p>
          <h2 className="text-3xl font-black mt-1">{stats?.totalOrders}</h2>
        </div>

        {/* টোটাল ইউজার */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FiUsers size={24} />
            </div>
            <span className="text-[10px] font-black text-purple-500 bg-purple-50 px-2 py-1 rounded-full uppercase">Users</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Customers</p>
          <h2 className="text-3xl font-black mt-1">{stats?.totalUsers}</h2>
        </div>

        {/* লো স্টক অ্যালার্ট */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl transition-colors ${stats?.lowStockCount && stats.lowStockCount > 0 ? 'bg-red-50 text-red-600 group-hover:bg-red-600' : 'bg-gray-50 text-gray-400'} group-hover:text-white`}>
              <FiAlertTriangle size={24} />
            </div>
            {stats?.lowStockCount && stats.lowStockCount > 0 && (
              <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase animate-pulse">Critical</span>
            )}
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Low Stock Medicines</p>
          <h2 className={`text-3xl font-black mt-1 ${stats?.lowStockCount && stats.lowStockCount > 0 ? 'text-red-600' : 'text-black'}`}>
            {stats?.lowStockCount}
          </h2>
        </div>

      </div>

      {/* নিচের অংশে কিছু গ্রাফ বা রিসেন্ট অ্যাক্টিভিটি যোগ করার জায়গা */}
      <div className="mt-10 p-10 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-blue-200">
        <div>
          <h3 className="text-2xl font-black tracking-tighter">Business is growing! 🚀</h3>
          <p className="text-blue-100 text-sm mt-1">You have {stats?.totalCategories} active medicine categories today.</p>
        </div>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase hover:bg-blue-50 transition-all shadow-lg">
          Generate Full Report
        </button>
      </div>
    </div>
  );
}



