"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiPackage, FiCalendar, FiArrowRight, FiActivity, FiLoader } from "react-icons/fi";
import Link from "next/link";

// const API_BASE_URL = "https://medistore-backend-server.vercel.app/api";

// const API_BASE_URL = "http://localhost:5000/api";

// ✅ এটি অটোমেটিক চেক করবে আপনি কোথায় আছেন
const API_BASE_URL = typeof window !== "undefined" && window.location.hostname === "localhost" 
    ? "http://localhost:5000/api" 
    : "https://medistore-backend-server.vercel.app/api";

interface IOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // ✅ এপিআই এন্ডপয়েন্ট সঠিক করা হয়েছে
        const res = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // ✅ ডাটা এক্সট্রাকশন লজিক আপডেট
        const data = res.data.data || res.data;
        const fetchedOrders = Array.isArray(data) ? data : [];
        
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("অর্ডার লোড করতে সমস্যা হয়েছে:", err);
        setOrders([]);
      } finally {
        // ছোট ডিলে যাতে রিঅ্যাক্ট এরর না দেয়
        setTimeout(() => {
          setLoading(false);
          setMounted(true);
        }, 150);
      }
    };

    initialize();
  }, []);

  // Hydration Error এড়াতে প্রাথমিক চেকিং
  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <FiLoader className="animate-spin text-blue-600" size={40} />
        <p className="font-black text-blue-600 uppercase tracking-[0.3em] text-[10px]">Initializing Dashboard... 🔃</p>
      </div>
    );
  }

  // লোডিং শেষ হওয়ার পর যদি অর্ডার না থাকে
  if (!loading && orders.length === 0) return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <div className="p-20 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 w-full max-w-2xl shadow-sm">
        <FiPackage size={60} className="mx-auto text-blue-100 mb-6" />
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">No Orders Found!</h2>
        <p className="text-gray-400 font-bold text-sm mt-2 mb-8">আপনি এখনো কোনো ওষুধ অর্ডার করেননি।</p>
        <Link href="/shop" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-600/20">
          Start Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen text-black">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-gray-900">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                <FiActivity size={28} />
            </div>
            My <span className="text-blue-600 underline decoration-gray-200 underline-offset-8">Orders</span>
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-2">Order History & Status</p>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all flex flex-col md:flex-row justify-between items-center group relative overflow-hidden">
              
              <div className="flex items-center gap-8">
                <div className="p-5 bg-gray-50 text-gray-400 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <FiPackage size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-2">Order ID</p>
                  <h3 className="text-lg font-black text-gray-800 group-hover:text-blue-600 transition-colors">#{order.id.slice(-8).toUpperCase()}</h3>
                </div>
              </div>

              <div className="flex items-center gap-12 mt-6 md:mt-0 w-full md:w-auto justify-between border-t md:border-none pt-6 md:pt-0">
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <FiCalendar className="text-blue-500" /> {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </p>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">৳ {order.totalAmount.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-6">
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${
                    order.status === 'PENDING' ? 'bg-orange-50 text-orange-500 border border-orange-100' : 
                    order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-blue-50 text-blue-500 border border-blue-100'
                  }`}>
                    {order.status}
                  </span>
                  
                  <Link 
                    href={`/dashboard/customer/my-orders/${order.id}`}
                    className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-90"
                  >
                    <FiArrowRight size={20} />
                  </Link>
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                 <FiPackage size={100} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



+3
