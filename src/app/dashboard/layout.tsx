"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Users,
  Menu,
  X,
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
  onClick?: () => void;
}

const MenuItem = ({ href, icon: Icon, label, isActive, onClick }: MenuItemProps) => (
  <Link 
    href={href} 
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-black transition-all duration-300 uppercase text-[11px] tracking-widest ${
      isActive 
        ? "bg-blue-600 text-white shadow-2xl shadow-blue-900/40 translate-x-2" 
        : "text-slate-500 hover:bg-slate-800/50 hover:text-blue-400"
    }`}
  >
    <Icon size={18} strokeWidth={3} />
    <span>{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      router.push("/login");
    }
    setMounted(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!mounted || !user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#040610] text-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="font-black uppercase tracking-[0.5em] text-[10px] animate-pulse italic">Initializing Neural Portal...</span>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="p-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-white italic uppercase">
          MEDI<span className="text-blue-500">STORE</span> 💊
        </Link>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
          <X size={24} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 px-2 italic">Operation Center</p>
        
        <MenuItem 
          href="/dashboard" 
          icon={LayoutDashboard} 
          label="Overview" 
          isActive={pathname === "/dashboard"} 
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* সেলার মেনু ( paths matching your folder structure ) */}
        {user.role === "SELLER" && (
          <>
            <MenuItem 
              href="/dashboard/seller/add-medicine" 
              icon={PlusCircle} 
              label="Add Medicine" 
              isActive={pathname === "/dashboard/seller/add-medicine"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MenuItem 
              href="/dashboard/seller/my-inventory" 
              icon={Package} 
              label="Inventory" 
              isActive={pathname === "/dashboard/seller/my-inventory"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}

        {/* অ্যাডমিন মেনু */}
        {user.role === "ADMIN" && (
          <>
            <MenuItem 
              href="/dashboard/admin/manage-users" 
              icon={Users} 
              label="User Matrix" 
              isActive={pathname === "/dashboard/admin/manage-users"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}

        <MenuItem 
          href="/dashboard/orders" 
          icon={ShoppingBag} 
          label="Order Logs" 
          isActive={pathname === "/dashboard/orders"} 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-slate-800/50 bg-[#0a101f]">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-600/20">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white truncate uppercase tracking-tighter italic">{user.name}</p>
            <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{user.role}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest bg-red-500/5 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300"
        >
          <LogOut size={16} strokeWidth={3} /> Logout Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      
      {/* Desktop Sidebar */}
      <aside className="w-80 bg-[#040610] hidden md:flex flex-col border-r border-slate-900 sticky top-0 h-screen shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
        <SidebarContent />
      </aside>

      {/* Mobile Nav Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#040610] flex items-center justify-between px-6 z-50 border-b border-slate-800">
        <span className="text-white font-black italic tracking-tighter">MEDI<span className="text-blue-500">STORE</span></span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#040610] z-[70] md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="flex-1 pt-20 md:pt-0 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto min-h-full">
           {children}
        </div>
      </main>
    </div>
  );
}