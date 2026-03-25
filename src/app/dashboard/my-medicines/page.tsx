"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
}

export default function MyMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("https://medistore-backend-server.vercel.app/api/medicines");
      setMedicines(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("ডাটা আনতে সমস্যা হয়েছে:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ওষুধ ডিলিট করার ফাংশন
  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) {
      try {
        await axios.delete(`https://medistore-backend-server.vercel.app/api/medicines/${id}`);
        alert("ডিলিট সফল হয়েছে!");
        fetchMedicines(); // লিস্ট আপডেট করার জন্য আবার কল করা
      } catch (err) {
        alert("ডিলিট করা যায়নি!");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">লোডিং হচ্ছে...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">আমার ওষুধের তালিকা</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-400 text-xs uppercase tracking-widest">
              <th className="py-4 px-2">নাম</th>
              <th className="py-4 px-2">কোম্পানি</th>
              <th className="py-4 px-2">দাম</th>
              <th className="py-4 px-2">স্টক</th>
              <th className="py-4 px-2 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med.id} className="border-b hover:bg-blue-50/50 transition-colors">
                <td className="py-4 px-2 font-semibold text-gray-700">{med.name}</td>
                <td className="py-4 px-2 text-gray-500">{med.manufacturer}</td>
                <td className="py-4 px-2 text-blue-600 font-bold">৳{med.price}</td>
                <td className="py-4 px-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${med.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {med.stock} pcs
                  </span>
                </td>
                <td className="py-4 px-2 text-center space-x-2">
                  <button className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 hover:text-white transition" onClick={() => handleDelete(med.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}