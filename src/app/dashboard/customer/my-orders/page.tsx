"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPackage, FiCalendar, FiArrowRight, 
  FiActivity, FiLoader, FiShoppingBag, FiTruck, FiCheckCircle, FiClock 
} from "react-icons/fi";
import Link from "next/link";
import api from "@/lib/axios"; // ✅ আগেই তৈরি করা axios instance টি ব্যবহার করুন

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
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // ✅ api instance ব্যবহার করায় আলাদা করে URL বা Token দিতে হবে না
        const res = await api.get("/orders/my-orders");
        
        const data = res.data.data || res.data;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("অর্ডার লোড করতে সমস্যা হয়েছে:", err);
        setOrders([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setMounted(true);
        }, 300);
      }
    };

    fetchOrders();
  }, []);

  // Hydration Error এড়াতে এবং প্রিমিয়াম লোডার দেখাতে
  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafbfc] gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600"
        >
          <FiActivity size={50} />
        </motion.div>
        <p className="font-black text-blue-600 uppercase tracking-[0.4em] text-[10px] animate-pulse">
          Retrieving Your History...
        </p>
      </div>
    );
  }

  // অর্ডার না থাকলে সুন্দর এম্পটি স্টেট
  if (orders.length === 0) return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-screen p-6 bg-[#fafbfc]"
    >
      <div className="p-16 md:p-24 text-center bg-white rounded-[4rem] border border-gray-100 w-full max-w-2xl shadow-xl shadow-blue-900/5">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <FiShoppingBag size={40} className="text-blue-200" />
        </div>
        <h2 className="text-3xl font-black text-[#040610] uppercase tracking-tighter italic">No Orders Yet!</h2>
        <p className="text-gray-400 font-bold text-xs mt-3 mb-10 uppercase tracking-widest">Your prescription cabinet is empty.</p>
        <Link href="/shop" className="inline-block bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-blue-600/20">
          Explore Pharmacy
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 md:p-16 bg-[#fafbfc] min-h-screen text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="h-1 w-12 bg-blue-600 rounded-full"></span>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em]">Activity Log</p>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#040610]">
            My <span className="text-blue-600">Orders</span>
          </h1>
        </motion.div>

        {/* --- Orders List --- */}
        <div className="grid gap-8">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all flex flex-col md:flex-row justify-between items-center group relative overflow-hidden"
              >
                {/* ID & Date Info */}
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="hidden md:flex p-6 bg-[#fafbfc] text-gray-300 rounded-[2rem] group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <FiPackage size={30} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 leading-none">Reference Code</p>
                    <h3 className="text-xl font-black text-[#040610] tracking-tighter group-hover:text-blue-600 transition-colors uppercase italic">
                      #{order.id.slice(-10).toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                      <FiCalendar className="text-blue-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Amount & Status Action */}
                <div className="flex items-center gap-10 mt-8 md:mt-0 w-full md:w-auto justify-between border-t md:border-none pt-8 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Billing Amount</p>
                    <p className="text-3xl font-black text-[#040610] tracking-tighter italic">৳{order.totalAmount.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <StatusBadge status={order.status} />
                    
                    <Link 
                      href={`/dashboard/customer/my-orders/${order.id}`}
                      className="w-14 h-14 bg-[#040610] text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-90"
                    >
                      <FiArrowRight size={24} />
                    </Link>
                  </div>
                </div>

                {/* Decorative background element */}
                <FiPackage className="absolute -right-6 -bottom-6 text-blue-50/30 group-hover:text-blue-50 transition-colors" size={150} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ✅ স্ট্যাটাস ব্যাজ কম্পোনেন্ট
function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    PENDING: { color: "bg-orange-50 text-orange-500 border-orange-100", icon: <FiClock className="animate-spin-slow" size={12} /> },
    DELIVERED: { color: "bg-green-50 text-green-600 border-green-100", icon: <FiCheckCircle size={12} /> },
    SHIPPED: { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <FiTruck size={12} /> },
    CANCELLED: { color: "bg-red-50 text-red-500 border-red-100", icon: <FiPackage size={12} /> },
  };

  const config = configs[status.toUpperCase()] || configs.PENDING;

  return (
    <span className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${config.color}`}>
      {config.icon} {status}
    </span>
  );
}