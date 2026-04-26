"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FiUser, FiMail, FiLock, FiArrowRight, 
  FiActivity, FiTruck, FiShoppingBag, FiCheckCircle 
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api/v1";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER" 
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      if (response.status === 201 || response.status === 200) {
        alert("অভিনন্দন! রেজিস্ট্রেশন সফল। 🎉");
        router.push("/login");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "রেজিস্ট্রেশন ব্যর্থ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // overflow-y-auto দেওয়া হয়েছে যেন মোবাইল স্ক্রিনে স্ক্রল করা যায়
    <div className="min-h-screen bg-[#040610] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-[#0b0f1a] rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden">
        
        {/* ─── বাম পাশ: রেজিস্ট্রেশন ফর্ম ─── */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl text-blue-500 mb-4">
                <FiActivity size={24} className="animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                Create <span className="text-blue-500">Account</span>
              </h2>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">
                Join the future of medicine
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* ROLE SELECTOR */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'CUSTOMER'})}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.role === 'CUSTOMER' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-[#101726] border-white/5 text-slate-500 hover:border-white/10'}`}
                >
                  <FiShoppingBag size={16} />
                  <span className="text-[10px] font-black uppercase italic">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'SELLER'})}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.role === 'SELLER' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-[#101726] border-white/5 text-slate-500 hover:border-white/10'}`}
                >
                  <FiTruck size={16} />
                  <span className="text-[10px] font-black uppercase italic">Seller</span>
                </button>
              </div>

              {/* INPUT FIELDS - padding এবং height ঠিক করা হয়েছে */}
              <div className="space-y-3">
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" />
                  <input 
                    type="text" placeholder="Full Name" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white text-sm" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>

                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" />
                  <input 
                    type="email" placeholder="Email Address" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white text-sm" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>

                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" />
                  <input 
                    type="password" placeholder="Password" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white text-sm" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-white text-white hover:text-blue-900 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl mt-4"
              >
                {loading ? "Processing..." : <>{formData.role === 'SELLER' ? 'Join as Seller' : 'Create Account'} <FiArrowRight /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Already have an account? 
              <span onClick={() => router.push('/login')} className="text-blue-500 ml-2 cursor-pointer hover:underline">Sign In</span>
            </p>
          </motion.div>
        </div>

        {/* ─── ডান পাশ: ডেক্সটপ এনিমেশন (Hidden on Mobile) ─── */}
        <div className="hidden lg:flex bg-gradient-to-br from-blue-700 to-blue-900 relative items-center justify-center p-12 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute w-[500px] h-[500px] border border-white/10 rounded-[3rem]"
          />
          <div className="relative z-10 text-center">
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <FiCheckCircle className="text-6xl mb-6 mx-auto text-blue-200" />
              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white leading-tight">
                Secure <br /> Pharmacy
              </h3>
              <p className="text-blue-100 font-bold text-xs max-w-xs mx-auto leading-relaxed">
                Join thousands of users who trust MediStore for their health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}