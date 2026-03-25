"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/medicines";

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
  const [selectedManufacturer, setSelectedManufacturer] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(API_URL);
        setMedicines(res.data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // ইউনিক ক্যাটাগরি এবং ম্যানুফ্যাকচারার লিস্ট তৈরি করা
  const categories = ["All", ...Array.from(new Set(medicines.map(m => m.category?.name || "General")))];
  const manufacturers = ["All", ...Array.from(new Set(medicines.map(m => m.manufacturer)))];

  const addToCart = (medicine: IMedicine) => {
    const existingCart: ICartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemIndex = existingCart.findIndex((item) => item.id === medicine.id);

    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ ...medicine, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated")); 
    alert(`${medicine.name} কার্টে যোগ করা হয়েছে! 🛒`);
  };

  // ✅ ফিল্টারিং লজিক আপডেট
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = med.price <= maxPrice;
    const matchesCategory = selectedCategory === "All" || (med.category?.name || "General") === selectedCategory;
    const matchesManufacturer = selectedManufacturer === "All" || med.manufacturer === selectedManufacturer;

    return matchesSearch && matchesPrice && matchesCategory && matchesManufacturer;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-bold text-xl text-blue-600 animate-pulse">
      ওষুধ লোড হচ্ছে... 💊
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-black text-blue-800 mb-8 text-center">MediStore Shop 💊</h1>

      {/* সার্চ এবং মাল্টি-ফিল্টার বার */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-50 mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* সার্চ */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">সার্চ করুন</label>
            <input
              type="text"
              placeholder="Napa, Fexo..."
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none bg-gray-50 text-black"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ক্যাটাগরি ফিল্টার */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">ক্যাটাগরি</label>
            <select 
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none bg-gray-50 text-black"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* ম্যানুফ্যাকচারার ফিল্টার */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">প্রস্তুতকারক (Manufacturer)</label>
            <select 
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none bg-gray-50 text-black"
              onChange={(e) => setSelectedManufacturer(e.target.value)}
            >
              {manufacturers.map(man => <option key={man} value={man}>{man}</option>)}
            </select>
          </div>
        </div>

        {/* প্রাইস রেঞ্জ ফিল্টার */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-gray-600">সর্বোচ্চ দাম: </label>
            <span className="font-bold text-blue-600">{maxPrice} ৳</span>
          </div>
          <input
            type="range" min="0" max="2000" step="10"
            value={maxPrice}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {/* মেডিসিন লিস্ট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredMedicines.map((med) => (
          <div key={med.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-5 border border-gray-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">
                {med.category?.name || "General"}
              </span>
              <h2 className="text-xl font-bold text-gray-800 mt-3">{med.name}</h2>
              <p className="text-xs text-gray-400 font-semibold mb-3">{med.manufacturer}</p>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10 italic">
                {med.description}
              </p>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-5">
                <span className="text-2xl font-black text-gray-900">{med.price} ৳</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${med.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {med.stock > 0 ? `Stock: ${med.stock}` : "Stock Out"}
                </span>
              </div>
              <button
                onClick={() => addToCart(med)}
                disabled={med.stock <= 0}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 ${
                  med.stock > 0 
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {med.stock > 0 ? "Add to Cart 🛒" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">আপনার ফিল্টার অনুযায়ী কোনো ওষুধ পাওয়া যায়নি। 🔍</p>
        </div>
      )}
    </div>
  );
}