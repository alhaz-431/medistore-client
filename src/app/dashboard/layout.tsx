"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Package, ShoppingBag, LogOut, LucideIcon } from "lucide-react";

// ১. টাইপগুলো ঠিক করা হলো
interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
}

interface MenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const MenuItem = ({ href, icon: Icon, label, isActive }: MenuItemProps) => (
  <Link 
    href={href} 
    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
    }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      
      if (!storedUser) {
        router.push("/login");
        return;
      }

      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(parsedUser)) {
            return parsedUser;
          }
          return prev;
        });
      } catch (error) {
        console.error("User parsing error:", error);
        router.push("/login");
      }
    };

    checkUser();

   
    const timeoutId = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId); // ক্লিনআপ
  }, [router]);

  // মাউন্ট হওয়ার আগে কিছু রেন্ডার হবে না (Hydration Fix)
  if (!mounted) {
    return <div className="p-10 text-center font-bold">প্রবেশ করা হচ্ছে...</div>;
  }

  // ইউজার না থাকলে কিছুই দেখাবে না (রিডাইরেক্ট হওয়া পর্যন্ত অপেক্ষা করবে)
  if (!user) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
        <nav className="flex-1 space-y-2">
          <p className="text-[10px] uppercase font-bold text-gray-400 ml-3 mb-4 tracking-widest">Dashboard Menu</p>
          
          <MenuItem 
            href="/dashboard" 
            icon={LayoutDashboard} 
            label="Overview" 
            isActive={pathname === "/dashboard"} 
          />

          {user.role === "SELLER" && (
            <>
              <MenuItem 
                href="/dashboard/add-medicine" 
                icon={PlusCircle} 
                label="Add Medicine" 
                isActive={pathname === "/dashboard/add-medicine"} 
              />
              <MenuItem 
                href="/dashboard/my-medicines" 
                icon={Package} 
                label="My Inventory" 
                isActive={pathname === "/dashboard/my-medicines"} 
              />
            </>
          )}

          <MenuItem 
            href="/dashboard/my-orders" 
            icon={ShoppingBag} 
            label="Orders" 
            isActive={pathname === "/dashboard/my-orders"} 
          />
        </nav>

        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          className="mt-auto flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}