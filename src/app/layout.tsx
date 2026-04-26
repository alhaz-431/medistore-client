import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import ClientLayout from "./ClientLayout";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      {/* ১. body থেকে flex flex-col সরিয়ে দিয়েছি। 
          ২. overflow-x-hidden মাস্ট, না হলে ডানে-বামে সাদা জায়গা চলে আসবে। 
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#040610] text-slate-300 min-h-screen overflow-x-hidden`}>
        <ClientLayout>
          {/* চাইল্ড এলিমেন্টকে মেইন ট্যাগে র‍্যাপ করা ভালো সেফটির জন্য */}
          <main>
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}