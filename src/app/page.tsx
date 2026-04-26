"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion"; 
import { 
  FiTruck, FiShield, FiPhoneCall, 
  FiArrowRight, FiSearch, FiShoppingCart, FiActivity, FiPlus, FiLoader, FiUploadCloud
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
  const [loading, setLoading] = useState<boolean>(true);
  const medicinesRef = useRef<HTMLDivElement>(null);

  const medicineImages = [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=500",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=500",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=500",
  ];

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api/v1";
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/medicines`, {
          params: { search: searchTerm }
        });
        const fetchedData = Array.isArray(res.data) ? res.data : res.data.data || [];
        setMedicines(fetchedData);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchMedicines, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="bg-[#040610] min-h-screen text-slate-300 font-sans selection:bg-blue-600/40 overflow-x-hidden">
      
      {/* ─── 1. DYNAMIC MARQUEE (FIXED) ─── */}
      <div className="relative w-full z-20 bg-[#070b18] border-b border-white/5 py-3 overflow-hidden whitespace-nowrap flex">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-12 md:gap-24 items-center pr-12 md:pr-24"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-12 md:gap-24 items-center shrink-0">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-blue-500 flex items-center gap-3">
                <FiActivity className="animate-pulse" /> 100% Original
              </span>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white flex items-center gap-3">
                <FiPlus className="animate-spin-slow" /> Fast Delivery
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ─── 2. PREMIUM HERO SECTION (FIXED TEXT HIERARCHY) ─── */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=2000" 
            alt="Pharmacy BG" 
            className="w-full h-full object-cover opacity-40 md:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040610] via-[#040610]/90 md:via-[#040610]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-8 italic uppercase text-white">
              YOUR HEALTH <br />
              <span className="text-blue-600">EVOLVED.</span>
            </h1>
            <p className="text-slate-400 text-base md:text-xl mb-12 font-bold leading-relaxed border-l-4 border-blue-600 pl-6 md:pl-8 max-w-lg">
               বাংলাদেশের সবথেকে বিশ্বস্ত ডিজিটাল ফার্মেসি। দ্রুততম হোম ডেলিভারি নিশ্চিত করছি আমরা।
            </p>
            <button 
              onClick={() => medicinesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-white hover:text-blue-950 text-white px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[12px] tracking-widest flex items-center gap-4 transition-all shadow-2xl shadow-blue-600/20"
            >
              BROWSE MEDICINES <FiArrowRight />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── 3. FEATURE CARDS (RESPONSIVE GRID) ─── */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: <FiTruck />, title: "Home Delivery", desc: "ঢাকার যেকোনো প্রান্তে ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি" },
          { icon: <FiShield />, title: "Authentic Meds", desc: "সরাসরি অনুমোদিত কোম্পানি থেকে সংগৃহীত" },
          { icon: <FiPhoneCall />, title: "Expert Advice", desc: "আমাদের অভিজ্ঞ ফার্মাসিস্টদের পরামর্শ নিন" }
        ].map((item, i) => (
          <div key={i} className="p-8 md:p-12 bg-[#101726] rounded-[2rem] md:rounded-[3.5rem] border border-white/5 text-center group hover:bg-blue-600/5 transition-all">
              <div className="text-4xl md:text-5xl text-blue-500 mb-6 flex justify-center">{item.icon}</div>
              <h3 className="text-lg md:text-xl font-black uppercase italic text-white mb-4">{item.title}</h3>
              <p className="text-xs md:text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* ─── 4. UPLOAD PRESCRIPTION (RE-STRUCTURED) ─── */}
      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900/20 to-[#101726] border border-blue-500/20 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic mb-6">ওষুধ খুঁজে পাচ্ছেন না?</h2>
            <p className="text-slate-400 font-bold leading-relaxed mb-8 text-sm md:text-lg">
              আপনার প্রেসক্রিপশনের ছবি আপলোড করুন। আমাদের বিশেষজ্ঞ ফার্মাসিস্টরা আপনার অর্ডারটি প্রসেস করবে।
            </p>
            <button className="bg-white text-blue-950 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-4 hover:bg-blue-600 hover:text-white transition-all mx-auto lg:mx-0">
              UPLOAD PRESCRIPTION <FiUploadCloud />
            </button>
          </div>
          <div className="w-full max-w-[300px] md:max-w-sm aspect-square bg-[#040610] rounded-[2.5rem] md:rounded-[4rem] border-2 border-dashed border-blue-500/30 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 transition-all">
              <FiUploadCloud className="text-blue-500 text-5xl md:text-7xl mb-4 opacity-30 group-hover:opacity-100 transition-all" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/50">Drop Image Here</span>
          </div>
        </div>
      </section>

      {/* ─── 5. MEDICINE STOCK (GRID FIX) ─── */}
      <section ref={medicinesRef} className="py-16 md:py-24 px-6 md:px-8 max-w-7xl mx-auto bg-[#0b0f1a] rounded-[3rem] md:rounded-[5rem] border border-white/5 my-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-20 gap-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic text-white">Live <span className="text-blue-500">Inventory</span></h2>
            <div className="relative w-full max-w-md group">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  placeholder="Search medicine..." 
                  className="w-full pl-14 pr-6 py-4 md:py-5 rounded-2xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white text-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500">
            <FiLoader className="text-5xl animate-spin mb-4" />
            <p className="font-black uppercase tracking-widest text-[10px]">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {medicines.map((med, idx) => (
              <motion.div key={med.id || idx} className="bg-[#1c263d]/20 border border-white/5 rounded-[2.5rem] p-6 flex flex-col group hover:bg-[#1c263d]/40 transition-all">
                <div className="h-40 md:h-48 rounded-[2rem] bg-black/40 overflow-hidden mb-6 border border-white/5">
                   <img src={med.image || medicineImages[idx % medicineImages.length]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={med.name} />
                </div>
                <div className="flex-grow">
                  <p className="text-[9px] font-black text-blue-500 uppercase mb-1">{med.manufacturer}</p>
                  <h3 className="text-lg md:text-xl font-black italic text-white mb-2 truncate">{med.name}</h3>
                  <p className="text-2xl md:text-3xl font-black text-white italic tracking-tighter mb-6">৳{med.price}</p>
                </div>
                <button className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-white text-white hover:text-blue-950 py-3 md:py-4 rounded-xl transition-all">
                  <FiShoppingCart /> <span className="text-[10px] font-black uppercase">Buy Now</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 6. STATISTICS (OVERFLOW FIX) ─── */}
      <section className="py-16 md:py-24 bg-[#070b18] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Patients Served", value: "85k+" },
            { label: "Product Skus", value: "14k+" },
            { label: "Verified Pharmacists", value: "24" },
            { label: "Delivery Points", value: "Dhaka" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl md:text-6xl font-black text-white italic mb-2 md:mb-4">{stat.value}</h3>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-blue-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. TESTIMONIALS (LAYOUT BALANCED) ─── */}
      <section className="py-20 px-6 max-w-7xl mx-auto mb-20">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase">Trusted by Thousands</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {[
            { name: "Alfaz ARbby", text: "ডেলিভারি স্পিড এবং কাস্টমার সার্ভিস সত্যিই অসাধারণ।" },
            { name: "Sifat Rahman", text: "মেডিসিনগুলো ১০০% অরিজিনাল এবং দামও অনেক সাশ্রয়ী।" }
          ].map((item, i) => (
            <div key={i} className="bg-[#101726] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 relative group transition-all">
                <p className="text-base md:text-lg text-slate-400 font-bold italic leading-relaxed mb-8 border-l-4 border-blue-600 pl-6">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic">A</div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest text-white">{item.name}</h4>
                </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}