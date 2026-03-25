import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* রুট লেআউট থেকে নেভবার সরানো হলো। 
            এখন হোম পেজে (page.tsx) এবং ড্যাশবোর্ডে 
            আলাদাভাবে নেভবার কল করলে আর ডাবল দেখাবে না।
        */}
        {children}
      </body>
    </html>
  );
}