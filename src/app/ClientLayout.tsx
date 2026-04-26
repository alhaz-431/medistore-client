"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { 
  FiMail, FiPhoneCall, FiMapPin, 
  FiFacebook, FiTwitter, FiInstagram 
} from "react-icons/fi";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {/* ড্যাশবোর্ড না হলে নেভবার দেখাও */}
      {!isDashboard && <Navbar />}

      <main className={`flex-grow ${!isDashboard ? "pt-2" : ""}`}>
        {children}
      </main>

      {/* ড্যাশবোর্ড না হলে ফুটার দেখাও */}
      {!isDashboard && (
        <footer className="bg-[#070b18] text-white pt-20 pb-10 px-8 border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-6">
                  Medi<span className="text-blue-500">Store</span>
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed font-bold max-w-sm">
                  আপনার বিশ্বস্ত ডিজিটাল ফার্মেসি। আমরা শতভাগ অরিজিনাল ওষুধ এবং দ্রুততম ডেলিভারি নিশ্চিত করি।
                </p>
                <div className="flex gap-5 mt-8">
                   <FiFacebook className="text-gray-500 hover:text-blue-500 cursor-pointer" size={20} />
                   <FiTwitter className="text-gray-500 hover:text-blue-400 cursor-pointer" size={20} />
                   <FiInstagram className="text-gray-500 hover:text-pink-500 cursor-pointer" size={20} />
                </div>
              </div>
              {/* কন্টাক্ট এবং অন্যান্য লিঙ্ক এখানে আপনার আগের কোড থেকে বসিয়ে নিন */}
            </div>
            <div className="pt-10 border-t border-white/5 text-center">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
                © 2026 MediStore Pharmacy. Designed by Alfaz ARbby
              </p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}