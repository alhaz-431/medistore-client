"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers, FiShield, FiUserCheck, FiUserX, 
  FiMail, FiCalendar, FiSearch, FiRefreshCw 
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://medistore-backend-server.vercel.app/api";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    if (!confirm(currentStatus ? "Unban this user?" : "Ban this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/admin/users/${userId}/status`, 
        { isBanned: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(currentStatus ? "User Active! ✅" : "User Banned! 🚫");
      fetchUsers();
    } catch (err) {
      alert("Action failed.");
    }
  };

  // সার্চ ফিল্টার
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#fafbfc]">
      <FiUsers className="text-4xl text-blue-600 animate-bounce mb-4" />
      <span className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px]">Accessing Database...</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 bg-[#fafbfc] min-h-screen text-black"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* ─── HEADER ─── */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3 text-[#040610]">
              User <span className="text-blue-600">Directory</span>
            </h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">
              Authorized Personnel Only • {users.length} Registered Accounts
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={fetchUsers} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-blue-200">
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ─── USERS TABLE ─── */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
                <tr>
                  <th className="p-8">Identification</th>
                  <th className="p-8">Privileges</th>
                  <th className="p-8">Account Status</th>
                  <th className="p-8 text-right">System Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group hover:bg-blue-50/20 transition-all"
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${user.role === 'ADMIN' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-[#040610] text-sm uppercase italic tracking-tighter">{user.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5 italic">
                              <FiMail className="text-blue-500" /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-8">
                        <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          user.role === 'ADMIN' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          <FiShield size={12} /> {user.role}
                        </span>
                      </td>

                      <td className="p-8">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${user.isBanned ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.isBanned ? 'text-red-500' : 'text-green-600'}`}>
                            {user.isBanned ? "Blacklisted" : "Operational"}
                          </span>
                        </div>
                      </td>

                      <td className="p-8 text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleBan(user.id, user.isBanned)}
                          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ml-auto ${
                            user.isBanned 
                            ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-100' 
                            : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 shadow-sm'
                          }`}
                        >
                          {user.isBanned ? <FiUserCheck /> : <FiUserX />}
                          {user.isBanned ? "Restore User" : "Suspend Access"}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="p-24 text-center">
                <FiSearch className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No matching records found in database.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}