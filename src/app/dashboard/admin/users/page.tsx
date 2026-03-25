"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

const API_URL = "https://medistore-backend-server.vercel.app/api";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // সব ইউজার লোড করার ফাংশন
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        alert(axiosError.response?.data?.error || "ইউজার লিস্ট লোড করা যায়নি।");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ইউজার ব্যান বা আনব্যান করার ফাংশন
  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    const confirmMsg = currentStatus ? "আপনি কি এই ইউজারকে আনব্যান করতে চান?" : "আপনি কি এই ইউজারকে ব্যান করতে চান?";
    if (!confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/admin/users/${userId}/status`, 
        { isBanned: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(currentStatus ? "ইউজার এখন একটিভ! ✅" : "ইউজার ব্যান করা হয়েছে! 🚫");
      fetchUsers(); // লিস্ট আপডেট করার জন্য
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert("স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।");
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-blue-600 animate-pulse">ইউজার ডাটা লোড হচ্ছে... 🔃</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">
          ইউজার ম্যানেজমেন্ট <span className="text-blue-600">({users.length})</span>
        </h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
              <tr>
                <th className="p-6">ইউজার তথ্য</th>
                <th className="p-6">রোল</th>
                <th className="p-6">অবস্থা</th>
                <th className="p-6 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="p-6">
                    <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    {user.isBanned ? (
                      <span className="text-red-500 text-[10px] font-bold flex items-center gap-1">
                        ●ব্যান করা
                      </span>
                    ) : (
                      <span className="text-green-500 text-[10px] font-bold flex items-center gap-1">
                        ●একটিভ
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => handleToggleBan(user.id, user.isBanned)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                        user.isBanned 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {user.isBanned ? "UNBAN USER" : "BAN USER"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold">
              কোনো ইউজার খুঁজে পাওয়া যায়নি! 🔍
            </div>
          )}
        </div>
      </div>
    </div>
  );
}