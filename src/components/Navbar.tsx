"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiGrid, FiLogOut, FiUser } from "react-icons/fi";

interface User {
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  name?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const checkData = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart);
        setCartItems(Array.isArray(items) ? items.length : 0);
      } catch (e) {
        setCartItems(0);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    checkData();
    window.addEventListener("storage", checkData);
    return () => window.removeEventListener("storage", checkData);
  }, [checkData]);

  const handleDashboardClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    // রোল অনুযায়ী ডিরেক্টরি পাথ
    const paths = {
      ADMIN: "/dashboard/admin",
      SELLER: "/dashboard/seller",
      CUSTOMER: "/dashboard/customer/my-orders"
    };
    
    router.push(paths[user.role] || "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
    setTimeout(() => window.location.reload(), 100);
  };

  // হাইড্রেশন এরর এড়াতে স্কেলিটন বা সেমি-ট্রান্সপারেন্ট নেভবার
  if (!mounted) {
    return (
      <nav className="h-[80px] bg-[#040610] border-b border-white/5 w-full flex justify-between items-center px-8 md:px-16 sticky top-0 z-50">
        <div className="text-2xl font-black italic text-blue-500 uppercase tracking-tighter">
          Medi<span className="text-white">Store</span>
        </div>
        <div className="w-32 h-6 bg-white/5 animate-pulse rounded-full"></div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#040610]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 py-5 px-8 md:px-16 flex justify-between items-center transition-all">
      
      {/* ─── LOGO ─── */}
      <Link href="/" className="text-2xl font-black italic text-blue-500 tracking-tighter uppercase shrink-0 flex items-center gap-2">
        Medi<span className="text-white">Store</span>
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
      </Link>

      {/* ─── MENU ─── */}
      <div className="flex items-center gap-8 font-black text-[10px] uppercase tracking-[0.25em]">
        <Link href="/" className="text-slate-400 hover:text-white transition-all hidden md:block">Home</Link>
        <Link href="/shop" className="text-slate-400 hover:text-white transition-all hidden md:block">Shop</Link>
        
        {/* CART */}
        <Link href="/cart" className="relative group p-2 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all">
          <FiShoppingCart size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          {cartItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] rounded-md w-4 h-4 flex items-center justify-center font-black shadow-lg">
              {cartItems}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <button 
              onClick={handleDashboardClick}
              className="flex items-center gap-2 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2.5 rounded-xl transition-all border border-blue-500/20 font-black italic"
            >
              <FiGrid size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button 
              onClick={handleLogout}
              className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6 border-l border-white/10 pl-8">
            <Link href="/login" className="text-slate-400 hover:text-white transition-all">Login</Link>
            <Link href="/register" className="bg-blue-600 hover:bg-white text-white hover:text-blue-950 px-6 py-2.5 rounded-xl transition-all font-black shadow-lg shadow-blue-600/20 active:scale-95">
              JOIN
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}