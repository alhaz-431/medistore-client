"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlusCircle, FiTag, FiBox, FiDollarSign, FiInfo, FiActivity, FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import api from "@/lib/axios"; // ✅ আপনার সেন্ট্রালাইজড axios instance

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
  description: string;
}

export default function AddMedicine() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingCats, setFetchingCats] = useState<boolean>(true);
  
  const [formData, setFormData] = useState<IMedicineForm>({
    name: "",
    manufacturer: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
  });

  // ক্যাটাগরি লোড করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = res.data.data || res.data;
        if (Array.isArray(data)) setCategories(data);
      } catch (error) {
        console.error("Category load error:", error);
      } finally {
        setFetchingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("Please select a category!");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      await api.post("/medicines", payload);

      alert("Medicine added successfully! 🎉");
      
      // ফর্ম রিসেট
      setFormData({
        name: "",
        manufacturer: "",
        price: "",
        stock: "",
        categoryId: "",
        description: "",
      });
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.response?.data?.message || "Failed to save medicine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1" /> Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3.5rem] shadow-xl shadow-blue-900/5 border border-gray-50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-10 md:p-12 bg-[#040610] text-white flex justify-between items-center">
            <div>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Inventory System</p>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">Add <span className="text-blue-500">Medicine</span></h1>
            </div>
            <FiPlusCircle size={50} className="text-blue-600 opacity-50" />
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-10">
            
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label icon={<FiActivity/>} text="Medicine Name" />
                <input 
                  type="text" 
                  placeholder="e.g. Napa Extra 500mg"
                  className="w-full bg-[#fafbfc] border border-gray-100 p-5 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-black"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-3">
                <Label icon={<FiBox/>} text="Manufacturer" />
                <input 
                  type="text" 
                  placeholder="e.g. Beximco Pharma"
                  className="w-full bg-[#fafbfc] border border-gray-100 p-5 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-black"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  required 
                />
              </div>
            </div>

            {/* Row 2: Category & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-3">
                <Label icon={<FiTag/>} text="Category" />
                <select 
                  className="w-full bg-[#fafbfc] border border-gray-100 p-5 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-black appearance-none"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  required
                >
                  <option value="">{fetchingCats ? "Loading..." : "Select Type"}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label icon={<FiDollarSign/>} text="Price (৳)" />
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-[#fafbfc] border border-gray-100 p-5 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-black"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required 
                />
              </div>

              <div className="space-y-3">
                <Label icon={<FiPlusCircle/>} text="Stock Count" />
                <input 
                  type="number" 
                  placeholder="e.g. 500"
                  className="w-full bg-[#fafbfc] border border-gray-100 p-5 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-black"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required 
                />
              </div>
            </div>

            {/* Row 3: Description */}
            <div className="space-y-3">
              <Label icon={<FiInfo/>} text="Detailed Description" />
              <textarea 
                rows={4}
                placeholder="ওষুধটির ডোজ এবং ব্যবহারের নিয়মাবলী এখানে লিখুন..."
                className="w-full bg-[#fafbfc] border border-gray-100 p-5 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-black resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className={`w-full py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-2xl transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-[#040610] shadow-blue-600/20'
              }`}
            >
              {loading ? "Transmitting Data..." : "Deploy to Inventory ✨"}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}

// কাস্টম লেবেল কম্পোনেন্ট
function Label({ icon, text }: { icon: any, text: string }) {
  return (
    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">
      <span className="text-blue-600">{icon}</span> {text}
    </label>
  );
}

