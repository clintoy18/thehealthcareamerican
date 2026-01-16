import React from 'react';

const Header = ({ step }) => (
  <header className="bg-white text-slate-700 py-4 shadow-lg border-b-4 border-[#0891B2]">
    <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img 
          src="https://www.healthcareamerican.com/wp-content/themes/awi/img/healthcare-american-logo.png" 
          alt="Healthcare American" 
          className="h-16 object-contain"
        />
      </div>
      <div className="flex gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-2.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#0891B2] shadow-lg shadow-blue-400/50' : 'bg-slate-300'}`} />
            <span className="text-[9px] font-bold text-slate-300">{i === 1 ? 'Quote' : i === 2 ? 'Results' : 'Contact'}</span>
          </div>
        ))}
      </div>
    </div>
  </header>
);

export default Header;