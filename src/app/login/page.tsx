"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";
import { 
  FiMail, FiLock, FiArrowRight, FiActivity, 
  FiUserCheck, FiZap 
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api/v1";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        const userRole = data.user.role;
        
        if (userRole === "ADMIN") router.push("/dashboard/admin");
        else if (userRole === "SELLER") router.push("/dashboard/seller");
        else if (userRole === "CUSTOMER") router.push("/dashboard/customer/my-orders");
        else router.push("/");

        setTimeout(() => { window.location.reload(); }, 100);
      } else {
        alert(data.error || data.message || "লগইন ব্যর্থ হয়েছে!");
      }
    } catch (error) {
      alert("সার্ভারে কানেক্ট করা যাচ্ছে না!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // p-4 md:p-10 এবং overflow-y-auto দেওয়া হয়েছে রেসপন্সিভনেস এর জন্য
    <div className="min-h-screen bg-[#040610] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-[#0b0f1a] rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden">
        
        {/* ─── বাম পাশ: লগইন ফর্ম (মোবাইলে এটাই আগে দেখাবে) ─── */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#0b0f1a]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10">
              <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl text-blue-500 mb-4">
                <FiActivity size={26} className="animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                Medi<span className="text-blue-500">Store</span> Login
              </h2>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">
                Access your premium health dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white text-sm transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white text-sm transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-white text-white hover:text-blue-900 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
              >
                {loading ? "Verifying..." : <>Secure Login <FiArrowRight /></>}
              </button>
            </form>

            <p className="mt-10 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              New to MediStore? 
              <span onClick={() => router.push('/register')} className="text-blue-500 ml-2 cursor-pointer hover:underline">Create Account</span>
            </p>
          </motion.div>
        </div>

        {/* ─── ডান পাশ: এনিমেশন সেকশন (Hidden on Mobile/Tablet for better UX) ─── */}
        <div className="hidden lg:flex bg-gradient-to-tr from-[#1e1b4b] to-[#1e3a8a] relative items-center justify-center p-12 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 8 + i, repeat: Infinity }}
              className="absolute border border-blue-400/20 rounded-[3rem]"
              style={{ width: i * 180, height: i * 180 }}
            />
          ))}

          <div className="relative z-10 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-3xl">
                <FiUserCheck className="text-6xl mb-6 mx-auto text-blue-400" />
                <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-white">
                  Welcome <br /> Back
                </h3>
                <p className="text-blue-100/60 font-bold text-xs max-w-xs mx-auto leading-relaxed">
                  Your health data is secured with enterprise-grade encryption.
                </p>
              </div>
            </motion.div>
            
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-8 -left-8 bg-blue-500 p-4 rounded-2xl shadow-xl">
              <FiZap className="text-2xl text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}