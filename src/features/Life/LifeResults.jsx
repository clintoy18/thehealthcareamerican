import React, { useMemo } from 'react';
import { ChevronLeft, ArrowRight, CheckCircle2, Zap, DollarSign, Calendar, Info } from 'lucide-react';
import { calculateLifePremium, PRODUCT_CONFIG } from '../../core/lifeInsurance';

const LifeResults = ({ formData, onUpdate, onPrev, onNext }) => {
  const category = formData.category || 'TERM_LIFE';
  const product = PRODUCT_CONFIG[category];

  const premium = useMemo(() => {
    if (!formData) return '0.00';
    const calc = calculateLifePremium(formData);
    return Number(calc).toFixed(2);
  }, [
    formData.age,
    formData.coverage,
    formData.years,
    formData.healthStatus,
    formData.smokerStatus,
    formData.category
  ]);


  // Dynamic range settings based on category
  const rangeSettings = useMemo(() => {
    switch (category) {
      case 'FINAL_EXPENSE':
        return { min: 5000, max: 50000, step: 5000 };
      case 'WHOLE_LIFE':
        return { min: 25000, max: 250000, step: 25000 };
      default:
        return { min: 100000, max: 1000000, step: 50000 };
    }
  }, [category]);

  return (
    <div className="p-8 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-[#0891B2] mb-2">Your Personalized Quote</h2>
        <p className="text-slate-500 text-lg uppercase font-bold tracking-widest text-xs">
          Product Type: {category.replace('_', ' ')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Premium Display Card */}
        <div className="bg-gradient-to-br from-[#0891B2] via-[#06B6D4] to-[#0891B2] text-white rounded-3xl p-10 shadow-2xl flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/70 mb-4">Monthly Premium</p>
            <div className="flex items-start mb-10">
              <span className="text-5xl font-black mt-2">$</span>
              <span className="text-9xl font-black tracking-tighter leading-none">{premium.split('.')[0]}</span>
              <div className="text-left ml-2 mt-4">
                <p className="text-4xl font-black">.{premium.split('.')[1]}</p>
                <p className="text-xs text-slate-300 mt-1">/month</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 className="text-green-400" size={20} />
              <span>{category === 'TERM_LIFE' ? 'Flexible Term Lengths' : 'Permanent Lifetime Protection'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 className="text-green-400" size={20} />
              <span>Rates Locked In for Life</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 className="text-green-400" size={20} />
              <span>Fast Approval Process</span>
            </div>
          </div>
          
          <button 
            onClick={onNext}
            className="w-full bg-white text-[#0891B2] font-black py-5 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center uppercase tracking-widest"
          >
            Finalize My Quote <ArrowRight className="ml-2" size={20} />
          </button>
        </div>

        {/* Customization Panel */}
        <div className="space-y-8">
          {/* Coverage Adjuster */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-[#0891B2]" size={22} />
              <h3 className="font-black text-[#0891B2] text-lg uppercase">Coverage Amount</h3>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-600 font-bold text-sm">TOTAL BENEFIT:</span>
              <span className="text-3xl font-black text-[#0891B2]">
                ${(formData.coverage || 0).toLocaleString()}
              </span>
            </div>
            <input 
              type="range" 
              min={rangeSettings.min} 
              max={rangeSettings.max} 
              step={rangeSettings.step} 
              value={formData.coverage || rangeSettings.min}
              onChange={(e) => onUpdate('coverage', parseInt(e.target.value, 10))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0891B2]"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-400 mt-3 uppercase tracking-tighter">
              <span>Min: ${rangeSettings.min.toLocaleString()}</span>
              <span>Max: ${rangeSettings.max.toLocaleString()}</span>
            </div>
          </div>

          {/* Policy Detail / Term Selector */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            {category === 'TERM_LIFE' ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="text-[#0891B2]" size={22} />
                  <h3 className="font-black text-[#0891B2] text-lg uppercase">Policy Term</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30].map((yr) => (
                    <button 
                      key={yr}
                      onClick={() => onUpdate('years', yr)}
                      className={`py-4 border-2 rounded-xl font-black transition-all ${
                        formData.years === yr 
                        ? 'border-[#0891B2] bg-[#0891B2] text-white' 
                        : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {yr} Years
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Info className="text-[#0891B2] shrink-0" size={24} />
                <div>
                  <h4 className="font-black text-[#0891B2] text-sm uppercase">Permanent Protection</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Unlike Term insurance, your <strong>{category.replace('_', ' ')}</strong> policy never expires as long as premiums are paid.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 pt-8 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <button 
          onClick={onPrev}
          className="text-[#0891B2] font-black hover:text-slate-800 flex items-center gap-2 transition-colors text-lg"
        >
          <ChevronLeft size={20} /> Back to My Info
        </button>
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Zap className="text-[#0891B2]" size={16} /> Real-Time Math
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <CheckCircle2 className="text-green-500" size={16} /> MD Approved
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeResults;