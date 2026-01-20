// src/features/Life/LifeQuotePage.jsx
import React, { useMemo } from 'react';
import { calculateLifePremium } from '../../core/lifeInsurance';
import { ChevronRight, Cake, MapPin, Users } from 'lucide-react';

const LifeQuotePage = ({ formData, onUpdate, onNext }) => {
  const estimatedPrice = useMemo(() => {
    const premium = calculateLifePremium(formData);
    return premium.toFixed(2);
  }, [formData]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 md:p-14">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-[#0891B2] mb-3">Get Your Quote in 60 Seconds</h2>
          <p className="text-slate-500 text-lg">Fast, simple, and completely free</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cake size={18} className="text-[#0891B2]" />
              <label className="text-sm font-black uppercase text-slate-600">Your Age</label>
            </div>
            <input 
              type="number" 
              value={formData.age}
              onChange={(e) => onUpdate('age', Number(e.target.value))}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg text-lg font-semibold transition-all" 
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#0891B2]" />
              <label className="text-sm font-black uppercase text-slate-600">Zip Code</label>
            </div>
            <input 
              type="text" 
              value={formData.zip}
              onChange={(e) => onUpdate('zip', e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg text-lg font-semibold transition-all" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black uppercase text-slate-600">Gender</label>
            <select 
              value={formData.gender}
              onChange={(e) => onUpdate('gender', e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg font-semibold transition-all cursor-pointer"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black uppercase text-slate-600">Health Status</label>
            <select 
              value={formData.healthStatus}
              onChange={(e) => onUpdate('healthStatus', e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg font-semibold transition-all cursor-pointer"
            >
              <option>Excellent</option>
              <option>Good</option>
              <option>Average</option>
              <option>Below Average</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="space-y-3">
            <label className="text-sm font-black uppercase text-slate-600">Do you smoke?</label>
            <div className="flex gap-3">
              {['Non-smoker', 'Smoker'].map(opt => (
                <button
                  key={opt}
                  onClick={() => onUpdate('smokerStatus', opt)}
                  className={`flex-1 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all ${
                    formData.smokerStatus === opt
                      ? 'bg-[#0891B2] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt === 'Non-smoker' ? 'No' : 'Yes'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black uppercase text-slate-600">Coverage Amount</label>
            <select 
              value={formData.coverage}
              onChange={(e) => onUpdate('coverage', Number(e.target.value))}
              className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg font-semibold transition-all cursor-pointer"
            >
              <option value="100000">$100,000</option>
              <option value="250000">$250,000</option>
              <option value="500000">$500,000</option>
              <option value="1000000">$1,000,000</option>
            </select>
          </div>
        </div>

        {/* Premium Display Card */}
        <div className="bg-gradient-to-br from-[#0891B2] to-[#06B6D4] text-white rounded-3xl p-10 text-center shadow-2xl border border-[#E63946]/30">
          <p className="text-[11px] font-black uppercase tracking-widest text-white mb-4">Your Estimated Monthly Premium</p>
          <div className="flex items-start justify-center mb-8">
            <span className="text-4xl font-black mt-3">$</span>
            <span className="text-8xl font-black tracking-tighter">{estimatedPrice.split('.')[0]}</span>
            <div className="text-left ml-2 mt-4">
              <span className="text-3xl font-black">.{estimatedPrice.split('.')[1]}</span>
              <p className="text-xs text-slate-300">/month</p>
            </div>
          </div>
          
          <div className="mb-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <p className="text-xs font-semibold text-slate-200 mb-2">FOR COVERAGE:</p>
            <p className="text-2xl font-black text-white">
              ${formData.coverage >= 1000000 
                ? (formData.coverage / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'M'
                : (formData.coverage / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'k'
              }
            </p>
          </div>
          
          <button 
            onClick={onNext}
            className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 text-lg"
          >
            See Your Full Quote <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifeQuotePage;