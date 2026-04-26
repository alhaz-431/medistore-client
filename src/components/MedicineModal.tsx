"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiInfo, FiActivity, FiDatabase } from "react-icons/fi";

interface IMedicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
}

interface ModalProps {
  medicine: IMedicine | null;
  onClose: () => void;
}

const MedicineModal = ({ medicine, onClose }: ModalProps) => {
  if (!medicine) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop (ঝাপসা ব্যাকগ্রাউন্ড) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-500 hover:text-white p-2 bg-white/5 rounded-full transition-all"
          >
            <FiX size={20} />
          </button>

          {/* Header */}
          <div className="text-center relative z-10">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
              <FiActivity className="text-4xl text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">
              {medicine.name}
            </h2>
            <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              {medicine.manufacturer}
            </p>
          </div>

          {/* Details Section */}
          <div className="space-y-4 border-t border-b border-white/5 py-8 my-8 relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <FiInfo className="text-blue-500" />
                <span className="text-xs font-black uppercase tracking-widest">Unit Price</span>
              </div>
              <span className="text-2xl font-black text-green-400 italic">৳{medicine.price}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <FiDatabase className="text-blue-500" />
                <span className="text-xs font-black uppercase tracking-widest">Stock Status</span>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest ${medicine.stock > 0 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {medicine.stock > 0 ? `${medicine.stock} Available` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed pt-2">
              * Consult a professional healthcare provider before use. Always check for the verification seal and expiry date on the packaging.
            </p>
          </div>

          {/* Action Button */}
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-white text-white hover:text-blue-900 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Acknowledge
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MedicineModal;