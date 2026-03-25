"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  // ডাটা লোড করার জন্য একটি আলাদা ফাংশন (useCallback দিয়ে মেমোরাইজ করা)
  const loadCart = useCallback(() => {
    const items: ICartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  }, []);

  useEffect(() => {
    // সরাসরি setState না করে একটি মাইক্রো-টাস্ক হিসেবে কল করা
    const timeout = setTimeout(() => {
      loadCart();
    }, 0);
    
    return () => clearTimeout(timeout);
  }, [loadCart]);

  const totalPrice = cartItems.reduce((acc: number, item: ICartItem) => acc + item.price * item.quantity, 0);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item: ICartItem) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[70vh]">
      <h1 className="text-3xl font-black mb-8 text-gray-800 tracking-tight">আপনার কার্ট 🛒</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-xl text-gray-500 mb-6 font-medium">আপনার কার্টে কোনো ওষুধ নেই।</p>
          <Link href="/shop" className="bg-blue-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg inline-block">
            ওষুধ কিনতে শপ পেজে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 sm:mb-0">
                <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-400 font-semibold">{item.price} ৳ × {item.quantity}</p>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto gap-10">
                <span className="font-black text-blue-600 text-2xl">{item.price * item.quantity} ৳</span>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors text-sm"
                >
                  মুছে ফেলুন
                </button>
              </div>
            </div>
          ))}

          <div className="mt-10 p-8 bg-blue-900 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
            <div>
              <p className="text-blue-200 text-xs uppercase tracking-[0.2em] font-black mb-1">সর্বমোট বিল</p>
              <h2 className="text-4xl font-black text-white">{totalPrice} ৳</h2>
            </div>
            <Link href="/checkout" className="w-full md:w-auto bg-white text-blue-900 px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all hover:scale-[1.02] shadow-xl text-center">
              চেকআউট করুন (Checkout) 🚀
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}