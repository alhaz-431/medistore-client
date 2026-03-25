"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

// ব্যাকএন্ডের মেইন URL (নিশ্চিত করুন শেষে /api আছে)
const API_BASE_URL = "https://medistore-backend-server.vercel.app/api";

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
  const { id } = useParams();
  const [order, setOrder] = useState<IOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        // /orders/${id} রুট থেকে ডেটা আনবে
        const res = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold text-blue-600 animate-pulse">অর্ডার ডিটেইলস লোড হচ্ছে... 🔃</div>;
  if (!order) return <div className="p-10 text-center text-red-500 font-bold">অর্ডারটি পাওয়া যায়নি। ❌</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-50 min-h-screen text-black">
      <button 
        onClick={() => router.back()} 
        className="mb-6 text-blue-600 font-bold hover:underline flex items-center gap-2"
      >
        ← ফিরে যান
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 bg-blue-600 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">অর্ডার আইডি</p>
            <h1 className="text-2xl font-black italic">#{order.id.toUpperCase()}</h1>
            <p className="mt-1 text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('bn-BD')} তারিখে অর্ডার করা হয়েছে</p>
          </div>
          <div className="bg-white text-blue-600 px-6 py-2 rounded-full font-black text-xs shadow-xl uppercase">
            {order.status}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Shipping Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">শিপিং ডিটেইলস 🚚</h3>
            <div className="space-y-2 text-sm text-gray-600 font-medium">
              <p><span className="text-gray-400">নাম:</span> {order.shippingName}</p>
              <p><span className="text-gray-400">ফোন:</span> {order.shippingPhone}</p>
              <p><span className="text-gray-400">ঠিকানা:</span> {order.shippingAddress}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">ওষুধের তালিকা 💊</h3>
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.medicine.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {item.quantity} x {item.medicine.price} ৳
                      </p>
                    </div>
                    <p className="font-black text-blue-600">{item.quantity * item.medicine.price} ৳</p>
                  </div>
                  
                  {/* ডেলিভারি হলে রিভিউ ফর্ম দেখাবে */}
                  {order.status === "DELIVERED" && (
                    <ReviewForm medicineId={item.medicineId} medicineName={item.medicine.name} />
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-dashed flex justify-between items-center text-xl font-black text-gray-900 mt-4">
                <span>মোট বিল:</span>
                <span className="text-blue-600">{order.totalAmount} ৳</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Visualizer */}
      <div className="mt-8 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
        <h4 className="text-gray-400 font-bold text-[10px] uppercase mb-8 tracking-widest">অর্ডার প্রোগ্রেস</h4>
        <div className="flex justify-between items-center max-w-md mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
          {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, i) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${order.status === step ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-400'}`}>
                {i + 1}
              </div>
              <p className={`mt-2 text-[9px] font-black tracking-tighter ${order.status === step ? 'text-blue-600' : 'text-gray-300'}`}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- রিভিউ ফর্ম কম্পোনেন্ট ---
function ReviewForm({ medicineId, medicineName }: { medicineId: string; medicineName: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      // সরাসরি `${API_BASE_URL}/reviews` এন্ডপয়েন্টে রিকোয়েস্ট যাবে
      await axios.post(`${API_BASE_URL}/reviews`, {
        medicineId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`${medicineName}-এর জন্য রিভিউ জমা হয়েছে! ⭐`);
      setComment("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "রিভিউ দেওয়া যায়নি।");
      } else {
        alert("একটি অজানা সমস্যা হয়েছে।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
      <p className="text-[10px] font-bold text-blue-800 mb-2 uppercase tracking-tight">আপনার অভিজ্ঞতা শেয়ার করুন: {medicineName}</p>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            type="button" 
            onClick={() => setRating(star)} 
            className={`text-xl transition-all ${rating >= star ? 'text-yellow-500 scale-110' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-2 text-xs border rounded-lg focus:ring-1 focus:ring-blue-400 outline-none text-black bg-white"
        placeholder="ওষুধটি কেমন ছিল? (ঐচ্ছিক)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
      >
        {loading ? "জমা হচ্ছে..." : "রিভিউ সাবমিট করুন"}
      </button>
    </div>
  );
}