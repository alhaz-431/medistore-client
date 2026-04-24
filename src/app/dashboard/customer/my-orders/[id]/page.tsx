"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiPhone, FiUser, FiCalendar, FiLoader, FiStar, FiActivity } from "react-icons/fi";

const API_BASE_URL = "https://medistore-backend-server.vercel.app/api";

// ✅ নির্দিষ্ট টাইপ ডেফিনিশন
interface IOrderItem {
  medicineId: string;
  medicine: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface IOrderDetails {
  id: string;
  totalAmount: number;
  status: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
  items: IOrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string; // ✅ Type casting for ID
  
  const [order, setOrder] = useState<IOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // ✅ API response handle with proper typing
        const orderData: IOrderDetails = res.data.data || res.data;
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setMounted(true);
        }, 100);
      }
    };
    if (id) fetchOrderDetails();
  }, [id]);

  // মাউন্টিং এবং লোডিং চেক
  if (!mounted || loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50 text-blue-600">
      <FiLoader className="animate-spin" size={40} />
      <p className="font-black text-[10px] uppercase tracking-[0.3em]">অর্ডার ডিটেইলস লোড হচ্ছে... 🔃</p>
    </div>
  );

  if (!order) return <div className="p-20 text-center text-red-500 font-black">অর্ডারটি পাওয়া যায়নি। ❌</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 bg-gray-50 min-h-screen text-black">
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-blue-600 transition-all group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} /> ফিরে যান
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-10 bg-blue-600 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Order Transaction ID</p>
            <h1 className="text-3xl font-black italic tracking-tighter">#{order.id.toUpperCase()}</h1>
            <p className="mt-2 text-xs font-bold opacity-80 flex items-center gap-2">
              <FiCalendar /> {new Date(order.createdAt).toLocaleDateString('bn-BD')} তারিখে অর্ডার করা হয়েছে
            </p>
          </div>
          <div className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-xs shadow-xl uppercase tracking-widest">
            {order.status}
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Info */}
          <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <FiTruck className="text-blue-600" /> শিপিং ডিটেইলস
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                <FiUser className="text-blue-600 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer Name</p>
                  <p className="text-sm font-bold text-gray-800">{order.shippingName}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                <FiPhone className="text-blue-600 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-gray-800">{order.shippingPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                <FiMapPin className="text-blue-600 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Address</p>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">{order.shippingAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <FiPackage className="text-blue-600" /> ওষুধের তালিকা
            </h3>
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-base">{item.medicine.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {item.quantity} x {item.medicine.price} ৳
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-xl text-gray-900">{item.quantity * item.medicine.price} ৳</p>
                  </div>
                  
                  {order.status === "DELIVERED" && (
                    <ReviewForm medicineId={item.medicineId} medicineName={item.medicine.name} />
                  )}
                </div>
              ))}

              <div className="p-8 bg-gray-900 text-white rounded-[2.5rem] mt-8">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Grand Total</span>
                  <span className="text-3xl font-black tracking-tighter text-blue-400">{order.totalAmount.toLocaleString()} ৳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-8 p-10 bg-white rounded-[3rem] border border-gray-100">
        <h4 className="text-gray-400 font-black text-[10px] uppercase mb-10 tracking-[0.4em] text-center italic">Order Progress</h4>
        <div className="flex justify-between items-center max-w-2xl mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, i) => {
            const isActive = order.status === step;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 shadow-xl ${isActive ? 'bg-blue-600 text-white scale-125' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                   {isActive ? <FiActivity /> : i + 1}
                </div>
                <p className={`mt-4 text-[9px] font-black tracking-widest uppercase ${isActive ? 'text-blue-600' : 'text-gray-300'}`}>{step}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

// ✅ রিভিউ ফর্মের জন্য আলাদা ইন্টারফেস
interface ReviewFormProps {
  medicineId: string;
  medicineName: string;
}

function ReviewForm({ medicineId, medicineName }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/reviews`, {
        medicineId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`${medicineName}-এর জন্য রিভিউ জমা হয়েছে! ⭐`);
      setComment("");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            alert(error.response?.data?.error || "Error submitting review.");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-blue-50/40 rounded-[2rem] border border-blue-100/50">
      <p className="text-[10px] font-black text-blue-800 mb-4 uppercase tracking-widest">Share Experience: {medicineName}</p>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            type="button" 
            onClick={() => setRating(star)} 
            className={`text-2xl transition-all ${rating >= star ? 'text-amber-500' : 'text-gray-200'}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-4 text-xs border-none rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none text-black bg-white shadow-inner h-20"
        placeholder="ওষুধটি সম্পর্কে কিছু লিখুন..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
      >
        {loading ? "জমা হচ্ছে..." : "Submit Review"}
      </button>
    </div>
  );
}