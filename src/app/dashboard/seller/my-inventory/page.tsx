"use client";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiPackage, FiLoader } from "react-icons/fi";
import Link from "next/link";

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
}

export default function MyInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ এরর-মুক্ত ডাটা লোডিং লজিক (Async/Await ব্যবহার করে)
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // ছোট একটি ডিলে দিচ্ছি যাতে Cascading Render এরর না আসে
        await new Promise((resolve) => setTimeout(resolve, 100));

        const dummyData: Medicine[] = [
          { id: "MED-001", name: "Napa Extend", category: "Tablet", price: 15, stock: 500, unit: "Pcs" },
          { id: "MED-002", name: "Ace Plus", category: "Tablet", price: 12, stock: 85, unit: "Pcs" },
          { id: "MED-003", name: "Seclo 20mg", category: "Capsule", price: 7, stock: 1000, unit: "Pcs" },
          { id: "MED-004", name: "Fexo 120", category: "Tablet", price: 8, stock: 45, unit: "Pcs" },
        ];

        setMedicines(dummyData);
      } catch (error) {
        console.error("Error loading inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#040610]">
              My <span className="text-blue-600">Inventory</span> 📦
            </h1>
            <p className="text-gray-500 font-bold text-sm mt-2 uppercase tracking-widest opacity-70">
              Manage your pharmacy stock and pricing
            </p>
          </div>
          <Link 
            href="/dashboard/seller/add-medicine" 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            <FiPlus size={20} /> Add New Item
          </Link>
        </div>

        {/* --- STATS CARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <FiPackage size={30} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Products</h3>
              <p className="text-3xl font-black mt-1 text-gray-900">{loading ? "..." : medicines.length}</p>
            </div>
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <th className="px-10 py-6">Product Details</th>
                  <th className="px-6 py-6">Category</th>
                  <th className="px-6 py-6">Price</th>
                  <th className="px-6 py-6">Stock Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <FiLoader className="animate-spin text-blue-600" size={32} />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-300">Loading Inventory...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  medicines.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-10 py-7">
                        <div className="flex flex-col">
                          <span className="font-black text-base text-gray-800 tracking-tight">{item.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-7">
                        <span className="font-black text-gray-900">৳ {item.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[11px] font-black uppercase ${item.stock < 100 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {item.stock} {item.unit}
                          </span>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.stock < 100 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min((item.stock/1000)*100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <FiEdit size={16} />
                          </button>
                          <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}