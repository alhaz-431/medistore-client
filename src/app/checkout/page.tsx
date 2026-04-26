"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiTruck, FiShoppingBag, FiCheckCircle, FiLoader, FiMapPin, FiPhone, FiUser } from "react-icons/fi";

interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("আপনার কার্ট খালি!");

    setLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id; 

      if(!userId) {
          alert("অর্ডার করতে লগইন থাকা আবশ্যক!");
          router.push("/login");
          return;
      }

      const orderData = {
        customerId: userId,
        items: cartItems.map((item) => ({
          medicineId: item.id,
          quantity: item.quantity,
        })),
        shippingName: shippingInfo.name,
        shippingPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        totalAmount: totalAmount,
      };

      // আপনার প্রোডাকশন API এন্ডপয়েন্ট
      const res = await axios.post("https://medistore-backend-server.vercel.app/api/orders", orderData);

      if (res.status === 201 || res.status === 200) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        router.push("/dashboard/my-orders");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("অর্ডার প্রসেস করা সম্ভব হয়নি। আপনার নেটওয়ার্ক বা সার্ভার চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2 text-blue-600">
            <FiShoppingBag size={24} />
            <span className="font-black uppercase tracking-[0.4em] text-[10px]">Secure Checkout</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#040610]">
            Confirm <span className="text-blue-600">Order</span> 🛒
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Shipping Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FiTruck size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-gray-800">Shipping Details</h2>
            </div>

            <form onSubmit={handleOrder} className="space-y-8">
              <div className="group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1 group-focus-within:text-blue-600 transition-colors">
                  <FiUser /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ariful Islam"
                  required
                  className="w-full bg-gray-50/50 border border-gray-100 p-5 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-gray-700"
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1 group-focus-within:text-blue-600 transition-colors">
                  <FiPhone /> Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  required
                  className="w-full bg-gray-50/50 border border-gray-100 p-5 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-gray-700"
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1 group-focus-within:text-blue-600 transition-colors">
                  <FiMapPin /> Delivery Address
                </label>
                <textarea
                  placeholder="House No, Road, Area..."
                  required
                  className="w-full bg-gray-50/50 border border-gray-100 p-5 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-gray-700 min-h-[120px] resize-none"
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full bg-[#040610] text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-900/20 disabled:bg-gray-200 disabled:text-gray-400"
              >
                {loading ? <FiLoader className="animate-spin" size={20} /> : <><FiCheckCircle size={20}/> Complete Order</>}
              </button>
            </form>
          </motion.div>

          {/* RIGHT: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-10"
          >
            <div className="bg-[#040610] text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
               <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 relative z-10">Order Summary</h3>
               
               <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/5">
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight italic">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.quantity} Unit x ৳{item.price}</p>
                      </div>
                      <span className="font-black text-blue-400 italic">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
               </div>

               <div className="border-t border-white/10 pt-6 relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Subtotal Bill</span>
                    <span className="font-bold text-gray-300">৳{totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Delivery Fee</span>
                    <span className="text-emerald-500 font-black text-xs uppercase italic">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-3xl font-black italic tracking-tighter">
                    <span>Total</span>
                    <span className="text-blue-500">৳{totalAmount}</span>
                  </div>
               </div>

               {/* Background Glow */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4">
              <div className="bg-emerald-500 text-white p-3 rounded-xl">
                <FiCheckCircle size={20}/>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Safe & Secure</p>
                <p className="text-xs font-bold text-emerald-800">Cash on delivery available across Bangladesh.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}