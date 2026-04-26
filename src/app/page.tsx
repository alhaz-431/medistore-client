"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion"; 
import { 
  FiTruck, FiShield, FiPhoneCall, 
  FiArrowRight, FiSearch, FiShoppingCart, FiActivity, FiPlus, FiEye, FiLoader, FiUploadCloud
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
      
      {/* ─── 1. DYNAMIC MARQUEE ─── */}
      <div className="relative w-full z-20 bg-[#070b18] border-b border-white/5 py-3 overflow-hidden whitespace-nowrap flex mt-1">
        <motion.div 
          animate={{ x: [0, -1500] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-24 items-center pr-24"
        >
          {[1, 2, 3, 4, 5].map((i) => (
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

      {/* ─── 2. PREMIUM HERO SECTION ─── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=2000" 
            alt="Pharmacy BG" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040610] via-[#040610]/85 to-[#040610]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-8 italic uppercase text-white">
              YOUR HEALTH <br />
              <span className="text-blue-600">EVOLVED.</span>
            </h1>
            <p className="text-slate-400 text-xl mb-12 font-bold leading-relaxed border-l-4 border-blue-600 pl-8 max-w-lg">
               MediStore: বাংলাদেশের সবথেকে বিশ্বস্ত ডিজিটাল ফার্মেসি। আপনার সুস্বাস্থ্যের জন্য আমরা দিচ্ছি শতভাগ অরিজিনাল ওষুধ এবং দ্রুততম হোম ডেলিভারি।
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => medicinesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-white hover:text-blue-950 text-white px-12 py-5 rounded-2xl font-black uppercase text-[12px] tracking-widest flex items-center gap-4 transition-all group shadow-2xl shadow-blue-600/20"
              >
                BROWSE MEDICINES <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 3. FEATURE CARDS ─── */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <FiTruck />, title: "Home Delivery", desc: "ঢাকার যেকোনো প্রান্তে ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি" },
          { icon: <FiShield />, title: "Authentic Meds", desc: "সরাসরি অনুমোদিত কোম্পানি থেকে সংগৃহীত" },
          { icon: <FiPhoneCall />, title: "Expert Advice", desc: "আমাদের অভিজ্ঞ ফার্মাসিস্টদের পরামর্শ নিন" }
        ].map((item, i) => (
          <div key={i} className="p-12 bg-[#101726] rounded-[3.5rem] border border-white/5 text-center group hover:bg-blue-600/5 transition-all duration-500">
             <div className="text-5xl text-blue-500 mb-8 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
             <h3 className="text-xl font-black uppercase italic text-white mb-4">{item.title}</h3>
             <p className="text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* ─── 4. UPLOAD PRESCRIPTION (NEW) ─── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900/20 to-[#101726] border border-blue-500/20 rounded-[4rem] p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-5xl font-black text-white uppercase italic mb-8">ওষুধ খুঁজে পাচ্ছেন না?</h2>
            <p className="text-slate-400 font-bold leading-relaxed mb-10 text-lg">
              আপনার প্রেসক্রিপশনের ছবি এখানে আপলোড করুন। আমাদের বিশেষজ্ঞ ফার্মাসিস্টরা আপনার অর্ডারটি প্রসেস করে কল দিবে।
            </p>
            <button className="bg-white text-blue-950 px-10 py-5 rounded-2xl font-black uppercase text-[12px] tracking-widest flex items-center gap-4 hover:bg-blue-600 hover:text-white transition-all mx-auto lg:mx-0 shadow-xl">
              UPLOAD PRESCRIPTION <FiUploadCloud size={20} />
            </button>
          </div>
          <div className="w-full max-w-sm aspect-square bg-[#040610] rounded-[4rem] border-2 border-dashed border-blue-500/30 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 transition-all">
             <FiUploadCloud className="text-blue-500 text-7xl mb-6 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" />
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/50 group-hover:text-blue-500">Drop Image Here</span>
          </div>
        </div>
      </section>

      {/* ─── 5. MEDICINE STOCK ─── */}
      <section ref={medicinesRef} className="py-24 px-8 max-w-7xl mx-auto bg-[#0b0f1a] rounded-[5rem] border border-white/5 shadow-3xl my-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10 px-6">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Live <span className="text-blue-500">Inventory</span></h2>
            <div className="relative w-full max-w-lg group">
                <FiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors size-6" />
                <input 
                  type="text" 
                  placeholder="Search by medicine name or company..." 
                  className="w-full pl-16 pr-8 py-6 rounded-3xl bg-[#101726] border border-white/5 focus:border-blue-600 outline-none font-bold text-white transition-all shadow-inner"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-blue-500">
            <FiLoader className="text-6xl animate-spin mb-6" />
            <p className="font-black uppercase tracking-[0.4em] text-[12px]">Fetching Health Data...</p>
          </div>
        ) : medicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {medicines.map((med, idx) => (
              <motion.div 
                key={med.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="group bg-[#1c263d]/20 border border-white/5 rounded-[3rem] p-8 hover:bg-[#1c263d]/40 transition-all duration-500 flex flex-col"
              >
                <div className="h-48 rounded-[2.5rem] bg-black/40 overflow-hidden mb-8 border border-white/5 relative">
                   <img 
                      src={med.image || medicineImages[idx % medicineImages.length]} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-all duration-700" 
                      alt={med.name} 
                   />
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{med.manufacturer}</p>
                  <h3 className="text-xl font-black italic text-white mb-3 truncate group-hover:text-blue-400 transition-colors">{med.name}</h3>
                  <p className="text-3xl font-black text-white italic tracking-tighter mb-8">৳{med.price}</p>
                </div>
                <div className="flex gap-4 border-t border-white/5 pt-8">
                  <button className="flex-grow flex items-center justify-center gap-3 bg-blue-600 hover:bg-white text-white hover:text-blue-950 py-4 rounded-2xl transition-all shadow-lg active:scale-95">
                    <FiShoppingCart className="text-lg" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Buy Now</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#101726]/50 rounded-[3rem]">
            <p className="text-slate-500 font-black uppercase tracking-widest italic">Out of Stock or Not Found.</p>
          </div>
        )}
      </section>

      {/* ─── 6. HEALTH STATISTICS ─── */}
      <section className="py-24 bg-[#070b18] border-y border-white/5 mb-24">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-16">
          {[
            { label: "Patients Served", value: "85k+" },
            { label: "Product Skus", value: "14k+" },
            { label: "Verified Pharmacists", value: "24" },
            { label: "Delivery Points", value: " Dhaka Area" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-5xl md:text-6xl font-black text-white italic mb-4">{stat.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. REVIEWS & TRUST ─── */}
      <section className="py-24 px-8 max-w-7xl mx-auto mb-32">
        <div className="text-center mb-20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Testimonials</h4>
            <h2 className="text-5xl font-black text-white italic uppercase italic">Trusted by Thousands</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { name: "Alfaz ARbby", text: "আমি সবসময় এই সাইট থেকে ওষুধ কিনি। তাদের ডেলিভারি স্পিড এবং কাস্টমার সার্ভিস সত্যিই অসাধারণ।" },
            { name: "Sifat Rahman", text: "মেডিসিনগুলো ১০০% অরিজিনাল এবং দামও অনেক সাশ্রয়ী। হাইলি রিকমেন্ডেড!" }
          ].map((item, i) => (
            <div key={i} className="bg-[#101726] p-16 rounded-[4rem] border border-white/5 relative group hover:border-blue-500/30 transition-all">
                <p className="text-xl text-slate-400 font-bold italic leading-relaxed mb-10 border-l-4 border-blue-600 pl-8">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center font-black text-white text-2xl italic shadow-2xl">A</div>
                  <h4 className="font-black uppercase text-[12px] tracking-[0.2em] text-white">{item.name}</h4>
                </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}