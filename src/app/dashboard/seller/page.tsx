"use client";
import React from "react";
import Link from "next/link";
import { FiPackage, FiPlusCircle, FiTrendingUp, FiShoppingBag } from "react-icons/fi";

export default function SellerDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
            Seller <span className="text-blue-600">Dashboard</span> 🏪
          </h1>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs opacity-70">
            Welcome back! Manage your pharmacy and sales here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <FiPackage className="text-blue-600 mb-4" size={24} />
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Medicines</h3>
            <p className="text-3xl font-black mt-1">48</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <FiShoppingBag className="text-emerald-600 mb-4" size={24} />
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Orders</h3>
            <p className="text-3xl font-black mt-1">156</p>
          </div>
        </div>

        {/* Quick Actions (এখান থেকেই ইনভেন্টরিতে যেতে পারবেন) */}
        <h2 className="text-xl font-black uppercase tracking-tight mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* My Inventory Link */}
          <Link href="/dashboard/seller/my-inventory">
            <div className="group p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl inline-block mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FiPackage size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter">My Inventory</h3>
                  <p className="text-gray-400 font-bold text-sm mt-2">আপনার সকল ওষুধের স্টক এবং দাম এখান থেকে ম্যানেজ করুন।</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Add Medicine Link */}
          <Link href="/dashboard/seller/add-medicine">
            <div className="group p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl inline-block mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FiPlusCircle size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter">Add Medicine</h3>
                  <p className="text-gray-400 font-bold text-sm mt-2">দোকানে নতুন কোনো ওষুধ যোগ করতে এখানে ক্লিক করুন।</p>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}