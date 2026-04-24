import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // আপনার নিজের তৈরি Navbar কম্পোনেন্ট
import { FiMail, FiPhoneCall, FiMapPin } from "react-icons/fi";

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
  description: "Get your medicines delivered at home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        {/* মেইন নেভবার যা সব পেজে থাকবে */}
        {/* যদি আপনার Navbar এ cartCount লাগে, তবে সেটা কম্পোনেন্টের ভেতর থেকে হ্যান্ডেল করা ভালো */}
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-[#0F172A] text-white pt-16 pb-10 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                Medi<span className="text-blue-500">Store</span>
              </h2>
              <p className="text-gray-400 mt-4 text-sm leading-relaxed font-bold">
                আপনার বিশ্বস্ত ডিজিটাল ফার্মেসি।
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-blue-500">Contact Us</h4>
              <ul className="text-gray-400 text-sm space-y-4 font-bold">
                <li className="flex items-center gap-3"><FiMail className="text-blue-500"/> support@medistore.com</li>
                <li className="flex items-center gap-3"><FiPhoneCall className="text-blue-500"/> +880 1700-000000</li>
                <li className="flex items-center gap-3"><FiMapPin className="text-blue-500"/> Gulshan, Dhaka</li>
              </ul>
            </div>

            <div className="md:text-right flex flex-col justify-end">
              <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest">
                © 2026 MediStore Pharmacy.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}