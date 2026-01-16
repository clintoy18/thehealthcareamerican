import React from 'react';
import { ChevronLeft, ArrowRight, CheckCircle2, Zap, DollarSign, Calendar } from 'lucide-react';

const LifeResults = ({ formData, premium, onUpdate, onPrev, onNext }) => {
  return (
    <div className="p-8 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-[#0891B2] mb-2">Your Personalized Quote</h2>
        <p className="text-slate-500 text-lg">Adjusted to your specific needs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Premium Display Card */}
        <div className="bg-gradient-to-br from-[#0891B2] via-[#06B6D4] to-[#0891B2] text-white rounded-3xl p-10 shadow-2xl border border-[#0891B2]/20 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#0891B2] mb-4">Monthly Premium</p>
            <div className="flex items-start mb-10">
              <span className="text-5xl font-black mt-2">$</span>
              <span className="text-9xl font-black tracking-tighter leading-none">{premium.split('.')[0]}</span>
              <div className="text-left ml-2 mt-4">
                <p className="text-4xl font-black">.{premium.split('.')[1]}</p>
                <p className="text-xs text-slate-300 mt-1">/month</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="text-green-400" size={20} />
              <span>No medical exam required</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="text-green-400" size={20} />
              <span>Fast approval in 24 hours</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="text-green-400" size={20} />
              <span>Locked-in rates</span>
            </div>
          </div>
          
          <button 
            onClick={onNext}
            className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white font-black py-5 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            <Zap size={20} /> Speak with an Advisor
          </button>
        </div>

        {/* Customization Panel */}
        <div className="space-y-8">
          {/* Coverage Adjuster */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-[#0891B2]" size={22} />
              <h3 className="font-black text-[#0891B2] text-lg">Coverage Amount</h3>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 font-semibold">Current:</span>
              <span className="text-2xl font-black text-[#0891B2]">
                ${formData.coverage >= 1000000 
                  ? (formData.coverage / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'M'
                  : (formData.coverage / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'k'
                }
              </span>
            </div>
            <input 
              type="range" 
              min="100000" 
              max="5000000" 
              step="50000" 
              value={formData.coverage || 100000}
              onChange={(e) => onUpdate('coverage', parseInt(e.target.value, 10))}
              className="w-full h-3 bg-gradient-to-r from-slate-200 to-teal-500 rounded-lg appearance-none cursor-pointer accent-[#0891B2] shadow-md"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-semibold">
              <span>$100k</span>
              <span>$5M</span>
            </div>
          </div>

          {/* Term Selector */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-[#0891B2]" size={22} />
              <h3 className="font-black text-[#0891B2] text-lg">Policy Term</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((yr) => (
                <button 
                  key={yr}
                  onClick={() => onUpdate('years', yr)}
                  className={`py-4 px-2 border-2 rounded-xl font-black transition-all text-sm ${
                    formData.years === yr 
                    ? 'border-[#0891B2] bg-[#0891B2] text-white shadow-lg shadow-blue-500/30' 
                    : 'border-slate-200 text-slate-600 bg-white hover:border-[#0891B2] hover:bg-slate-50'
                  }`}
                >
                  {yr}yr
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 pt-8 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <button 
          onClick={onPrev}
          className="text-[#0891B2] font-black hover:text-[#E63946] flex items-center gap-2 transition-colors text-lg"
        >
          <ChevronLeft size={20} /> Back to Edit
        </button>
        <div className="flex flex-col md:flex-row gap-6 text-center">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <Zap className="text-[#0891B2]" size={18} /> Instant Quote
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <CheckCircle2 className="text-green-500" size={18} /> Best Rates
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeResults;