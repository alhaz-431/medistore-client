"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://medistore-backend-server.vercel.app";

interface IMedicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
  category?: {
    name: string;
  };
}

export default function MyInventory() {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMedicines = async () => {
    try {
      // এখানে সরাসরি /medicines ব্যবহার করা নিরাপদ যদি API_URL এ /api থাকে
      const res = await axios.get(`${API_URL}/medicines`);
      setMedicines(res.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/medicines/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("সফলভাবে ডিলিট হয়েছে! 🗑️");
        fetchMedicines();
      } catch (error) {
        alert("ডিলিট করা সম্ভব হয়নি।");
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-bold text-xl text-blue-600 animate-bounce">
      ইনভেন্টরি লোড হচ্ছে... 🔃
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">আমার ইনভেন্টরি 📦</h2>
          <p className="text-gray-500 text-sm">আপনার দোকানের সব ওষুধের তালিকা এখানে দেখুন।</p>
        </div>
        <div className="flex gap-4 items-center">
          <span className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
            মোট ওষুধ: {medicines.length}
          </span>
          <Link href="/dashboard/add-medicine" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all active:scale-95">
            + নতুন ওষুধ
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">ওষুধের নাম</th>
                <th className="px-6 py-4">কোম্পানি</th>
                <th className="px-6 py-4">ক্যাটাগরি</th>
                <th className="px-6 py-4">দাম</th>
                <th className="px-6 py-4">স্টক</th>
                <th className="px-6 py-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {medicines.map((med) => (
                <tr key={med.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-800">{med.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{med.manufacturer}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                      {med.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">{med.price} ৳</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${med.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                      {med.stock} <small className="text-gray-400 font-normal">pcs</small>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      {/* Edit বাটনে ওষুধের আইডি পাস করা হয়েছে */}
                      <Link 
                        href={`/dashboard/edit-medicine/${med.id}`}
                        className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors font-bold text-sm"
                        title="এডিট করুন"
                      >
                        এডিট ✏️
                      </Link>
                      <button 
                        onClick={() => handleDelete(med.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold text-sm"
                        title="ডিলিট করুন"
                      >
                        ডিলিট 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {medicines.length === 0 && (
          <div className="p-20 text-center">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-gray-400 font-medium">আপনার ইনভেন্টরি বর্তমানে খালি।</p>
          </div>
        )}
      </div>
    </div>
  );
}


