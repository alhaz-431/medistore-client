"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <Navbar />
      
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}