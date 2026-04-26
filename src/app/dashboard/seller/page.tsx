"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiPackage, FiPlusCircle, FiTrendingUp, 
  FiShoppingBag, FiActivity, FiDollarSign, FiArrowRight 
} from "react-icons/fi";
import api from "@/lib/axios"; // ✅ আপনার তৈরি করা axios instance

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        setLoading(true);
        // ✅ সেলারের স্ট্যাটাস আনার জন্য এপিআই কল (আপনার ব্যাকএন্ড অনুযায়ী পাথ চেক করে নিন)
        const res = await api.get("/seller/stats");
        const data = res.data.data || res.data;
        setStats(data);
      } catch (err) {
        console.error("Seller stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerStats();
  }, []);

  if (loading) return <SellerLoader />;

  return (
    <div className="p-6 md:p-12 bg-[#fafbfc] min-h-screen text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="h-1 w-12 bg-blue-600 rounded-full"></span>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em]">Merchant Panel</p>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#040610]">
            Seller <span className="text-blue-600">Core</span> 🏪
          </h1>
        </motion.div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard 
            icon={<FiPackage/>} 
            label="Active Stock" 
            value={stats.totalMedicines} 
            color="text-blue-600" 
            bg="bg-blue-50" 
          />
          <StatCard 
            icon={<FiShoppingBag/>} 
            label="Orders Processed" 
            value={stats.totalOrders} 
            color="text-emerald-600" 
            bg="bg-emerald-50" 
          />
          <StatCard 
            icon={<FiDollarSign/>} 
            label="Total Revenue" 
            value={`৳${stats.totalSales.toLocaleString()}`} 
            color="text-purple-600" 
            bg="bg-purple-50" 
          />
          <StatCard 
            icon={<FiActivity/>} 
            label="Pending Action" 
            value={stats.pendingOrders} 
            color="text-orange-600" 
            bg="bg-orange-50" 
            alert={stats.pendingOrders > 0}
          />
        </div>

        {/* --- Quick Actions --- */}
        <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-8 border-b-2 border-gray-100 pb-4 inline-block">
                Operations <span className="text-blue-600">Hub</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Inventory Link */}
              <ActionCard 
                href="/dashboard/seller/my-inventory"
                icon={<FiPackage size={32} />}
                title="Manage Inventory"
                desc="আপনার স্টকের পরিমাণ এবং ওষুধের দাম আপডেট করুন দ্রুত।"
                theme="blue"
              />

              {/* Add Medicine Link */}
              <ActionCard 
                href="/dashboard/seller/add-medicine"
                icon={<FiPlusCircle size={32} />}
                title="New Listing"
                desc="দোকানে নতুন কোনো ওষুধ বা সাপ্লিমেন্ট যোগ করতে ক্লিক করুন।"
                theme="emerald"
              />

            </div>
        </div>

        {/* --- Recent Sales Tip --- */}
        <div className="mt-12 p-8 bg-[#040610] rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center overflow-hidden relative group">
            <div className="relative z-10">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Boost Your <span className="text-blue-500">Sales</span></h3>
                <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest italic">Check which medicines are trending this week.</p>
            </div>
            <Link href="/dashboard/seller/analytics" className="mt-6 md:mt-0 relative z-10 bg-blue-600 p-5 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                <FiTrendingUp size={24} />
            </Link>
            <FiActivity className="absolute -right-8 -bottom-8 text-white/5 group-hover:text-blue-500/10 transition-colors" size={200} />
        </div>

      </div>
    </div>
  );
}

// --- কম্পোনেন্ট: স্ট্যাটাস কার্ড ---
function StatCard({ icon, label, value, color, bg, alert }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[3.5rem] border border-gray-50 shadow-sm shadow-blue-900/5 relative overflow-hidden group"
    >
      <div className={`p-4 rounded-2xl w-fit mb-6 transition-all duration-500 group-hover:scale-110 ${bg} ${color}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-2">{label}</p>
      <h2 className={`text-4xl font-black italic tracking-tighter ${alert ? 'text-orange-600 animate-pulse' : 'text-[#040610]'}`}>
        {value}
      </h2>
    </motion.div>
  );
}

// --- কম্পোনেন্ট: অ্যাকশন কার্ড ---
function ActionCard({ href, icon, title, desc, theme }: any) {
  const colors: any = {
    blue: "hover:border-blue-200 hover:shadow-blue-600/5 bg-blue-50 text-blue-600",
    emerald: "hover:border-emerald-200 hover:shadow-emerald-600/5 bg-emerald-50 text-emerald-600"
  };

  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group p-10 bg-white border border-gray-100 rounded-[4rem] shadow-sm transition-all cursor-pointer flex justify-between items-center ${colors[theme].split(' ')[0]} ${colors[theme].split(' ')[1]}`}
      >
        <div className="flex-1">
          <div className={`p-5 rounded-3xl inline-block mb-6 transition-all duration-500 group-hover:bg-[#040610] group-hover:text-white ${colors[theme].split(' ')[2]} ${colors[theme].split(' ')[3]}`}>
            {icon}
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter uppercase group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-gray-400 font-bold text-xs mt-4 tracking-tight leading-relaxed max-w-[250px] italic">{desc}</p>
        </div>
        <div className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            <FiArrowRight size={24} />
        </div>
      </motion.div>
    </Link>
  );
}

// --- কম্পোনেন্ট: সেলার লোডার ---
function SellerLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafbfc] gap-6 text-blue-600">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <FiActivity size={50} />
      </motion.div>
      <p className="font-black uppercase tracking-[0.4em] text-[10px]">Syncing Pharmacy Data...</p>
    </div>
  );
}