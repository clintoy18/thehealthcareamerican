import React from 'react';
import { Shield } from 'lucide-react';

const Header = ({ step }) => (
  <header className="bg-gradient-to-r from-[#002855] to-[#003d7a] text-white py-8 shadow-2xl border-b-4 border-[#0ea5e9]">
    <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-[#0ea5e9] p-2.5 rounded-lg">
          <Shield className="text-[#002855]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            thehealthcare<span className="text-slate-300 font-light">american</span>
          </h1>
          <p className="text-[10px] text-slate-300 tracking-widest">Insurance Quote Generator</p>
        </div>
      </div>
      <div className="flex gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-2.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#0ea5e9] shadow-lg shadow-blue-400/50' : 'bg-slate-500'}`} />
            <span className="text-[9px] font-bold text-slate-300">{i === 1 ? 'Quote' : i === 2 ? 'Results' : 'Contact'}</span>
          </div>
        ))}
      </div>
    </div>
  </header>
);

export default Header;