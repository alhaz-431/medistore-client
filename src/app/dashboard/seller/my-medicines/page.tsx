"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPackage, FiLoader, FiSearch, FiAlertCircle } from "react-icons/fi";

const API_URL = "https://medistore-backend-server.vercel.app/api/medicines";

interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
}

export default function MyMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      // এপিআই রেসপন্স চেক করা
      const data = res.data.data || res.data;
      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("ডাটা আনতে সমস্যা হয়েছে:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${name}" ডিলিট করতে চান?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("ডিলিট সফল হয়েছে! 🎉");
        fetchMedicines();
      } catch (err) {
        alert("ডিলিট করা যায়নি! আবার চেষ্টা করুন।");
      }
    }
  };

  // সার্চ ফিল্টারিং
  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <FiLoader className="animate-spin text-blue-600" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Loading your catalog...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic text-[#040610]">
            Medicine <span className="text-blue-600">List</span> 📋
          </h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2 italic">
            Total {medicines.length} products listed
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search medicine..."
            className="w-full bg-white border border-gray-100 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafbfc] text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-50">
                <th className="px-8 py-6">Medicine Details</th>
                <th className="px-8 py-6">Manufacturer</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Stock Status</th>
                <th className="px-8 py-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredMedicines.map((med) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={med.id} 
                    className="hover:bg-blue-50/20 transition-all group"
                  >
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <FiPackage size={20} />
                        </div>
                        <span className="font-black text-gray-800 tracking-tight uppercase italic">{med.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{med.manufacturer}</span>
                    </td>
                    <td className="px-8 py-7">
                      <span className="font-black text-lg text-blue-600 italic">৳{med.price.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-7">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        med.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600 animate-pulse'
                      }`}>
                        {med.stock <= 0 ? <FiAlertCircle /> : null}
                        {med.stock > 0 ? `${med.stock} IN STOCK` : 'OUT OF STOCK'}
                      </div>
                    </td>
                    <td className="px-8 py-7 text-center">
                      <button 
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                        onClick={() => handleDelete(med.id, med.name)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && filteredMedicines.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No matching medicines found.</p>
          </div>
        )}
      </div>
    </div>
  );
}