"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiShoppingBag, FiArrowRight, FiPackage } from "react-icons/fi";

interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadCart = useCallback(() => {
    const items: ICartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
    setMounted(true);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const totalPrice = cartItems.reduce((acc: number, item: ICartItem) => acc + item.price * item.quantity, 0);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item: ICartItem) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // ন্যাভবার আপডেট করার জন্য ইভেন্ট ফায়ার করা
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 md:py-12 min-h-[80vh]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-12"
      >
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <FiShoppingBag size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-[#040610] tracking-tighter italic uppercase">
            Your <span className="text-blue-600">Cart</span> 🛒
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">
            {cartItems.length} items in your basket
          </p>
        </div>
      </motion.div>
      
      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-blue-900/5"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FiPackage size={40} />
          </div>
          <p className="text-xl text-gray-400 mb-8 font-bold italic uppercase tracking-tight">আপনার কার্ট একদম খালি!</p>
          <Link href="/" className="bg-[#040610] text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl inline-flex items-center gap-3 active:scale-95">
            ওষুধ কিনতে শপে যান <FiArrowRight />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 bg-white border border-gray-50 rounded-[2rem] shadow-xl shadow-blue-900/5 hover:border-blue-100 transition-all"
                >
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-black text-2xl text-gray-800 tracking-tight uppercase italic group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {item.quantity} Unit(s)
                      </span>
                      <span className="text-sm text-gray-400 font-bold italic">
                        @ ৳{item.price} each
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between w-full sm:w-auto gap-12">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                      <span className="font-black text-gray-900 text-3xl italic tracking-tighter">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                      title="Remove Item"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Section */}
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-10 bg-[#040610] rounded-[3.5rem] flex flex-col lg:flex-row justify-between items-center gap-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group"
          >
            <div className="relative z-10 text-center lg:text-left">
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Ready to Order?</p>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 text-xl font-bold italic">৳</span>
                <h2 className="text-6xl font-black text-white italic tracking-tighter leading-none">
                  {totalPrice.toLocaleString()}
                </h2>
              </div>
            </div>
            
            <Link 
              href="/checkout" 
              className="relative z-10 w-full lg:w-auto bg-blue-600 text-white px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-blue-600/20 text-center active:scale-95 flex items-center justify-center gap-3"
            >
              Secure Checkout <FiArrowRight size={18} />
            </Link>

            {/* Decorative Background Icon */}
            <FiShoppingBag className="absolute -right-10 -bottom-10 text-white/5 size-64 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </motion.div>
        </div>
      )}
    </div>
  );
}