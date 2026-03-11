"use client";
import Link from "next/link"; // Link ইমপোর্ট করতে হবে

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  cartCount: number;
}

const Navbar = ({ searchTerm, setSearchTerm, cartCount }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-sm py-4 px-10 sticky top-0 z-10 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* লোগোতে ক্লিক করলে হোম পেজে যাবে */}
      <Link href="/">
        <h1 className="text-2xl font-bold text-blue-700 cursor-pointer">
          MediStore 💊
        </h1>
      </Link>
      
      <div className="w-full md:w-1/3">
        <input 
          type="text" 
          value={searchTerm}
          placeholder="Search medicines..."
          className="w-full border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-6 font-semibold">
        {/* Cart আইকন */}
        <div className="relative cursor-pointer text-gray-600 hover:text-blue-600 transition">
          <span className="text-sm">Cart</span>
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 min-w-[18px] text-center">
            {cartCount}
          </span>
        </div>

        {/* Login এবং Register বাটন */}
        <div className="flex gap-3">
          <Link href="/login">
            <button className="text-blue-700 border border-blue-700 px-4 py-1.5 rounded-lg text-sm hover:bg-blue-50 transition">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-800 transition shadow-md shadow-blue-100">
              Register
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

