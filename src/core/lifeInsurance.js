// src/core/lifeInsurance.js

/**
 * Pure function to calculate life insurance premiums.
 * This can be unit tested easily and is independent of the UI.
 */
export const calculateLifePremium = (params) => {
  const { age, coverage, years, healthStatus, smoker } = params;
  
  let monthlyBase = 11.99; // Starting rate
  
  // Logic: Coverage impact (approx. $9 per $500k)
  const coverageImpact = Math.floor(coverage / 500000) * 9;
  
  // Logic: Term length impact
  const termImpact = (years - 10) * 0.75;
  
  // Logic: Age multiplier (Seniors have higher risk)
  const ageMultiplier = age > 50 ? 1 + (age - 50) * 0.02 : 1;
  
  // Logic: Health & Smoker modifiers
  const healthFactors = { 'Excellent': 0.8, 'Good': 1.0, 'Average': 1.2, 'Fair': 1.5 };
  const healthMultiplier = healthFactors[healthStatus] || 1.0;
  const smokerPremium = smoker === 'Yes' ? 15.00 : 0;

  const total = (monthlyBase + coverageImpact + termImpact + smokerPremium) * ageMultiplier * healthMultiplier;
  
  return total.toFixed(2);
};