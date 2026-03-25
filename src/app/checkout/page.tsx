"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// নির্দিষ্ট টাইপ ডিফাইন করা হলো
interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // লোকাল স্টোরেজ থেকে কার্ট ডাটা নেওয়া
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("আপনার কার্ট খালি!");

    setLoading(true);
    try {
      // লোকাল স্টোরেজ বা অথ স্টেট থেকে ইউজার আইডি নেওয়ার চেষ্টা
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id || "cmmjponyk00002ke7dl83qxol"; 

      const orderData = {
        customerId: userId,
        items: cartItems.map((item) => ({
          medicineId: item.id,
          quantity: item.quantity,
        })),
        shippingName: shippingInfo.name,
        shippingPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        totalAmount: totalAmount,
      };

      const res = await axios.post("http://localhost:5000/api/orders", orderData);

      if (res.status === 201 || res.status === 200) {
        alert("অর্ডার সফল হয়েছে! 🎉");

        // কার্ট খালি করা এবং ন্যাভবারকে জানানো
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        router.push("/dashboard/my-orders");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("অর্ডার করতে সমস্যা হয়েছে। সার্ভার চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-black mb-8 text-blue-600 border-b pb-4">চেকআউট 🛒</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ফর্ম অংশ */}
        <form onSubmit={handleOrder} className="space-y-5 bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">শিপিং তথ্য 🚚</h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">আপনার পূর্ণ নাম</label>
            <input
              type="text"
              placeholder="যেমন: আলহাজ হোসেন"
              required
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-400 outline-none transition text-black"
              onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">সচল ফোন নম্বর</label>
            <input
              type="text"
              placeholder="017XXXXXXXX"
              required
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-400 outline-none transition text-black"
              onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">ডেলিভারি ঠিকানা</label>
            <textarea
              placeholder="বাসা নং, রোড, এলাকা..."
              required
              className="w-full p-3 border-2 border-gray-100 rounded-xl h-28 focus:border-blue-400 outline-none transition text-black"
              onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            }`}
          >
            {loading ? "অর্ডার প্রসেস হচ্ছে..." : "অর্ডার কনফার্ম করুন ✅"}
          </button>
        </form>

        {/* সামারি অংশ */}
        <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 h-fit sticky top-10">
          <h2 className="text-xl font-bold mb-6 text-blue-800 flex items-center gap-2">অর্ডার সামারি 📝</h2>
          
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-50 shadow-sm">
                <div>
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.quantity} x {item.price} ৳</p>
                </div>
                <span className="font-bold text-gray-900">{item.price * item.quantity} ৳</span>
              </div>
            ))}
            
            {cartItems.length === 0 && <p className="text-center text-gray-400 py-4">কার্টে কোনো ওষুধ নেই।</p>}

            <div className="border-t border-blue-200 mt-6 pt-4">
              <div className="flex justify-between items-center text-2xl font-black text-blue-900">
                <span>মোট বিল:</span>
                <span>{totalAmount} ৳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}