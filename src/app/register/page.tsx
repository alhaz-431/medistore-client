"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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
      // আমি সরাসরি আপনার ভেরসেল ব্যাকএন্ড লিঙ্কটি এখানে দিয়ে দিচ্ছি
      const apiUrl = "https://medistore-backend-server.vercel.app/api";

      const response = await axios.post(`${apiUrl}/register`, formData);
      
      if (response.status === 201 || response.status === 200) {
        alert("অভিনন্দন! রেজিস্ট্রেশন সফল হয়েছে। 🎉");
        router.push("/login");
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Registration Error Details:", error.response?.data);
      
      // ব্যাকএন্ড থেকে আসা এরর মেসেজ অথবা ডিফল্ট মেসেজ
      const errorMessage = error.response?.data?.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে! ইন্টারনেট বা সার্ভার চেক করুন।";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Create Account ✨</h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <input 
            type="text" placeholder="Name" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} required 
          />
          <input 
            type="email" placeholder="Email" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} required 
          />
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="SELLER">Seller</option>
          </select>
          <input 
            type="password" placeholder="Password" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} required 
          />
          <button 
            type="submit" disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-100`}
          >
            {loading ? "Processing..." : `Register as ${formData.role}`}
          </button>
        </form>
      </div>
    </div>
  );
}