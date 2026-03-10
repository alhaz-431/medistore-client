"use client";
import { useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios"; // এখানে AxiosError যোগ করা হয়েছে
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // .env থেকে URL ব্যবহার করছি (নিচে বিস্তারিত দেখুন)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await axios.post(`${apiUrl}/register`, formData);
      
      if (response.status === 201 || response.status === 200) {
        alert("অভিনন্দন! রেজিস্ট্রেশন সফল হয়েছে।");
        router.push("/login");
      }
    } catch (err) {
      // এখানে error: any এর বদলে টাইপ কাস্টিং করা হয়েছে
      const error = err as AxiosError<{ message: string }>;
      console.error("Registration Error:", error);
      
      const errorMessage = error.response?.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... আপনার আগের রিটার্ন করা HTML কোডগুলো এখানে থাকবে ...
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
       <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Create Account ✨</h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <input 
            type="text" placeholder="Name" className="w-full p-3 rounded-xl border" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} required 
          />
          <input 
            type="email" placeholder="Email" className="w-full p-3 rounded-xl border" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} required 
          />
          <select 
            value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-3 rounded-xl border bg-white"
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
          <input 
            type="password" placeholder="Password" className="w-full p-3 rounded-xl border" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} required 
          />
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition"
          >
            {loading ? "Processing..." : `Register as ${formData.role}`}
          </button>
        </form>
      </div>
    </div>
  );
}