// src/core/lifeInsurance.js
// Reference: See life_multipliers.txt for all calculation rules and multiplier values

/**
 * Base rates for 10-Year Term, $100,000 Coverage
 * Indexed by age
 * Source: life_multipliers.txt - Base Rates (10-Year Term, $100,000 Coverage)
 */
const BASE_RATES = {
  5: 8,
  10: 9,
  15: 10,
  18: 12,
  25: 14,
  30: 16,
  35: 18,
  40: 22,
  45: 30,
  50: 42,
  55: 60,
  59: 75,
  65: 115,
};

/**
 * Get the closest base rate for a given age
 */
const getBaseRateByAge = (age) => {
  const agesList = Object.keys(BASE_RATES).map(Number).sort((a, b) => a - b);
  
  if (age <= agesList[0]) return BASE_RATES[agesList[0]];
  if (age >= agesList[agesList.length - 1]) return BASE_RATES[agesList[agesList.length - 1]];
  
  // Find closest age
  let closest = agesList[0];
  for (let i = 0; i < agesList.length; i++) {
    if (Math.abs(agesList[i] - age) < Math.abs(closest - age)) {
      closest = agesList[i];
    }
  }
  
  return BASE_RATES[closest];
};

/**
 * Term Multipliers
 * Source: life_multipliers.txt - Term Multipliers
 */
const TERM_MULTIPLIERS = {
  10: 1.0,
  20: 1.6,
  30: 2.2,
};

/**
 * Get coverage multiplier for any coverage amount
 * Interpolates between known multiplier values for custom amounts
 */
const getCoverageMultiplier = (coverage) => {
  const multipliers = [
    { amount: 50000, multiplier: 0.6 },
    { amount: 100000, multiplier: 1.0 },
    { amount: 250000, multiplier: 2.2 },
    { amount: 500000, multiplier: 4.1 },
  ];
  
  // Validate input
  if (!coverage || coverage <= 0) return 1.0;
  
  // Exact match
  const exact = multipliers.find(m => m.amount === coverage);
  if (exact) return exact.multiplier;
  
  // If below lowest, use lowest
  if (coverage < multipliers[0].amount) return multipliers[0].multiplier;
  
  // If above highest, use highest
  if (coverage > multipliers[multipliers.length - 1].amount) {
    return multipliers[multipliers.length - 1].multiplier;
  }
  
  // Find surrounding values and interpolate
  for (let i = 0; i < multipliers.length - 1; i++) {
    if (coverage >= multipliers[i].amount && coverage <= multipliers[i + 1].amount) {
      const lower = multipliers[i];
      const upper = multipliers[i + 1];
      
      // Linear interpolation
      const ratio = (coverage - lower.amount) / (upper.amount - lower.amount);
      return lower.multiplier + (upper.multiplier - lower.multiplier) * ratio;
    }
  }
  
  return 1.0;
};

/**
 * Source: life_multipliers.txt - Health Multipliers
 * Health Multipliers
 */
const HEALTH_MULTIPLIERS = {
  'Excellent': 0.85,
  'Good': 1.0,
  'Average': 1.3,
  'Below Average': 1.7,
};

/**
 * Source: life_multipliers.txt - Tobacco Multipliers
 * Tobacco Multipliers
 */
const TOBACCO_MULTIPLIERS = {
  'Non-smoker': 1.0,
  'Smoker': 2.3,
};

/**
 * Pure function to calculate life insurance premiums.
 * Formula: Base Rate × Term Multiplier × Coverage Multiplier × Health Multiplier × Tobacco Multiplier
 * 
 * @param {Object} params - Quote parameters
 * @param {number} params.age - Age of applicant
 * @param {number} params.coverage - Coverage amount in dollars
 * @param {number} params.years - Term length in years (10, 20, or 30)
 * @param {string} params.healthStatus - Health classification (Excellent, Good, Average, Below Average)
 * @param {string} params.smokerStatus - Smoker status (Non-smoker or Smoker)
 * @returns {number} Final monthly premium rounded to 2 decimals
 */
export const calculateLifePremium = (params) => {
  // Validate params object exists
  if (!params || typeof params !== 'object') {
    return 0;
  }
  
  const { age, coverage, years, healthStatus, smokerStatus } = params;
  
  // Validate required fields
  if (!age || !coverage || !years || !healthStatus || !smokerStatus) {
    return 0;
  }
  
  // Get base rate by age
  const baseRate = getBaseRateByAge(age);
  
  // Get multipliers with validation
  const termMultiplier = TERM_MULTIPLIERS[years] || TERM_MULTIPLIERS[10];
  const coverageMultiplier = getCoverageMultiplier(coverage);
  const healthMultiplier = HEALTH_MULTIPLIERS[healthStatus] || HEALTH_MULTIPLIERS['Good'];
  const tobaccoMultiplier = TOBACCO_MULTIPLIERS[smokerStatus] || TOBACCO_MULTIPLIERS['Non-smoker'];
  
  // Validate all multipliers are numbers
  if (![baseRate, termMultiplier, coverageMultiplier, healthMultiplier, tobaccoMultiplier].every(m => typeof m === 'number' && m > 0)) {
    return 0;
  }
  
  // Calculate final premium
  const finalPremium = baseRate * termMultiplier * coverageMultiplier * healthMultiplier * tobaccoMultiplier;
  
  return parseFloat(finalPremium.toFixed(2));
};