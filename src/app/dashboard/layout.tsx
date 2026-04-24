"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Users,
  Settings,
  LucideIcon 
} from "lucide-react";

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

// 🔵 ছোট মেনু আইটেম কম্পোনেন্ট (Dark Theme Style)
const MenuItem = ({ href, icon: Icon, label, isActive }: MenuItemProps) => (
  <Link 
    href={href} 
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}
  >
    <Icon size={20} />
    <span className="text-sm tracking-wide">{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      
      if (!storedUser) {
        router.push("/login");
        return;
      }

      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        router.push("/login");
      }
      setMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [router]);

  if (!mounted || !user) {
    return <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white font-black uppercase tracking-widest animate-pulse italic">Entering MediStore Portal...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      
      {/* 🟦 Sidebar: Deep Navy Blue Theme */}
      <aside className="w-72 bg-[#0f172a] text-slate-300 hidden md:flex flex-col border-r border-slate-800 shadow-2xl sticky top-0 h-screen">
        
        {/* Logo Section */}
        <div className="p-8 border-b border-slate-800/50">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white italic uppercase">
            MEDI<span className="text-blue-500">STORE</span> 💊
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 px-2">Main Menu</div>
          
          <MenuItem 
            href="/dashboard" 
            icon={LayoutDashboard} 
            label="Overview" 
            isActive={pathname === "/dashboard"} 
          />

          {/* সেলার মেনু */}
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

          {/* অ্যাডমিন মেনু */}
          {user.role === "ADMIN" && (
            <>
              <MenuItem 
                href="/dashboard/manage-users" 
                icon={Users} 
                label="Manage Users" 
                isActive={pathname === "/dashboard/manage-users"} 
              />
              <MenuItem 
                href="/dashboard/all-inventory" 
                icon={Package} 
                label="All Inventory" 
                isActive={pathname === "/dashboard/all-inventory"} 
              />
            </>
          )}

          <MenuItem 
            href="/dashboard/my-orders" 
            icon={ShoppingBag} 
            label="Order History" 
            isActive={pathname === "/dashboard/my-orders"} 
          />
        </nav>

        {/* Bottom Section: User & Logout */}
        <div className="p-6 border-t border-slate-800/50 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black italic">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{user.role}</p>
            </div>
          </div>

          <button 
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut size={20} /> <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ⬜ Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}