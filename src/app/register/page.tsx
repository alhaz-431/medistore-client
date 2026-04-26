"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FiUser, FiMail, FiLock, FiShield, FiArrowRight, 
  FiCheckCircle, FiActivity, FiTruck, FiShoppingBag 
} from "react-icons/fi";

// আপনার লাইভ রেন্ডার ব্যাকএন্ড লিঙ্ক
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
      // আপনার ব্যাকএন্ড রাউট অনুযায়ী /auth/register ব্যবহার করা হয়েছে
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      
      if (response.status === 201 || response.status === 200) {
        alert("অভিনন্দন! রেজিস্ট্রেশন সফল হয়েছে। 🎉");
        router.push("/login");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040610] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* মেইন কন্টেইনার */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#0b0f1a] md:rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[100vh] md:min-h-[85vh]">
        
        {/* ─── বাম পাশ: রেজিস্ট্রেশন ফর্ম ─── */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-[#0b0f1a]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-10">
              <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl text-blue-500 mb-4">
                <FiActivity size={28} className="animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                Create <span className="text-blue-500">Account</span>
              </h2>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
                Join the future of medicine
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" placeholder="Full Name" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" placeholder="Email Address" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>

              <div className="relative">
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all appearance-none cursor-pointer"
                >
                  <option value="CUSTOMER">REGISTER AS CUSTOMER</option>
                  <option value="SELLER">REGISTER AS SELLER</option>
                </select>
              </div>

              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-white text-white hover:text-blue-900 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
              >
                {loading ? "Please wait..." : (
                  <>Create Account <FiArrowRight /></>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Already have an account? 
              <span onClick={() => router.push('/login')} className="text-blue-500 ml-2 cursor-pointer hover:underline">Sign In</span>
            </p>
          </motion.div>
        </div>

        {/* ─── ডান পাশ: বিশাল এনিমেশন সেকশন ─── */}
        <div className="hidden md:flex bg-gradient-to-br from-blue-700 to-blue-900 relative items-center justify-center p-12 overflow-hidden">
          {/* এনিমেটেড ব্যাকগ্রাউন্ড শেইপ */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] border border-white/5 rounded-[4rem]"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[400px] h-[400px] border border-white/10 rounded-full"
          />

          <div className="relative z-10 text-center text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                <FiCheckCircle className="text-7xl mb-6 mx-auto text-blue-300" />
                <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                  Secure <br /> Pharmacy
                </h3>
                <p className="text-blue-100 font-bold text-sm max-w-xs mx-auto leading-relaxed">
                  Join thousand of users who trust MediStore for their daily health needs.
                </p>
              </div>
            </motion.div>

            {/* ছোট ছোট এনিমেটেড আইকন কার্ড */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 bg-white p-5 rounded-3xl shadow-2xl"
            >
              <FiShield className="text-3xl text-blue-600" />
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-10 -left-10 bg-[#040610] p-5 rounded-3xl shadow-2xl border border-white/5"
            >
              <FiTruck className="text-3xl text-blue-500" />
            </motion.div>

            <motion.div 
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 -right-20 bg-blue-500 p-4 rounded-2xl"
            >
              <FiShoppingBag className="text-2xl text-white" />
            </motion.div>
          </div>

          {/* ব্লার ইফেক্ট */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/40 blur-[100px] rounded-full" />
        </div>

      </div>
    </div>
  );
}