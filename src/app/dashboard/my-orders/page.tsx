"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios"; // AxiosError ইম্পোর্ট করা হয়েছে
import { useParams, useRouter } from "next/navigation";

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
  const params = useParams();
  const id = params?.id as string; // টাইপ কাস্টিং করে দেওয়া হয়েছে
  const [order, setOrder] = useState<IOrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // টাইপ যুক্ত করা হয়েছে
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const res = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrder(res.data);
      } catch (err: unknown) { // এখানে any এর বদলে unknown ব্যবহার করা হয়েছে
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<{ error: string }>;
          console.error("404 Error details:", axiosError.response?.data);
        } else {
          console.error("An unexpected error occurred:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold text-blue-600 animate-pulse">লোড হচ্ছে... 🔃</div>;
  
  if (!order) return (
    <div className="p-10 text-center">
      <p className="text-red-500 font-bold mb-4">অর্ডারটি পাওয়া যায়নি। ❌</p>
      <button onClick={() => router.back()} className="text-blue-600 underline">ফিরে যান</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-50 min-h-screen text-black font-sans">
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
            <p className="mt-1 text-sm font-medium">তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD')}</p>
          </div>
          <div className="bg-white text-blue-600 px-6 py-2 rounded-full font-black text-xs shadow-xl uppercase">
            {order.status}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">শিপিং ডিটেইলস 🚚</h3>
            <div className="space-y-2 text-sm text-gray-600 font-medium">
              <p><span className="text-gray-400">নাম:</span> {order.shippingName}</p>
              <p><span className="text-gray-400">ফোন:</span> {order.shippingPhone}</p>
              <p><span className="text-gray-400">ঠিকানা:</span> {order.shippingAddress}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">ওষুধের তালিকা 💊</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.medicine?.name || "ওষুধের নাম নেই"}</p>
                    <p className="text-[10px] text-gray-400">{item.quantity} x {item.medicine?.price || 0} ৳</p>
                  </div>
                  <p className="font-black text-blue-600">{(item.quantity * (item.medicine?.price || 0))} ৳</p>
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
    </div>
  );
}