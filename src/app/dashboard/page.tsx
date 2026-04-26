"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FiUsers, FiPackage, FiActivity, 
  FiTrendingUp, FiSettings, FiLayout, FiDollarSign 
} from "react-icons/fi";
import api from "@/lib/axios"; // ✅ আপনার তৈরি করা axios instance

interface DashboardUser {
  name: string;
  role: "ADMIN" | "SELLER";
  email?: string;
}

interface DashboardStats {
  totalUsers?: number;
  totalOrders?: number;
  activeMedicines: number;
  earnings: number;
}

export default function DashboardHome() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeMedicines: 0,
    earnings: 0
  });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      // ১. ইউজার ডাটা লোড করা
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // ২. ইউজারের রোলের উপর ভিত্তি করে স্ট্যাটাস আনা
          // এখানে আপনার এপিআই পাথ অনুযায়ী কল করবেন
          const endpoint = parsedUser.role === "ADMIN" ? "/admin/dashboard-stats" : "/seller/stats";
          const res = await api.get(endpoint);
          setStats(res.data.data || res.data);
          
        } catch (e) {
          console.error("Dashboard init error:", e);
        }
      }
      setMounted(true);
      setLoading(false);
    };

    initDashboard();
  }, []);

  // রেন্ডারিং হ্যান্ডেলিং
  if (!mounted || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Synchronizing Core...</p>
      </div>
    );
  }

  if (!user) return <div className="p-10 font-bold text-red-500 italic">User not found. Please Login.</div>;

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔝 হেডার: প্রফেশনাল ডার্ক ব্লু গ্রাডিয়েন্ট */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#040610] via-[#0f172a] to-[#1e1b4b] rounded-[3.5rem] p-12 shadow-2xl border border-white/5"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 text-blue-500 mb-4">
              <FiLayout size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">System Status: Optimal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
              {user.role === "ADMIN" ? "Admin" : "Seller"} <span className="text-blue-500">Command</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-4 tracking-tight">
              MediStore Neural Network • Identity Verified: <span className="text-white italic">{user.name}</span>
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl px-8 py-6 rounded-[2rem] border border-white/10 shadow-inner">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
              <span className="text-white font-black text-xs uppercase tracking-widest italic">Live Interface</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px]"></div>
      </motion.div>

      {/* 📊 কালারফুল স্ট্যাটাস কার্ডস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Users or Orders */}
        <StatCard 
          icon={<FiActivity size={40} />}
          label={user.role === "ADMIN" ? "Total Network Users" : "Pending Orders"}
          value={user.role === "ADMIN" ? (stats.totalUsers || 0) : (stats.totalOrders || 0)}
          color="indigo"
        />

        {/* Card 2: Active Medicines */}
        <StatCard 
          icon={<FiPackage size={40} />}
          label="Active Inventory"
          value={stats.activeMedicines}
          color="emerald"
        />

        {/* Card 3: Earnings */}
        <StatCard 
          icon={<FiTrendingUp size={40} />}
          label="Net Earnings"
          value={`৳${stats.earnings.toLocaleString()}`}
          color="amber"
          isCurrency
        />
      </div>

      {/* 🛠️ কুইক অ্যাকশন বক্স */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-[#040610] rounded-[4rem] p-12 flex flex-col md:flex-row items-center justify-between border border-white/5 shadow-3xl relative overflow-hidden group transition-all"
      >
        <div className="relative z-10">
          <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter mb-2">Central Control Center</h2>
          <p className="text-slate-500 font-bold text-sm max-w-lg leading-relaxed italic">
            Monitor real-time analytics, manage pharmacy distributions, and oversee system-wide security protocols.
          </p>
        </div>
        
        <div className="relative z-10 mt-8 md:mt-0 flex gap-4">
          <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-blue-900/30">
            System Settings
          </button>
        </div>
        
        <FiSettings className="absolute right-[-2%] bottom-[-15%] text-white/[0.03] size-80 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
      </motion.div>
    </div>
  );
}

// --- স্ট্যাটাস কার্ড কম্পোনেন্ট ---
function StatCard({ icon, label, value, color, isCurrency }: any) {
  const themes: any = {
    indigo: "border-indigo-500 shadow-indigo-100/30 text-indigo-50",
    emerald: "border-emerald-500 shadow-emerald-100/30 text-emerald-50",
    amber: "border-amber-500 shadow-amber-100/30 text-amber-50"
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`group bg-white p-10 rounded-[3.5rem] border-b-[6px] shadow-2xl transition-all duration-300 relative overflow-hidden ${themes[color]}`}
    >
      <div className={`absolute -right-6 -top-6 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 ${color === 'indigo' ? 'text-indigo-100' : color === 'emerald' ? 'text-emerald-100' : 'text-amber-100'}`}>
        {icon}
      </div>
      
      <div className="relative z-10">
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mb-3 italic">{label}</p>
        <h3 className="text-6xl font-black text-slate-800 italic tracking-tighter leading-none">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}