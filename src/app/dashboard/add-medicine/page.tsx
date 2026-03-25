"use client";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://medistore-backend-server.vercel.app";

interface ICategory {
  id: string;
  name: string;
}

interface IMedicineForm {
  name: string;
  manufacturer: string;
  price: string;
  stock: string;
  categoryId: string;
  description: string; // নতুন যোগ করা হয়েছে
}

export default function AddMedicine() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<IMedicineForm>({
    name: "",
    manufacturer: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "", // নতুন যোগ করা হয়েছে
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: AxiosResponse<ICategory[]> = await axios.get(`${API_URL}/categories`);
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("ক্যাটাগরি লোড করতে সমস্যা:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("দয়া করে একটি ক্যাটাগরি সিলেক্ট করুন!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      // আপনার লোকাল স্টোরেজ থেকে টোকেন নেওয়া (যদি ব্যাকএন্ডে অথেন্টিকেশন থাকে)
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/medicines`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("ওষুধ সফলভাবে যোগ করা হয়েছে! 🎉");
      
      setFormData({
        name: "",
        manufacturer: "",
        price: "",
        stock: "",
        categoryId: "",
        description: "",
      });
    } catch (error) {
      console.error("Save error:", error);
      alert("ওষুধ সেভ করা যায়নি। সার্ভার চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 mt-10 mb-10">
      <h2 className="text-3xl font-black mb-8 text-blue-800 text-center">নতুন ওষুধ যোগ করুন 💊</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ওষুধের নাম</label>
            <input 
              type="text" 
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-black"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">কোম্পানি / প্রস্তুতকারক</label>
            <input 
              type="text" 
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-black"
              value={formData.manufacturer}
              onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ক্যাটাগরি</label>
            <select 
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50 text-black"
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              required
            >
              <option value="">পছন্দ করুন</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">দাম (৳)</label>
            <input 
              type="number" 
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none text-black"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">স্টক সংখ্যা</label>
            <input 
              type="number" 
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none text-black"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              required 
            />
          </div>
        </div>

        {/* নতুন ডেসক্রিপশন ফিল্ড */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ওষুধের বিবরণ (Description)</label>
          <textarea 
            rows={3}
            className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none text-black"
            placeholder="ওষুধটি কী কাজে লাগে বা কীভাবে খেতে হবে..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
          }`}
        >
          {loading ? "সেভ হচ্ছে..." : "ওষুধ সেভ করুন ✨"}
        </button>
      </form>
    </div>
  );
}