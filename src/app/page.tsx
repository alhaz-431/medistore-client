"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion"; 
import { 
  FiTruck, FiShield, FiPhoneCall, 
  FiArrowRight, FiSearch, FiShoppingCart, FiActivity, FiPlus, FiEye, FiLoader
} from "react-icons/fi";

interface IMedicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
  image?: string; 
}

export default function Home() {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // লোডিং স্টেট
  const medicinesRef = useRef<HTMLDivElement>(null);

  const medicineImages = [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=500",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=500",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=500",
  ];

  useEffect(() => {
    // আপনার লাইভ রেন্ডার এপিআই লিঙ্ক
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api/v1";
    
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/medicines`, {
          params: { search: searchTerm }
        });
        
        // ব্যাকএন্ডের রেসপন্স ফরম্যাট অনুযায়ী ডাটা সেট করা
        // আপনার ব্যাকএন্ড যদি { data: [...] } পাঠায় তবে res.data.data হবে
        const fetchedData = Array.isArray(res.data) ? res.data : res.data.data || [];
        setMedicines(fetchedData);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="bg-[#040610] min-h-screen text-slate-300 font-sans selection:bg-blue-600/40 overflow-x-hidden">
      
      {/* ─── 1. MARQUEE ─── */}
      <div className="pt-[10px]"> 
         <div className="relative w-full z-20 bg-[#070b18] border-b border-white/5 py-3 overflow-hidden whitespace-nowrap flex">
            <motion.div 
              animate={{ x: [0, -1200] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex gap-24 items-center pr-24"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-24 items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 flex items-center gap-3">
                    <FiActivity className="animate-pulse" /> 100% Original Medicines
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-3">
                    <FiPlus className="animate-spin-slow" /> Fast Delivery Across Dhaka
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 flex items-center gap-3">
                    <FiShield /> Certified Pharmacy Partner
                  </span>
                </div>
              ))}
            </motion.div>
         </div>
      </div>

      {/* ─── 2. HERO SECTION ─── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=2000" 
            alt="Pharmacy BG" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040610] via-[#040610]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 italic uppercase text-white">
              HEALTH <br />
              <span className="text-blue-500">SIMPLIFIED.</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl mb-12 font-bold leading-relaxed border-l-4 border-blue-600 pl-6 max-w-lg">
               আপনার প্রয়োজনীয় সকল ওষুধ এখন এক ক্লিকেই। <br /> 
               দ্রুত ডেলিভারি আর বিশ্বস্ততার নাম MediStore।
            </p>
            
            <button 
              onClick={() => medicinesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-white hover:text-blue-950 text-white px-10 py-4 rounded-xl font-black uppercase text-[12px] tracking-widest flex items-center gap-4 transition-all group"
            >
              EXPLORE STOCK <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── 3. FEATURES SECTION ─── */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <FiTruck />, title: "Cash On Delivery", desc: "ঢাকার যেকোনো প্রান্তে দ্রুত ডেলিভারি" },
          { icon: <FiShield />, title: "100% Original", desc: "সরাসরি অথরাইজড সোর্স থেকে সংগৃহীত" },
          { icon: <FiPhoneCall />, title: "24/7 Support", desc: "যেকোনো প্রয়োজনে আমাদের কল করুন" }
        ].map((item, i) => (
          <div key={i} className="p-10 bg-[#101726] rounded-[3rem] border border-white/5 text-center group hover:bg-blue-600/5 transition-all">
             <div className="text-4xl text-blue-500 mb-6 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
             <h3 className="text-lg font-black uppercase italic text-white mb-2">{item.title}</h3>
             <p className="text-sm text-slate-500 font-bold">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* ─── 4. MEDICINE INVENTORY ─── */}
      <section ref={medicinesRef} className="py-24 px-8 max-w-7xl mx-auto bg-[#0b0f1a] rounded-[4rem] border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white px-4">Medicine <span className="text-blue-500">Stock</span></h2>
            <div className="relative w-full max-w-md group px-4">
                <FiSearch className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search medicines..." 
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all shadow-inner"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* লোডিং ইন্ডিকেটর */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500">
            <FiLoader className="text-5xl animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-[10px]">Loading Medicines...</p>
          </div>
        ) : medicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {medicines.map((med, idx) => (
              <motion.div 
                key={med.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-[#1c263d]/30 border border-white/5 rounded-[2.5rem] p-6 hover:bg-[#1c263d]/60 transition-all duration-500 flex flex-col h-full"
              >
                <div className="h-44 rounded-[1.8rem] bg-black/40 overflow-hidden mb-6 border border-white/5 relative flex-shrink-0">
                   <img 
                      src={med.image || medicineImages[idx % medicineImages.length]} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-all duration-700" 
                      alt={med.name} 
                   />
                </div>

                <div className="px-1 flex-grow">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">{med.manufacturer}</p>
                  <h3 className="text-lg font-black italic text-white mb-2 truncate group-hover:text-blue-400 transition-colors">{med.name}</h3>
                  <p className="text-2xl font-black text-white italic tracking-tighter mb-6">৳{med.price}</p>
                </div>
                  
                <div className="grid grid-cols-2 gap-3 mt-auto border-t border-white/5 pt-6">
                  <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-white text-white hover:text-blue-950 py-3 rounded-xl transition-all shadow-lg active:scale-95 group/btn">
                    <FiShoppingCart className="text-sm" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Add to Cart</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl border border-white/5 transition-all active:scale-95">
                    <FiEye className="text-sm" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">View Details</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 font-bold">No medicines found in stock.</p>
          </div>
        )}
      </section>

      {/* ─── 5. REVIEWS ─── */}
      <section className="py-24 px-6 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { name: "Alfaz ARbby", text: "অর্ডার করার পর খুব দ্রুত ওষুধ পেয়েছি। প্যাকেজিং সত্যিই প্রশংসনীয়!" },
            { name: "Sifat Rahman", text: "সব প্রয়োজনীয় মেডিসিন সহজেই পাওয়া যায়। ইন্টারফেসটা খুব চমৎকার।" }
          ].map((item, i) => (
            <div key={i} className="bg-[#101726] p-12 rounded-[3.5rem] border border-white/5">
                <p className="text-lg text-slate-400 font-bold italic leading-relaxed mb-8 border-l-2 border-blue-600 pl-6">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl italic shadow-lg">A</div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest text-white">{item.name}</h4>
                </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}