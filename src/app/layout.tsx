import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore
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

// ✅ মেটাডাটা এখানেই থাকবে, কোনো সমস্যা নেই
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#040610] text-slate-300 min-h-screen flex flex-col`}>
        {/* ✅ আমরা মেইন লজিকটা অন্য ফাইলে পাঠিয়ে দিচ্ছি */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}