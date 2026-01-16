import React, { useState } from 'react';
import { ChevronLeft, Lock, Mail, Phone, MapPin, User, CheckCircle2 } from 'lucide-react';

const ContactForm = ({ formData, onUpdate, onPrev, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
          <div className="flex justify-center">
            <div className="bg-green-500 text-white p-4 rounded-full">
              <CheckCircle2 size={64} />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-black text-[#0891B2] mb-3">Request Submitted!</h2>
            <p className="text-lg text-slate-600">Thank you, {formData.firstName}!</p>
          </div>
          <div className="bg-blue-50 border-2 border-[#0891B2] rounded-2xl p-8 space-y-3">
            <p className="font-bold text-[#0891B2] text-lg">What happens next?</p>
            <ul className="text-left space-y-2 text-slate-700">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" size={20} /> A licensed advisor will call you within 24 hours</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" size={20} /> We'll review your quote and answer any questions</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" size={20} /> Flexible options to fit your budget</li>
            </ul>
          </div>
          <p className="text-sm text-slate-500 italic">Confirmation email sent to <span className="font-bold">{formData.email}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-[#0891B2] mb-3">Complete Your Request</h2>
        <p className="text-slate-600 text-lg">An advisor will contact you shortly to discuss your quote</p>
        <div className="flex items-center justify-center gap-2 text-green-600 text-sm mt-4 font-black uppercase">
          <Lock size={16} /> 256-bit SSL Encrypted - Your data is secure
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-10 shadow-lg border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#0891B2]" />
                <label className="text-sm font-black uppercase text-slate-600">First Name</label>
              </div>
              <input 
                type="text" 
                placeholder="John" 
                value={formData.firstName}
                onChange={(e) => onUpdate('firstName', e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg text-lg transition-all" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#0891B2]" />
                <label className="text-sm font-black uppercase text-slate-600">Last Name</label>
              </div>
              <input 
                type="text" 
                placeholder="Doe" 
                value={formData.lastName}
                onChange={(e) => onUpdate('lastName', e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg text-lg transition-all" 
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-[#0891B2]" />
                <label className="text-sm font-black uppercase text-slate-600">Email Address</label>
              </div>
              <input 
                type="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => onUpdate('email', e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg text-lg transition-all" 
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-[#0891B2]" />
                <label className="text-sm font-black uppercase text-slate-600">Phone Number</label>
              </div>
              <input 
                type="tel" 
                placeholder="(555) 123-4567" 
                value={formData.phone}
                onChange={(e) => onUpdate('phone', e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-[#0891B2] focus:bg-white focus:shadow-lg text-lg transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-[#0891B2]">
            <CheckCircle2 className="text-[#0891B2] mx-auto mb-2" size={24} />
            <p className="text-xs font-bold text-[#0891B2]">No Medical Exam</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-[#0891B2]">
            <Lock className="text-[#0891B2] mx-auto mb-2" size={24} />
            <p className="text-xs font-bold text-[#0891B2]">100% Private</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-[#0891B2]">
            <Phone className="text-[#0891B2] mx-auto mb-2" size={24} />
            <p className="text-xs font-bold text-[#0891B2]">24hr Support</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-[#0891B2] hover:bg-[#0E7490] text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl transform hover:scale-105 text-lg"
          >
            Speak with an Advisor
          </button>
          <button 
            onClick={onPrev} 
            className="w-full text-[#0891B2] font-bold hover:text-slate-700 hover:bg-slate-50 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <ChevronLeft size={18} /> Back to Review Quote
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 italic">
          By submitting, you agree to be contacted about your insurance quote. Standard message rates may apply.
        </p>
      </div>
    </div>
  );
};

export default ContactForm;