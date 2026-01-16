import React, { useState, useMemo } from 'react';
import { calculateLifePremium } from './core/lifeInsurance';
import Header from './shared/Header';
import LifeQuotePage from './features/Life/LifeQuotePage';
import LifeResults from './features/Life/LifeResults';
import ContactForm from './features/Life/ContactForm';

/**
 * App Component: Central Orchestrator
 * Follows Clean Architecture by keeping logic in 'core' and presentation in 'features'.
 */
const App = () => {
  // 1. Application State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Initial Assessment
    age: 22,
    zip: '99950',
    gender: 'Male',
    healthStatus: 'Excellent',
    smoker: 'No',
    // Step 2: Coverage Parameters
    coverage: 100000,
    years: 10,
    // Step 3: Contact Details
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: ''
  });

  // 2. Computed State (Domain Layer Bridge)
  // useMemo ensures math only runs when relevant data changes
  const premium = useMemo(() => {
    return calculateLifePremium(formData);
  }, [formData.age, formData.coverage, formData.years, formData.healthStatus, formData.smoker]);

  // 3. State Handlers
  const updateField = (field, value) => {
    // Security: Basic sanitization for text inputs
    const sanitizedValue = typeof value === 'string' ? value.replace(/[<>]/g, '') : value;
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    console.log("Transmitting lead to thehealthcareamerican API...", formData);
    alert("Thank you! A financial professional will contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased">
      {/* Shared Navigation Component */}
      <Header step={currentStep} />

      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* Progress Label for Seniors */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">
            {currentStep === 1 && "Getting a Quote"}
            {currentStep === 2 && "Your Personal Estimate"}
            {currentStep === 3 && "Professional Contact"}
          </span>
        </div>

        {/* Feature Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {currentStep === 1 && (
            <LifeQuotePage 
              formData={formData} 
              onUpdate={updateField} 
              onNext={nextStep} 
            />
          )}

          {currentStep === 2 && (
            <LifeResults 
              formData={formData} 
              premium={premium} 
              onUpdate={updateField} 
              onPrev={prevStep} 
              onNext={nextStep} 
            />
          )}

          {currentStep === 3 && (
            <ContactForm 
              formData={formData} 
              onUpdate={updateField} 
              onPrev={prevStep} 
              onSubmit={handleFinalSubmit} 
            />
          )}
        </div>

        {/* Global Footer Disclosure */}
        <footer className="mt-12 text-[10px] text-slate-400 text-center px-6 leading-relaxed italic border-t pt-8 max-w-2xl mx-auto">
          © 2026 thehealthcareamerican. Estimates are for informational purposes. 
          Final policy issuance depends on medical underwriting and carrier approval. 
          Securities offered through regulated partners.
        </footer>
      </main>
    </div>
  );
};

export default App;