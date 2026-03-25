"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar"; // নেভবার আবার ফিরিয়ে আনা হলো
import MedicineModal from "@/components/MedicineModal";

interface IMedicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
}

export default function Home() {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<IMedicine | null>(null);
  const [cartCount, setCartCount] = useState(0); // কার্ট স্টেট যোগ করা হলো

  useEffect(() => {
    const API_URL = "https://medistore-backend-server.vercel.app/api/medicines";
    const delayDebounceFn = setTimeout(() => {
      axios.get(`${API_URL}?search=${searchTerm}`)
        .then((res) => setMedicines(res.data))
        .catch((err) => console.log("ডাটা লোড করতে সমস্যা:", err));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // কার্ট বাটনে ক্লিক করলে সংখ্যা বাড়বে
  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* নেভবার এখানে কল করা হয়েছে এবং কার্ট কাউন্ট পাঠানো হচ্ছে */}
      <Navbar cartCount={cartCount} />

      <div className="p-10 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          {searchTerm ? (
            <span>Showing results for: &ldquo;{searchTerm}&rdquo;</span>
          ) : (
            "Our Medicines"
          )}
        </h2>

        {/* কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicines.map((medicine) => (
            <div 
              key={medicine.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-40 bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                💊
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{medicine.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{medicine.manufacturer}</p>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs text-gray-400 uppercase font-medium">Price</p>
                  <p className="text-2xl font-bold text-green-600">৳ {medicine.price}</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddToCart} // এখানে ফাংশনটি কল করা হয়েছে
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-md"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => setSelectedMedicine(medicine)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {medicines.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No medicines found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>

      <MedicineModal 
        medicine={selectedMedicine} 
        onClose={() => setSelectedMedicine(null)} 
      />
    </main>
  );
}