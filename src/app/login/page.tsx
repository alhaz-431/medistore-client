"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";
import { 
  FiMail, FiLock, FiArrowRight, FiActivity, 
  FiUserCheck, FiZap, FiKey 
} from "react-icons/fi";

// আপনার লাইভ রেন্ডার ব্যাকএন্ড লিঙ্ক
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
        alert("লগইন সফল হয়েছে! 🚀");
        window.location.href = "/"; 
      } else {
        alert(data.error || data.message || "লগইন ব্যর্থ হয়েছে!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("সার্ভারে কানেক্ট করা যাচ্ছে না!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040610] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* মেইন কন্টেইনার */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#0b0f1a] md:rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[100vh] md:min-h-[85vh]">
        
        {/* ─── ডান পাশ: এনিমেশন সেকশন (লগইন পেজে এটি ডানে ভালো লাগে) ─── */}
        <div className="hidden md:flex bg-gradient-to-tr from-[#1e1b4b] to-[#1e3a8a] relative items-center justify-center p-12 overflow-hidden order-last md:order-first">
          {/* Animated Background Rings */}
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
                rotate: i * 45 
              }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
              className="absolute border border-blue-400/30 rounded-[3rem]"
              style={{ width: i * 200, height: i * 200 }}
            />
          ))}

          <div className="relative z-10 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 shadow-3xl">
                <FiUserCheck className="text-7xl mb-6 mx-auto text-blue-400" />
                <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                  Welcome <br /> Back
                </h3>
                <p className="text-blue-100/70 font-bold text-sm max-w-xs mx-auto leading-relaxed">
                  Log in to access your prescriptions, orders, and personalized health dashboard.
                </p>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-12 -left-12 bg-blue-500 p-5 rounded-3xl"
            >
              <FiZap className="text-3xl text-white" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }} 
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-10 -right-10 bg-[#040610] p-5 rounded-3xl border border-white/5"
            >
              <FiKey className="text-3xl text-blue-500" />
            </motion.div>
          </div>
        </div>

        {/* ─── বাম পাশ: লগইন ফর্ম ─── */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-[#0b0f1a]">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-10">
              <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl text-blue-500 mb-4">
                <FiActivity size={28} className="animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                Medi<span className="text-blue-500">Store</span> Login
              </h2>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
                Access your medical account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                  Forgot Password?
                </span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-white text-white hover:text-blue-900 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
              >
                {loading ? "Verifying..." : (
                  <>Secure Login <FiArrowRight /></>
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Don&apos;t have an account? 
              <span onClick={() => router.push('/register')} className="text-blue-500 ml-2 cursor-pointer hover:underline">Register Now</span>
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}