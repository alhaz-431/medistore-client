"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiShield, FiArrowRight } from "react-icons/fi";

// ব্যাকএন্ড ইউআরএল
const API_URL = "https://medistore-backend-server.vercel.app/api";

// এরর রেসপন্সের জন্য ইন্টারফেস
interface IErrorResponse {
  message?: string;
  error?: string;
}

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
      // আপনার ব্যাকএন্ডে যদি /auth/register না থাকে তবে শুধু /register ব্যবহার করুন
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      
      if (response.status === 201 || response.status === 200) {
        alert("অভিনন্দন! রেজিস্ট্রেশন সফল হয়েছে। 🎉");
        router.push("/login");
      }
    } catch (err: unknown) {
      let errorMessage = "রেজিস্ট্রেশন ব্যর্থ হয়েছে!";
      
      if (axios.isAxiosError(err)) {
        // টাইপ সেফ এরর হ্যান্ডলিং
        const serverError = err.response?.data as IErrorResponse;
        errorMessage = serverError?.message || serverError?.error || "সার্ভার এরর! পুনরায় চেষ্টা করুন।";
        console.error("Registration Error Details:", serverError);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-black">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100">
        
        {/* লোগো ও হেডার */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-50 rounded-2xl text-blue-600 mb-4">
            <FiShield size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">
            Medi<span className="text-blue-600">Store</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Join our medical network</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* নাম ইনপুট */}
          <div className="relative group">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" placeholder="Full Name" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} required 
            />
          </div>

          {/* ইমেইল ইনপুট */}
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="email" placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} required 
            />
          </div>

          {/* রোল সিলেক্ট */}
          <div className="relative">
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all appearance-none cursor-pointer"
            >
              <option value="CUSTOMER">REGISTER AS CUSTOMER</option>
              <option value="SELLER">REGISTER AS SELLER</option>
            </select>
          </div>

          {/* পাসওয়ার্ড ইনপুট */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="password" placeholder="Password" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} required 
            />
          </div>

          {/* সাবমিট বাটন */}
          <button 
            type="submit" disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${
              loading ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-black shadow-blue-100'
            }`}
          >
            {loading ? "Registering..." : (
              <>Create Account <FiArrowRight /></>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-default">
          Already have an account? 
          <span onClick={() => router.push('/login')} className="text-blue-600 ml-2 cursor-pointer hover:underline">Sign In</span>
        </p>
      </div>
    </div>
  );
}