"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  name?: string;
}

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("User data error");
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    const timeoutId = setTimeout(() => {
      setMounted(true);
    }, 0);

    window.addEventListener("storage", checkUser);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
    setTimeout(() => window.location.reload(), 100);
  };

  if (!mounted) return <nav className="h-[73px] bg-white border-b shadow-sm"></nav>;

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">MediStore 💊</Link>

      <div className="flex items-center gap-6 font-medium">
        {/* শপ লিঙ্ক - যেখানে সব ওষুধ থাকবে */}
        <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
        
        {user ? (
          <>
            <Link href="/dashboard" className="text-blue-600 font-bold hover:underline">Dashboard</Link>
            
            {/* কার্ট লিঙ্ক - এখানে ক্লিক করলে /cart পেজে যাবে */}
            <Link href="/cart" className="relative cursor-pointer hover:scale-110 transition-transform">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              onClick={handleLogout}
              className="text-red-500 font-bold hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 font-bold hover:text-blue-600">Login</Link>
            <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}