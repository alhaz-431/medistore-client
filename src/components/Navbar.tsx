"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiGrid, FiLogOut } from "react-icons/fi";

interface User {
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  name?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // ডাটা চেক করার ফাংশন
  const checkData = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
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

  // নেক্সট জেএস হাইড্রেশন এরর ফিক্স
  useEffect(() => {
    let isComponentMounted = true;

    const initialize = () => {
      if (isComponentMounted) {
        checkData(); 
        setMounted(true); 
      }
    };

    const timeoutId = setTimeout(initialize, 50);

    // অন্য ট্যাব থেকে লগআউট করলে যেন এখানেও আপডেট হয়
    window.addEventListener("storage", checkData);

    return () => {
      isComponentMounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener("storage", checkData);
    };
  }, [checkData]);

  // ✅ ড্যাশবোর্ড ক্লিক হ্যান্ডলার (সঠিক পাথ সেট করা হয়েছে)
  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    // Navbar.tsx এর ভেতর
if (user.role === "CUSTOMER") {
  router.push("/dashboard/customer/my-orders"); // এখানে /customer/ যোগ করুন
}

    // রোল অনুযায়ী আপনার ফোল্ডার স্ট্রাকচার পাথে পাঠানো
    if (user.role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (user.role === "SELLER") {
      router.push("/dashboard/seller");
    } else {
      // কাস্টমারের জন্য সঠিক পাথ: /dashboard/customer/my-orders
      router.push("/dashboard/customer/my-orders");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
    // পেজ রিফ্রেশ করে স্টেট ক্লিন করা
    setTimeout(() => window.location.reload(), 100);
  };

  if (!mounted) {
    return (
      <nav className="h-[74px] bg-white border-b w-full flex justify-between items-center px-6 md:px-12">
        <div className="text-2xl font-black italic text-blue-600 uppercase tracking-tighter">
          Medi<span className="text-black">Store</span> 💊
        </div>
        <div className="w-48 h-8 bg-gray-50 animate-pulse rounded-lg"></div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center">
      {/* ─── LOGO ─── */}
      <Link href="/" className="text-2xl font-black italic text-blue-600 tracking-tighter uppercase shrink-0">
        Medi<span className="text-black">Store</span> 💊
      </Link>

      {/* ─── MENU ─── */}
      <div className="flex items-center gap-6 font-black text-[10px] uppercase tracking-[0.2em] text-black">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
        
        <Link href="/cart" className="relative group p-1">
          <FiShoppingCart size={18} className="group-hover:text-blue-600 transition-colors" />
          {cartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-white font-black">
              {cartItems}
            </span>
          )}
        </Link>

        {user ? (
          /* ✅ লগইন থাকলে এই সেকশনটি একটি কন্টেইনারে দেখাবে */
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
            <button 
              onClick={handleDashboardClick}
              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-blue-100"
            >
              <FiGrid size={16} />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          /* ❌ লগইন না থাকলে */
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
            <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-md active:scale-95">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}