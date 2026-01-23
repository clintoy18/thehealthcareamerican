/**
 * Configuration for all Life Insurance Products
 * Source: Life_Insurance_Quoting_Tool_Maryland (1).xlsx
 */
export const PRODUCT_CONFIG = {
  TERM_LIFE: {
    baseAmount: 100000,
    minAge: 5,
    maxAge: 70,
    baseRates: {
      5: 8, 10: 9, 15: 10, 18: 12, 25: 14, 30: 16, 35: 18, 
      40: 22, 45: 30, 50: 42, 55: 60, 59: 75, 65: 115, 68: 130, 70: 175
    }
  },
  WHOLE_LIFE: {
    baseAmount: 50000,
    minAge: 1,
    maxAge: 65,
    baseRates: {
      1: 25, 5: 28, 10: 30, 15: 35, 18: 40, 25: 65, 35: 100, 45: 160, 55: 250, 65: 360
    }
  },
  FINAL_EXPENSE: {
    baseAmount: 10000,
    minAge: 60,
    maxAge: 80,
    baseRates: {
      60: 45,
      65: 60,
      70: 85,
      75: 120,
      80: 165
    }
  }
};

const MULTIPLIERS = {
  TERM_LENGTH: { 10: 1.0, 20: 1.6, 30: 2.2 },
  HEALTH: { 'Excellent': 0.85, 'Good': 1.0, 'Average': 1.3, 'Below Average': 1.7 },
  TOBACCO: { 'Non-smoker': 1.0, 'Smoker': 2.3 },
  // Coverage interpolation points
  COVERAGE_TIERS: [
    { amount: 10000, multiplier: 0.28 }, // Extrapolated for Final Expense
    { amount: 50000, multiplier: 0.60 },
    { amount: 100000, multiplier: 1.00 },
    { amount: 250000, multiplier: 2.20 },
    { amount: 500000, multiplier: 4.10 }
  ]
};

/**
 * Finds the closest base rate in the product-specific table
 */
const getBaseRate = (category, age) => {
  const config = PRODUCT_CONFIG[category];
  if (!config) return 0;

  const ages = Object.keys(config.baseRates).map(Number).sort((a, b) => a - b);
  const closestAge = ages.reduce((prev, curr) => 
    Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
  );

  return config.baseRates[closestAge];
};

/**
 * Calculates a coverage multiplier based on linear interpolation
 */
const getCoverageMultiplier = (amount) => {
  const tiers = MULTIPLIERS.COVERAGE_TIERS;
  if (amount <= tiers[0].amount) return tiers[0].multiplier;
  if (amount >= tiers[tiers.length - 1].amount) return tiers[tiers.length - 1].multiplier;

  for (let i = 0; i < tiers.length - 1; i++) {
    if (amount >= tiers[i].amount && amount <= tiers[i + 1].amount) {
      const lower = tiers[i];
      const upper = tiers[i + 1];
      const ratio = (amount - lower.amount) / (upper.amount - lower.amount);
      return lower.multiplier + (upper.multiplier - lower.multiplier) * ratio;
    }
  }
  return 1.0;
};

/**
 * Final Calculation Engine
 * Formula: Base Rate * Term Mult * (Coverage Mult / Base Amount Mult) * Health Mult * Tobacco Mult
 */
export const calculateLifePremium = (params) => {
  const { category, age, coverage, years, healthStatus, smokerStatus } = params;

  const product = PRODUCT_CONFIG[category];
  if (!product) return 0;

  // AGE GUARD: Return 0 if age is out of bounds
  if (age < product.minAge || age > product.maxAge) {
    return 0;
  }

  const baseRate = getBaseRate(category, age);
  const termMult = (category === 'TERM_LIFE') ? (MULTIPLIERS.TERM_LENGTH[years] || 1.0) : 1.0;
  
  const targetCoverageMult = getCoverageMultiplier(coverage);
  const baseCoverageMult = getCoverageMultiplier(product.baseAmount);
  const normalizedCoverageMult = targetCoverageMult / baseCoverageMult;

  const healthMult = MULTIPLIERS.HEALTH[healthStatus] || 1.0;
  const tobaccoMult = (smokerStatus === 'Smoker' || smokerStatus === 'Yes') ? 2.3 : 1.0;

  const total = baseRate * termMult * normalizedCoverageMult * healthMult * tobaccoMult;

  return parseFloat(total.toFixed(2));
};