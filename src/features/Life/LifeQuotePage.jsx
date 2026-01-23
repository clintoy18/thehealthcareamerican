import React, { useMemo } from 'react';
import { calculateLifePremium, PRODUCT_CONFIG } from '../../core/lifeInsurance';
import { ChevronRight, Cake, Shield, Layers, AlertCircle, HeartPulse, Zap } from 'lucide-react';

const LifeQuotePage = ({ formData, onUpdate, onNext }) => {
  // Determine current product rules based on selected category
  const product = PRODUCT_CONFIG[formData.category || 'TERM_LIFE'];
  
  // 1. Logic for Category-Specific Coverage Options
  const coverageOptions = useMemo(() => {
    const category = formData.category || 'TERM_LIFE';
    if (category === 'FINAL_EXPENSE') {
      return [5000, 10000, 15000, 25000, 50000];
    }
    if (category === 'WHOLE_LIFE') {
      return [25000, 50000, 100000, 250000];
    }
    return [100000, 250000, 500000, 1000000];
  }, [formData.category]);

  // 2. Real-time Age Eligibility Guard
  const isEligible = useMemo(() => {
    if (!formData.age) return true; // Neutral state while typing
    return formData.age >= product.minAge && formData.age <= product.maxAge;
  }, [formData.age, product]);

  // 3. Premium Calculation
  const estimatedPrice = useMemo(() => {
    if (!isEligible || !formData.age) return "0.00";
    const premium = calculateLifePremium(formData);
    return premium.toFixed(2);
  }, [formData, isEligible]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 md:p-14">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-[#0891B2] mb-3">Get Your Quote</h2>
          <p className="text-slate-500 text-lg">Fast, simple, and tailored to your needs</p>
        </div>

        {/* Product Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {Object.keys(PRODUCT_CONFIG).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onUpdate('category', cat);
                // Reset coverage to the base amount for the new category
                onUpdate('coverage', PRODUCT_CONFIG[cat].baseAmount);
              }}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.category === cat
                  ? 'border-[#0891B2] bg-[#0891B2]/5 shadow-md'
                  : 'border-slate-100 hover:border-slate-300 bg-white'
              }`}
            >
              <Shield size={24} className={formData.category === cat ? 'text-[#0891B2]' : 'text-slate-400'} />
              <span className={`font-black text-xs uppercase tracking-tighter ${
                formData.category === cat ? 'text-[#0891B2]' : 'text-slate-600'
              }`}>
                {cat.replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Age Input with Guardrail UI */}
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              <Cake size={18} className="text-[#0891B2]" />
              <label className="text-sm font-black uppercase text-slate-600">Your Age</label>
            </div>
            <input 
              type="number" 
              required
              value={formData.age ?? ""}
              onChange={(e) => onUpdate('age', e.target.value === "" ? "" : Number(e.target.value))}
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all text-lg font-semibold ${
                !isEligible ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0891B2]'
              }`} 
            />
            {!isEligible && (
              <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase">
                <AlertCircle size={12} /> Age must be {product.minAge}-{product.maxAge} for this plan
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#0891B2]" />
              <label className="text-sm font-black uppercase text-slate-600">Coverage Amount</label>
            </div>
            <select 
              value={formData.coverage}
              required
              onChange={(e) => onUpdate('coverage', Number(e.target.value))}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-[#0891B2] font-semibold transition-all cursor-pointer"
            >
              {coverageOptions.map(val => (
                <option key={val} value={val}>${val.toLocaleString()}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HeartPulse size={18} className="text-[#0891B2]" />
              <label className="text-sm font-black uppercase text-slate-600">Health Status</label>
            </div>
            <select 
              value={formData.healthStatus}
              required
              onChange={(e) => onUpdate('healthStatus', e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-[#0891B2] font-semibold transition-all cursor-pointer"
            >
              <option>Excellent</option>
              <option>Good</option>
              <option>Average</option>
              <option>Below Average</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#0891B2]" />
              <label className="text-sm font-black uppercase text-slate-600">Smoker Status</label>
            </div>
            <div className="flex gap-3">
              {['Non-smoker', 'Smoker'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUpdate('smokerStatus', opt)}
                  className={`flex-1 py-4 rounded-xl font-bold uppercase text-sm tracking-wider transition-all ${
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
        </div>

        {/* Premium Display Card */}
        <div className={`rounded-3xl p-10 text-center shadow-2xl transition-all duration-300 ${
          isEligible ? 'bg-gradient-to-br from-[#0891B2] to-[#06B6D4]' : 'bg-slate-300'
        } text-white`}>
          {isEligible ? (
            <>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/80 mb-4">Estimated Monthly Premium</p>
              <div className="flex items-start justify-center mb-8">
                <span className="text-4xl font-black mt-3">$</span>
                <span className="text-8xl font-black tracking-tighter">{estimatedPrice.split('.')[0]}</span>
                <div className="text-left ml-2 mt-4">
                  <span className="text-3xl font-black">.{estimatedPrice.split('.')[1]}</span>
                  <p className="text-xs text-white/60">/month</p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6">
              <AlertCircle size={48} className="mx-auto mb-4 text-white/50" />
              <h3 className="text-2xl font-black uppercase">Not Eligible</h3>
              <p className="text-sm font-medium text-white/80">Applicant age must be between {product.minAge} and {product.maxAge} for this plan.</p>
            </div>
          )}
          
          <button 
            onClick={onNext}
            disabled={!isEligible || !formData.age}
            className={`w-full px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all transform flex items-center justify-center gap-3 text-lg ${
              isEligible && formData.age 
                ? 'bg-white text-[#0891B2] hover:scale-105 shadow-xl' 
                : 'bg-white/20 text-white/40 cursor-not-allowed'
            }`}
          >
            {isEligible ? "See Your Full Quote" : "Check Eligibility"} <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

// CRITICAL: Default export for App.jsx to find
export default LifeQuotePage;