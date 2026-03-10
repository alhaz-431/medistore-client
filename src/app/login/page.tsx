"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // এখানে আমরা পরে ব্যাকএন্ডের লগইন এপিআই কল করবো
    alert("লগইন রিকোয়েস্ট পাঠানো হয়েছে!");
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
            <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded" /> মনে রাখুন
            </label>
            <a href="#" className="text-blue-600 hover:underline">পাসওয়ার্ড ভুলে গেছেন?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-100"
          >
            লগইন করুন
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