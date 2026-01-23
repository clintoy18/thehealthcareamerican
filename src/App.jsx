import React, { useState, useMemo } from 'react';
import { calculateLifePremium } from './core/lifeInsurance';
import { getCRMService } from './core/services/CRMService';
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
    healthStatus: 'Good',
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
  }, [
    formData.age,
    formData.coverage,
    formData.years,
    formData.healthStatus,
    formData.smokerStatus,
    formData.category
  ]);

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

  const handleFinalSubmit = async () => {
    // Initialize CRM Service
    const crmService = getCRMService();

    // Prepare lead data packet
    const leadData = {
      // Personal Information
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      
      // Quote Parameters
      age: formData.age,
      zip: formData.zip,
      gender: formData.gender,
      healthStatus: formData.healthStatus,
      smoker: formData.smoker,
      
      // Coverage & Term
      coverage: formData.coverage,
      years: formData.years,
      
      // Premium Calculation
      estimatedMonthlyPremium: premium,
      
      // Metadata
      timestamp: new Date().toISOString(),
      source: 'web_quote_tool',
    };

    try {
      // Submit lead through CRM Service
      const result = await crmService.submitLead(leadData);
      console.log("Lead successfully transmitted:", result);
      alert("Thank you! A financial professional will contact you shortly.");
    } catch (error) {
      console.error("Lead submission failed:", error);
      
      // Determine user-facing message based on error type
      let userMessage = "We're experiencing technical difficulties. Please try again or contact us directly.";
      
      if (error.code === 'VALIDATION_ERROR') {
        userMessage = "Please complete all required fields correctly.";
      } else if (error.code === 'TIMEOUT') {
        userMessage = "Request timed out. Please check your connection and try again.";
      }
      
      alert(userMessage);
    }
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