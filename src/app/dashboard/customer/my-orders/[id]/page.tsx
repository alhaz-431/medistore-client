"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, FiPackage, FiTruck, FiMapPin, 
  FiPhone, FiUser, FiCalendar, FiLoader, 
  FiStar, FiActivity, FiCheckCircle, FiClock 
} from "react-icons/fi";
import api from "@/lib/axios"; // ✅ আপনার তৈরি করা axios instance

// ✅ টাইপ ডেফিনিশন
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
  const id = params?.id as string;
  const router = useRouter();
  
  const [order, setOrder] = useState<IOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // ✅ api instance ব্যবহার করায় কোড ছোট ও নিরাপদ হয়েছে
        const res = await api.get(`/orders/${id}`);
        const orderData: IOrderDetails = res.data.data || res.data;
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setMounted(true);
        }, 300);
      }
    };
    if (id) fetchOrderDetails();
  }, [id]);

  if (!mounted || loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[#fafbfc]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-blue-600">
        <FiActivity size={50} />
      </motion.div>
      <p className="font-black text-blue-600 uppercase tracking-[0.4em] text-[10px]">Processing Order Data...</p>
    </div>
  );

  if (!order) return <div className="p-20 text-center text-red-500 font-black italic uppercase tracking-tighter">Order Not Found! ❌</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-16 bg-[#fafbfc] min-h-screen text-black font-sans">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="mb-10 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-blue-600 transition-all group bg-white px-6 py-3 rounded-full shadow-sm"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} /> Go Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Main Card */}
        <div className="bg-white rounded-[4rem] shadow-xl shadow-blue-900/5 border border-gray-50 overflow-hidden">
          
          {/* Header - Gradient look */}
          <div className="p-12 bg-gradient-to-r from-[#040610] to-blue-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Manifest ID</p>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">#{order.id.slice(-12).toUpperCase()}</h1>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400">
                <FiCalendar className="text-blue-500" /> Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-blue-600 px-10 py-4 rounded-3xl font-black text-[11px] shadow-2xl uppercase tracking-[0.2em] italic border border-blue-400/30">
              {order.status}
            </div>
          </div>

          <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Shipping Info */}
            <div>
              <h3 className="text-xl font-black text-[#040610] mb-8 flex items-center gap-3 uppercase tracking-tighter italic">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Shipping Details
              </h3>
              <div className="space-y-6">
                <InfoItem icon={<FiUser/>} label="Recipient" value={order.shippingName} />
                <InfoItem icon={<FiPhone/>} label="Contact Number" value={order.shippingPhone} />
                <InfoItem icon={<FiMapPin/>} label="Delivery Address" value={order.shippingAddress} />
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-xl font-black text-[#040610] mb-8 flex items-center gap-3 uppercase tracking-tighter italic">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Prescription Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex justify-between items-center bg-[#fafbfc] p-6 rounded-[2.5rem] border border-gray-100 group hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-[#040610] text-lg uppercase italic leading-none mb-1">{item.medicine.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                            Qty: {item.quantity} units @ ৳{item.medicine.price}
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-2xl text-[#040610] tracking-tighter italic">৳{(item.quantity * item.medicine.price).toLocaleString()}</p>
                    </div>
                    
                    {/* Review Form (Only for Delivered orders) */}
                    {order.status === "DELIVERED" && (
                      <ReviewForm medicineId={item.medicineId} medicineName={item.medicine.name} />
                    )}
                  </div>
                ))}

                {/* Total Section */}
                <div className="p-10 bg-[#040610] text-white rounded-[3rem] mt-10 shadow-2xl shadow-blue-900/20 flex justify-between items-center relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-1">Billing Amount</p>
                    <h2 className="text-4xl font-black italic tracking-tighter text-blue-500">৳{order.totalAmount.toLocaleString()}</h2>
                  </div>
                  <FiCheckCircle className="absolute -right-4 -bottom-4 text-white/5" size={120} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Progress Tracker --- */}
        <div className="mt-12 p-12 bg-white rounded-[4rem] border border-gray-50 shadow-sm overflow-x-auto">
          <h4 className="text-gray-300 font-black text-[10px] uppercase mb-12 tracking-[0.5em] text-center italic">Live Tracking System</h4>
          <div className="flex justify-between items-center min-w-[600px] relative px-10">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0"></div>
            
            {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, i) => {
              const stages = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
              const currentIdx = stages.indexOf(order.status.toUpperCase());
              const isCompleted = i <= currentIdx;
              const isCurrent = i === currentIdx;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-xs transition-all duration-700 shadow-xl border-4 ${
                    isCompleted ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-gray-50 text-gray-200'
                  } ${isCurrent ? 'scale-125 ring-8 ring-blue-50' : ''}`}>
                     {isCompleted ? <FiCheckCircle size={18} /> : i + 1}
                  </div>
                  <p className={`mt-6 text-[10px] font-black tracking-widest uppercase italic ${isCompleted ? 'text-blue-600' : 'text-gray-300'}`}>{step}</p>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// কাস্টম ইনফো আইটেম কম্পোনেন্ট
function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-6 p-6 bg-[#fafbfc] rounded-[2rem] border border-gray-50 hover:border-blue-100 transition-colors">
      <div className="p-4 bg-white text-blue-600 rounded-2xl shadow-sm">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-[#040610] tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// রিভিউ ফর্ম কম্পোনেন্ট
function ReviewForm({ medicineId, medicineName }: { medicineId: string, medicineName: string }) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return alert("Please add a comment!");
    setLoading(true);
    try {
      await api.post(`/reviews`, { medicineId, rating, comment });
      alert(`Review submitted for ${medicineName}! ⭐`);
      setComment("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-100/40">
      <p className="text-[10px] font-black text-blue-800 mb-5 uppercase tracking-[0.2em] italic underline decoration-blue-200 underline-offset-4">Patient Feedback: {medicineName}</p>
      <div className="flex gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)} className={`text-2xl transition-all hover:scale-125 ${rating >= star ? 'text-amber-500' : 'text-gray-200'}`}>★</button>
        ))}
      </div>
      <textarea
        className="w-full p-5 text-xs border border-blue-50 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 outline-none text-[#040610] bg-white h-24 placeholder:italic"
        placeholder="How was your experience with this medicine?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full bg-[#040610] text-white py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg"
      >
        {loading ? "Transmitting..." : "Post Experience"}
      </button>
    </motion.div>
  );
}