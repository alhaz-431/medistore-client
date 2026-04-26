import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { 
  FiMail, FiPhoneCall, FiMapPin, 
  FiFacebook, FiTwitter, FiInstagram 
} from "react-icons/fi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediStore - Your Online Pharmacy",
  description: "Get your medicines delivered at home safely and quickly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#040610] text-slate-300 min-h-screen flex flex-col`}
      >
        {/* মেইন নেভবার যা সব পেজে থাকবে */}
        <Navbar />

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-grow pt-2">
          {children}
        </main>

        {/* প্রিমিয়াম ফুটার ডিজাইন */}
        <footer className="bg-[#070b18] text-white pt-20 pb-10 px-8 border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              
              {/* ব্র্যান্ড সেকশন */}
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-6">
                  Medi<span className="text-blue-500">Store</span>
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed font-bold max-w-sm">
                  আপনার বিশ্বস্ত ডিজিটাল ফার্মেসি। আমরা শতভাগ অরিজিনাল ওষুধ এবং দ্রুততম ডেলিভারি নিশ্চিত করি। আমাদের লক্ষ্য আপনার সুস্বাস্থ্য।
                </p>
                <div className="flex gap-5 mt-8">
                   <FiFacebook className="text-gray-500 hover:text-blue-500 cursor-pointer transition-all hover:scale-110" size={20} />
                   <FiTwitter className="text-gray-500 hover:text-blue-400 cursor-pointer transition-all hover:scale-110" size={20} />
                   <FiInstagram className="text-gray-500 hover:text-pink-500 cursor-pointer transition-all hover:scale-110" size={20} />
                </div>
              </div>

              {/* কন্টাক্ট সেকশন */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-blue-500">Contact Details</h4>
                <ul className="text-gray-400 text-sm space-y-5 font-bold">
                  <li className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500 transition-all">
                      <FiMail className="text-blue-500 group-hover:text-white" />
                    </div>
                    <span className="group-hover:text-white transition-colors">support@medistore.com</span>
                  </li>
                  <li className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500 transition-all">
                      <FiPhoneCall className="text-blue-500 group-hover:text-white" />
                    </div>
                    <span className="group-hover:text-white transition-colors">+880 1700-000000</span>
                  </li>
                  <li className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500 transition-all">
                      <FiMapPin className="text-blue-500 group-hover:text-white" />
                    </div>
                    <span className="group-hover:text-white transition-colors">Gulshan-2, Dhaka</span>
                  </li>
                </ul>
              </div>

              {/* কুইক লিঙ্কস */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-blue-500">Quick Links</h4>
                <ul className="text-gray-400 text-sm space-y-4 font-bold">
                  <li className="hover:text-white cursor-pointer transition-colors italic list-none">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic list-none">Terms & Conditions</li>
                  <li className="hover:text-white cursor-pointer transition-colors italic list-none">Refund Policy</li>
                </ul>
              </div>
            </div>

            {/* কপিরাইট লাইন */}
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
                © 2026 MediStore Pharmacy. All Rights Reserved.
              </p>
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-tighter italic">
                Designed & Developed by <span className="text-blue-500/50 hover:text-blue-500 transition-colors cursor-pointer">Alfaz ARbby</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}