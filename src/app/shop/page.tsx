"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiStar, FiEdit, FiShoppingCart, FiSearch, FiFilter } from "react-icons/fi";

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

  // ইউজার রোল চেক করার জন্য (সেলার কি না দেখার জন্য)
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(API_URL);
        setMedicines(res.data);
        // লোকাল স্টোরেজ থেকে রোল চেক করা
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
  const manufacturers = ["All", ...Array.from(new Set(medicines.map(m => m.manufacturer)))];

  // ১. রিভিউ ফাংশন (Customer Review Prompt)
  const handleReview = (medName: string) => {
    const comment = prompt(`${medName} সম্পর্কে আপনার মতামত বা রিভিউ লিখুন:`);
    if (comment) {
      alert("ধন্যবাদ! আপনার রিভিউটি সফলভাবে জমা হয়েছে। ⭐");
    }
  };

  // ২. সেলার এডিট ফাংশন (Quick Edit for Sellers)
  const handleQuickEdit = async (id: string, currentPrice: number, currentStock: number) => {
    const newPrice = prompt("নতুন দাম (Price) লিখুন:", currentPrice.toString());
    const newStock = prompt("নতুন স্টক (Stock) সংখ্যা লিখুন:", currentStock.toString());

    if (newPrice && newStock) {
      try {
        await axios.patch(`http://localhost:5000/api/medicines/${id}`, {
          price: parseFloat(newPrice),
          stock: parseInt(newStock)
        });
        alert("মেডিসিন আপডেট সফল হয়েছে! 🚀");
        window.location.reload(); 
      } catch (err) {
        alert("আপডেট করতে সমস্যা হয়েছে।");
      }
    }
  };

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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen font-sans text-black">
      <h1 className="text-4xl font-black text-blue-800 mb-8 text-center uppercase tracking-tighter">MediStore Shop 💊</h1>

      {/* সার্চ এবং ফিল্টার বার */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Search Medicine</label>
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full border-2 border-gray-50 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none bg-gray-50 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Category</label>
            <select 
              className="w-full border-2 border-gray-50 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none bg-gray-50 transition-all"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Max Price: {maxPrice}৳</label>
            <input
              type="range" min="0" max="2000" step="10"
              value={maxPrice}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* মেডিসিন লিস্ট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredMedicines.map((med) => (
          <div key={med.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all p-6 border border-gray-50 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                  {med.category?.name || "General"}
                </span>
                {userRole === "SELLER" && (
                  <button onClick={() => handleQuickEdit(med.id, med.price, med.stock)} className="p-2 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-600 hover:text-white transition-all">
                    <FiEdit size={16} />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">{med.name}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-3">{med.manufacturer}</p>
              <p className="text-gray-500 text-xs line-clamp-2 italic mb-4">{med.description}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center mb-5">
                <span className="text-2xl font-black text-gray-900">{med.price}৳</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${med.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {med.stock > 0 ? `In Stock: ${med.stock}` : "Out of Stock"}
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => addToCart(med)}
                  disabled={med.stock <= 0}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    med.stock > 0 
                      ? "bg-blue-600 text-white hover:bg-black shadow-lg shadow-blue-100" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FiShoppingCart /> {med.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                
                <button
                  onClick={() => handleReview(med.name)}
                  className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-blue-100"
                >
                  <FiStar /> Write Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] mt-10 border-2 border-dashed border-gray-100">
          <FiSearch className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-bold uppercase tracking-widest">No medicines found matching your filters. 🔍</p>
        </div>
      )}
    </div>
  );
}