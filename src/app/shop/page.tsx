"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiStar, FiEdit, FiShoppingCart, FiSearch, FiEye } from "react-icons/fi";
import MedicineModal from "@/components/MedicineModal"; // আপনার ফোল্ডার পাথ অনুযায়ী চেক করে নিন

// ব্যাকএন্ড লিঙ্ক
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api/v1/medicines";

interface IMedicine {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  stock: number;
  description: string;
  category?: { name: string };
}

interface ICartItem extends IMedicine {
  quantity: number;
}

export default function ShopPage() {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000); 
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<IMedicine | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(API_URL);
        // যদি ডাটা সরাসরি অ্যারে না হয়ে res.data.data তে থাকে তবে সেভাবে সেট করবেন
        setMedicines(Array.isArray(res.data) ? res.data : res.data.data || []);
        
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserRole(user.role || "CUSTOMER");
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const categories = ["All", ...Array.from(new Set(medicines.map(m => m.category?.name || "General")))];

  // ১. অ্যাড টু কার্ট ফাংশন
  const addToCart = (medicine: IMedicine) => {
    const existingCart: ICartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemIndex = existingCart.findIndex((item) => item.id === medicine.id);

    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ ...medicine, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // নেভবারকে জানানোর জন্য কাস্টম ইভেন্ট
    window.dispatchEvent(new Event("cartUpdated")); 
    alert(`${medicine.name} কার্টে যোগ করা হয়েছে! 🛒`);
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = med.price <= maxPrice;
    const matchesCategory = selectedCategory === "All" || (med.category?.name || "General") === selectedCategory;
    return matchesSearch && matchesPrice && matchesCategory;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-black text-blue-600 animate-pulse uppercase tracking-widest">
      Loading Medicines... 💊
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#fafbfc] min-h-screen font-sans text-black">
      
      {/* হেডার */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black text-[#040610] italic uppercase tracking-tighter">
          Medi<span className="text-blue-600">Store</span> Catalog
        </h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">Premium Pharmaceutical Supply</p>
      </div>

      {/* সার্চ এবং ফিল্টার বার */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search medications..."
              className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold cursor-pointer transition-all appearance-none"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
          </select>

          <div className="px-2">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Max Price</span>
              <span className="text-sm font-black text-blue-600">৳{maxPrice}</span>
            </div>
            <input
              type="range" min="0" max="2000" step="10"
              value={maxPrice}
              className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* মেডিসিন গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredMedicines.map((med) => (
          <div key={med.id} className="bg-white rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 p-7 border border-gray-50 flex flex-col justify-between group relative overflow-hidden">
            
            {/* কার্ড ডিজাইন */}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-50 px-4 py-1.5 rounded-full tracking-widest border border-blue-100">
                  {med.category?.name || "General"}
                </span>
                <span className="text-xl font-black text-gray-900 italic">৳{med.price}</span>
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 leading-none mb-2 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">
                {med.name}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">
                {med.manufacturer}
              </p>
            </div>

            <div className="space-y-3 relative z-10 pt-4 border-t border-gray-50">
              {/* ভিউ ডিটেইলস বাটন */}
              <button
                onClick={() => setSelectedMedicine(med)}
                className="w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-white bg-gray-50 hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <FiEye /> View Details
              </button>

              {/* অ্যাড টু কার্ট বাটন */}
              <button
                onClick={() => addToCart(med)}
                disabled={med.stock <= 0}
                className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 ${
                  med.stock > 0 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FiShoppingCart /> {med.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ডিটেইলস মোডাল */}
      <MedicineModal 
        medicine={selectedMedicine} 
        onClose={() => setSelectedMedicine(null)} 
      />

    
      
    </div>
  );
}