"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <Navbar />
      {/* main-এ flex-grow দিন যেন কন্টেন্ট কম হলেও ফুটার নিচে থাকে, কিন্তু হাইট না আটকায় */}
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}