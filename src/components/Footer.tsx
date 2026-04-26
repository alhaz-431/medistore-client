import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0b0f1a] border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} <span className="text-blue-500">MediStore</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;