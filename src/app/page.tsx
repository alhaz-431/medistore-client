"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MedicineModal from "@/components/MedicineModal";
import { 
  FiTruck, FiShield, FiPhoneCall, FiStar, 
  FiArrowRight, FiPlusSquare, FiActivity, FiMail, FiMapPin, 
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiClock
} from "react-icons/fi";

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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const API_URL = "https://medistore-backend-server.vercel.app/api/medicines";
    const delayDebounceFn = setTimeout(() => {
      axios.get(`${API_URL}?search=${searchTerm}`)
        .then((res) => setMedicines(res.data))
        .catch((err) => console.log("ডাটা লোড করতে সমস্যা:", err));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen text-black font-sans">
      <Navbar cartCount={cartCount} />

      {/* 1. HERO SECTION WITH FIXED IMAGE */}
      <section className="relative min-h-[650px] flex items-center bg-blue-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2000&auto=format&fit=crop" 
            alt="Medical Banner" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/70 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="bg-blue-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block shadow-xl shadow-blue-500/30 animate-bounce">
              Official Pharmacy Partner
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 italic uppercase text-white">
              Health <br />
              <span className="text-blue-400">Simplified.</span>
            </h1>
            <p className="text-blue-100 text-xl mb-12 font-medium max-w-lg leading-relaxed border-l-4 border-blue-400 pl-6">
              আপনার প্রয়োজনীয় সকল ওষুধ এখন এক ক্লিকেই। দ্রুত ডেলিভারি আর বিশ্বস্ততার নাম MediStore।
            </p>
            <button 
              onClick={() => window.scrollTo({top: 900, behavior: 'smooth'})}
              className="bg-blue-500 hover:bg-white hover:text-blue-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/40"
            >
              Start Shopping <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US (COLOR CARDS) */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: <FiTruck size={40}/>, title: "Fast Delivery", desc: "ঢাকার মধ্যে ১২ ঘণ্টায় ডেলিভারি।", color: "bg-blue-600" },
          { icon: <FiShield size={40}/>, title: "Safe & Secure", desc: "১০০% অরিজিনাল ওষুধের নিশ্চয়তা।", color: "bg-cyan-500" },
          { icon: <FiPhoneCall size={40}/>, title: "Expert Care", desc: "ফার্মাসিস্টদের সরাসরি পরামর্শ।", color: "bg-indigo-600" }
        ].map((item, i) => (
          <div key={i} className="p-12 bg-white rounded-[3.5rem] shadow-xl shadow-gray-200/50 hover:-translate-y-4 transition-all duration-500 border border-gray-50 group">
            <div className={`w-20 h-20 ${item.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg rotate-3 group-hover:rotate-12 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-4">{item.title}</h3>
            <p className="text-gray-400 font-bold text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. MEDICINE LIST (GRID) */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white rounded-[5rem] shadow-sm border border-gray-100 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8 px-10">
          <div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Our <span className="text-blue-600">Inventory</span></h2>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">Verified Pharmaceutical Products</p>
          </div>
          <input 
            type="text" 
            placeholder="Search for medicine..." 
            className="w-full md:w-96 p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 outline-none font-bold transition-all shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="bg-gray-50/50 p-8 rounded-[3.5rem] border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl transition-all group">
              <div className="h-48 bg-white rounded-[3rem] mb-8 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform shadow-inner border border-gray-50">
                💊
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{medicine.name}</h3>
              <p className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] mb-8">{medicine.manufacturer}</p>
              
              <div className="flex justify-between items-center pt-8 border-t border-dashed border-gray-200">
                <div>
                  <span className="text-gray-400 text-[10px] font-black uppercase block">Price</span>
                  <p className="text-3xl font-black text-gray-900">৳{medicine.price}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddToCart} className="p-5 bg-black text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg">
                    <FiPlusSquare size={22} />
                  </button>
                  <button onClick={() => setSelectedMedicine(medicine)} className="px-8 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MASSIVE FOOTER SECTION */}
      <footer className="bg-[#0F172A] text-white pt-32 pb-12 rounded-t-[6rem] px-8 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5">
            <FiActivity size={400} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-1">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-white">
                Medi<span className="text-blue-500">Store</span>
              </h2>
              <p className="text-gray-400 font-bold text-sm leading-relaxed mb-10">
                আপনার বিশ্বস্ত অনলাইন ফার্মেসি। আমরা আপনার সুস্বাস্থ্য নিশ্চিতে সবসময় কাজ করে যাচ্ছি।
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer border border-white/10 text-blue-400 hover:text-white">
                  <FiFacebook size={20}/>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer border border-white/10 text-blue-400 hover:text-white">
                  <FiInstagram size={20}/>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer border border-white/10 text-blue-400 hover:text-white">
                  <FiTwitter size={20}/>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-blue-500">Shop Links</h4>
              <ul className="space-y-5 text-gray-400 font-bold text-sm">
                <li><Link href="/medicines" className="hover:text-blue-400 transition-colors">All Medicines</Link></li>
                <li><Link href="/categories" className="hover:text-blue-400 transition-colors">Categories</Link></li>
                <li><Link href="/new-arrivals" className="hover:text-blue-400 transition-colors">New Arrivals</Link></li>
                <li><Link href="/offers" className="hover:text-blue-400 transition-colors">Special Offers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-blue-500">Support</h4>
              <ul className="space-y-5 text-gray-400 font-bold text-sm">
                <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
                <li><Link href="/returns" className="hover:text-blue-400 transition-colors">Return Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-blue-500">Connect</h4>
              <ul className="space-y-5 text-gray-400 font-bold text-sm">
                <li className="flex items-center gap-4"><FiMail className="text-blue-500"/> contact@medistore.com</li>
                <li className="flex items-center gap-4"><FiPhoneCall className="text-blue-500"/> +880 1700-000000</li>
                <li className="flex items-center gap-4"><FiMapPin className="text-blue-500"/> Gulshan, Dhaka, BD</li>
                <li className="flex items-center gap-4"><FiClock className="text-blue-500"/> 24/7 Support</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 MEDISTORE PHARMACY. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-12">
               <img src="https://i.ibb.co/v3m9XyK/payment-methods.png" alt="Payments" className="h-6 grayscale opacity-30 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </footer>

      <MedicineModal 
        medicine={selectedMedicine} 
        onClose={() => setSelectedMedicine(null)} 
      />
    </main>
  );
}