"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://medistore-backend-server.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // --- এই অংশটুকু পরিবর্তন করুন ---
      if (res.ok) {
        // ১. টোকেন ও ইউজার ডাটা সেভ করা
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("লগইন সফল হয়েছে! 🚀");
        
        // ২. সরাসরি হোম পেজে পাঠিয়ে পেজ রিফ্রেশ করা (যেন Navbar আপডেট হয়)
        window.location.href = "/"; 
      } else {
        alert(data.error || "লগইন ব্যর্থ হয়েছে!");
      }
      // -------------------------------

    } catch (error) {
      console.error("Login error:", error);
      alert("সার্ভারে কানেক্ট করা যাচ্ছে না!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">MediStore 💊</h1>
          <p className="text-gray-500">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ইমেইল অ্যাড্রেস</label>
            <input 
              type="email" 
              placeholder="example@mail.com"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'} text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-100`}
          >
            {loading ? "অপেক্ষা করুন..." : "লগইন করুন"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          নতুন ইউজার?{" "}
          <Link href="/register" className="text-blue-700 font-bold hover:underline">
            অ্যাকাউন্ট তৈরি করুন
          </Link>
        </div>
      </div>
    </div>
  );
}