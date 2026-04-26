"use client";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiPackage, FiLoader, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios"; // ✅ আপনার তৈরি করা সেন্ট্রালাইজড axios instance

interface Medicine {
  id: string;
  name: string;
  category: { name: string } | string; // API স্ট্রাকচার অনুযায়ী
  price: number;
  stock: number;
  manufacturer: string;
}

export default function MyInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ ডাটা ফেচিং লজিক
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/medicines/seller-own"); // আপনার ব্যাকএন্ড এন্ডপয়েন্ট অনুযায়ী
      const data = res.data.data || res.data;
      setMedicines(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ✅ ডিলিট লজিক
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}" ডিলিট করতে চান?`)) {
      try {
        await api.delete(`/medicines/${id}`);
        setMedicines(medicines.filter((item) => item.id !== id));
        alert("ওষুধটি সফলভাবে ডিলিট হয়েছে।");
      } catch (error) {
        alert("ডিলিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    }
  };

  return (
    <div className="p-6 md:p-12 bg-[#fafbfc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-1 w-8 bg-blue-600 rounded-full"></span>
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Warehouse Management</p>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-[#040610] italic">
              Stock <span className="text-blue-600">Central</span> 📦
            </h1>
          </motion.div>
          
          <Link 
            href="/dashboard/seller/add-medicine" 
            className="bg-[#040610] text-white px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-blue-900/20 active:scale-95"
          >
            <FiPlus size={20} /> Add New Entry
          </Link>
        </div>

        {/* --- Stats Summary --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[3.5rem] border border-gray-50 shadow-sm flex items-center gap-6 group hover:border-blue-100 transition-all">
            <div className="bg-blue-50 p-5 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FiPackage size={32} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Live Inventory</h3>
              <p className="text-4xl font-black mt-1 text-[#040610] italic leading-none">
                {loading ? "..." : medicines.length} <span className="text-xs not-italic text-gray-300 uppercase">Items</span>
              </p>
            </div>
          </div>
          
          {/* লো-স্টক এলার্ট কার্ড */}
          {medicines.some(m => m.stock < 20) && (
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-red-50 p-8 rounded-[3.5rem] border border-red-100 shadow-sm flex items-center gap-6">
              <div className="bg-red-500 p-5 rounded-2xl text-white">
                <FiAlertCircle size={32} />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase text-red-400 tracking-[0.3em]">Critical Alert</h3>
                <p className="text-xl font-black mt-1 text-red-600 uppercase italic">Stock is Low!</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* --- Inventory Table --- */}
        <div className="bg-white rounded-[4rem] border border-gray-50 shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafbfc] text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-50">
                  <th className="px-12 py-8">Product / MFG</th>
                  <th className="px-8 py-8">Category</th>
                  <th className="px-8 py-8">Unit Price</th>
                  <th className="px-8 py-8">Available Stock</th>
                  <th className="px-12 py-8 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-40 text-center">
                      <div className="flex flex-col items-center gap-5">
                        <FiLoader className="animate-spin text-blue-600" size={40} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Synchronizing Data...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  medicines.map((item) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className="hover:bg-blue-50/30 transition-all group"
                    >
                      <td className="px-12 py-8">
                        <div className="flex flex-col">
                          <span className="font-black text-lg text-[#040610] tracking-tighter uppercase italic leading-none mb-1 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.manufacturer}</span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter italic">
                          {typeof item.category === 'object' ? item.category.name : item.category}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <span className="font-black text-xl text-[#040610] tracking-tighter italic">৳{item.price.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col gap-2">
                          <span className={`text-[11px] font-black uppercase tracking-widest italic ${item.stock < 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {item.stock < 20 ? 'Low Stock' : 'In Stock'}: {item.stock}
                          </span>
                          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((item.stock/500)*100, 100)}%` }}
                              className={`h-full rounded-full ${item.stock < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            ></motion.div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-right">
                        <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <Link href={`/dashboard/seller/edit-medicine/${item.id}`} className="p-4 bg-white text-blue-600 border border-blue-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <FiEdit size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-4 bg-white text-red-500 border border-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {!loading && medicines.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center">
               <FiPackage size={60} className="text-gray-100 mb-4" />
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No Medicines Found in your inventory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}