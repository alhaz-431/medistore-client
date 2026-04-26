"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiShoppingBag, FiTruck, FiHeart, FiClock, 
  FiArrowRight, FiActivity, FiUser, FiPackage 
} from "react-icons/fi";

export default function CustomerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // ডাটা ফেচিং সিমুলেশন (এখানে আপনি আপনার API কল করতে পারেন)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#fafbfc]">
        <FiActivity className="text-4xl text-blue-600 animate-pulse mb-4" />
        <span className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px]">Preparing Your Health Space...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-[#fafbfc] min-h-screen font-sans text-black"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* --- WELCOME HEADER --- */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#040610]">
              User <span className="text-blue-600">Hub</span>
            </h1>
            <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.4em] text-[10px]">
              Welcome back, Alfaz • MediStore Patient Portal
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <Link href="/dashboard/customer/profile" className="p-4 bg-white border border-gray-100 rounded-3xl text-gray-400 hover:text-blue-600 transition-all shadow-sm">
              <FiUser size={20} />
            </Link>
          </div>
        </div>

        {/* --- QUICK STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard icon={<FiPackage/>} label="Total Orders" value="08" color="blue" />
          <StatCard icon={<FiTruck/>} label="In Transit" value="02" color="green" />
          <StatCard icon={<FiHeart/>} label="Health List" value="15" color="red" />
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Activity Section */}
          <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-gray-50 shadow-xl shadow-blue-900/5 overflow-hidden p-10">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#040610]">
                Recent <span className="text-blue-600">Timeline</span>
              </h2>
              <Link href="/dashboard/customer/my-orders" className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-full transition-all flex items-center gap-2">
                View History <FiArrowRight />
              </Link>
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-6 bg-[#fafbfc] rounded-[2rem] border border-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <FiClock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">Order Ref: #MS-782{i}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: In Progress</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#040610] italic">৳1,420</p>
                    <span className="text-[8px] font-black uppercase px-3 py-1 bg-blue-100 text-blue-600 rounded-lg tracking-[0.1em]">Processing</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Side Call-to-Actions */}
          <div className="space-y-8">
            <motion.div whileHover={{ scale: 1.02 }} className="relative group">
              <Link href="/shop" className="block p-10 bg-blue-600 text-white rounded-[3.5rem] shadow-2xl shadow-blue-600/30 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                <h3 className="text-2xl font-black tracking-tighter italic uppercase leading-none">Need <br/> Refills?</h3>
                <p className="text-blue-100 text-[10px] mt-4 font-bold uppercase tracking-widest leading-relaxed">
                  Fast delivery for your <br/> essential medications.
                </p>
                <div className="mt-8 flex justify-end">
                  <div className="bg-white p-4 rounded-2xl text-blue-600 group-hover:translate-x-2 transition-transform">
                    <FiArrowRight size={24} />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="block p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:border-blue-200 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <FiActivity className="text-red-500" />
                <h3 className="text-xl font-black tracking-tighter italic uppercase text-gray-900">Health Profile</h3>
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                Manage your medical history & preferences.
              </p>
              <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-green-500 rounded-full" />
              </div>
              <p className="text-[9px] font-black text-gray-400 mt-2 uppercase">Profile Completion: 75%</p>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: any) {
  const styles: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm flex items-center gap-8 group transition-all hover:shadow-xl hover:shadow-blue-900/5"
    >
      <div className={`p-5 rounded-[1.5rem] text-2xl transition-transform group-hover:scale-110 ${styles[color]}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">{label}</h3>
        <p className="text-4xl font-black italic tracking-tighter text-[#040610]">{value}</p>
      </div>
    </motion.div>
  );
}