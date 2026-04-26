import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0b0f1a] border-t border-white/5 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">
            Medi<span className="text-blue-500">Store</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Your Trusted Online Pharmacy
          </p>
        </div>
        
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
          © 2026 Designed by <span className="text-blue-500">Alfaz Arbby</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;