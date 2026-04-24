"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiShoppingBag, FiTruck, FiHeart, FiClock, FiArrowRight } from "react-icons/fi";

export default function CustomerDashboard() {
  const [mounted, setMounted] = useState(false);

  // ✅ এরর মুক্ত মাউন্টিং লজিক (Timeout ব্যবহার করে)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // মাউন্ট হওয়ার আগে একটি ব্ল্যাঙ্ক স্টেট বা স্কেলিটন দেখানো ভালো
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* --- WELCOME HEADER --- */}
        <div className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
            My <span className="text-blue-600">Dashboard</span> 👤
          </h1>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-[10px] opacity-70">
            Welcome back! Track your health and orders here.
          </p>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Orders</h3>
              <p className="text-3xl font-black mt-1 text-gray-900">05</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <FiTruck size={24} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pending Delivery</h3>
              <p className="text-3xl font-black mt-1 text-gray-900">01</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="bg-red-50 p-4 rounded-2xl text-red-600">
              <FiHeart size={24} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Wishlist Items</h3>
              <p className="text-3xl font-black mt-1 text-gray-900">12</p>
            </div>
          </div>
        </div>

        {/* --- MAIN ACTIONS & RECENT ORDERS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders Section */}
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">Recent Orders</h2>
              <Link href="/dashboard/customer/my-orders" className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <FiClock className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 tracking-tight">Order #MS-990{i}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">March 2{i}, 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">৳ 1,250</p>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md">Processing</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Sidebar */}
          <div className="space-y-6">
            <Link href="/shop" className="block p-8 bg-blue-600 text-white rounded-[40px] shadow-xl shadow-blue-600/20 hover:bg-black transition-all">
              <h3 className="text-xl font-black tracking-tight">Need Medicine?</h3>
              <p className="text-blue-100 text-xs mt-2 font-bold uppercase tracking-wider">Browse our pharmacy and get it delivered.</p>
              <div className="mt-6 flex justify-end">
                <FiArrowRight size={24} />
              </div>
            </Link>

            <Link href="/dashboard/customer/profile" className="block p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:border-blue-200 transition-all">
              <h3 className="text-xl font-black tracking-tight">My Profile</h3>
              <p className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-wider">Update address and info.</p>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}