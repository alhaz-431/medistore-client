"use client";
import { useEffect, useState } from "react";
import { FiUsers, FiPackage, FiActivity, FiTrendingUp, FiSettings, FiLayout } from "react-icons/fi";

// ১. টাইপ সেফটি ইন্টারফেস
interface DashboardUser {
  name: string;
  role: "ADMIN" | "SELLER";
  email?: string;
}

export default function DashboardHome() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ২. রেন্ডারিং এরর এড়াতে setTimeout ব্যবহার
    const timeoutId = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as DashboardUser);
        } catch (e) {
          console.error("User data error");
        }
      }
      setMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!mounted || !user) {
    return <div className="p-10 animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Summary...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      
      {/* 🔝 হেডার: প্রফেশনাল ডার্ক ব্লু গ্রাডিয়েন্ট */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] rounded-[3rem] p-10 shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 text-blue-400 mb-2">
              <FiLayout size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
              {user.role === "ADMIN" ? "Admin" : "Seller"} <span className="text-blue-500">Portal</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-2">
              Management System Active • Welcome back, <span className="text-white">{user.name}</span>
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-white font-black text-xs uppercase tracking-widest italic">Live & Secure</span>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 📊 কালারফুল স্ট্যাটাস কার্ডস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Indigo Theme */}
        <div className="group bg-white p-8 rounded-[2.5rem] border-b-4 border-indigo-500 shadow-xl shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
          <FiActivity className="absolute -right-4 -top-4 text-indigo-50 size-24 group-hover:text-indigo-100 transition-colors" />
          <div className="relative z-10">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">
              {user.role === "ADMIN" ? "Total Users" : "Recent Orders"}
            </p>
            <h3 className="text-5xl font-black text-slate-800 italic tracking-tighter">
              {user.role === "ADMIN" ? "12" : "0"}
            </h3>
          </div>
        </div>

        {/* Card 2: Emerald Theme */}
        <div className="group bg-white p-8 rounded-[2.5rem] border-b-4 border-emerald-500 shadow-xl shadow-emerald-100/50 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
          <FiPackage className="absolute -right-4 -top-4 text-emerald-50 size-24 group-hover:text-emerald-100 transition-colors" />
          <div className="relative z-10">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Active Meds</p>
            <h3 className="text-5xl font-black text-slate-800 italic tracking-tighter">04</h3>
          </div>
        </div>

        {/* Card 3: Amber Theme */}
        <div className="group bg-white p-8 rounded-[2.5rem] border-b-4 border-amber-500 shadow-xl shadow-amber-100/50 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
          <FiTrendingUp className="absolute -right-4 -top-4 text-amber-50 size-24 group-hover:text-amber-100 transition-colors" />
          <div className="relative z-10">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Earnings</p>
            <h3 className="text-5xl font-black text-slate-800 italic tracking-tighter">
              <span className="text-2xl font-bold mr-1 text-amber-500">৳</span>0.00
            </h3>
          </div>
        </div>
      </div>

      {/* 🛠️ কুইক অ্যাকশন বক্স */}
      <div className="bg-[#0f172a] rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter">Inventory Control</h2>
          <p className="text-slate-500 font-bold text-sm mt-1 max-w-md">
            Easily manage your inventory and user data directly from this dashboard.
          </p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex gap-4">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-lg shadow-blue-900/40">
            Quick Settings
          </button>
        </div>
        <FiSettings className="absolute right-[-2%] bottom-[-10%] text-white/[0.03] size-64 rotate-12" />
      </div>
    </div>
  );
}