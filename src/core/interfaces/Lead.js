/**
 * Lead Interface Definition
 * Defines the contract for lead data structure
 */

/**
 * @typedef {Object} Lead
 * @property {string} firstName - Lead's first name
 * @property {string} lastName - Lead's last name
 * @property {string} email - Lead's email address
 * @property {string} phone - Lead's phone number
 * @property {number} age - Lead's age
 * @property {string} zip - Lead's zip code
 * @property {string} gender - Lead's gender (Male/Female)
 * @property {string} healthStatus - Health status (Excellent/Good/Average/Fair)
 * @property {string} smoker - Smoking status (Yes/No)
 * @property {number} coverage - Coverage amount in dollars
 * @property {number} years - Policy term in years
 * @property {string} estimatedMonthlyPremium - Calculated monthly premium
 * @property {string} [timestamp] - ISO timestamp when lead was created
 * @property {string} [source] - Source identifier (web_quote_tool)
 */

/**
 * Validates if a lead object meets the required interface contract
 * @param {Lead} lead - Lead object to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateLead = (lead) => {
  const errors = [];

  // Required fields validation
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone',
    'age', 'zip', 'gender', 'healthStatus', 'smoker',
    'coverage', 'years', 'estimatedMonthlyPremium'
  ];

  requiredFields.forEach(field => {
    if (!lead[field] && lead[field] !== 0) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (lead.email && !emailRegex.test(lead.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (basic)
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (lead.phone && !phoneRegex.test(lead.phone)) {
    errors.push('Invalid phone number format');
  }

  // Age validation
  if (lead.age && (lead.age < 18 || lead.age > 150)) {
    errors.push('Age must be between 18 and 150');
  }

  // Coverage validation
  if (lead.coverage && (lead.coverage < 100000 || lead.coverage > 5000000)) {
    errors.push('Coverage must be between $100k and $5M');
  }

  // Enum validations
  const validGenders = ['Male', 'Female'];
  if (lead.gender && !validGenders.includes(lead.gender)) {
    errors.push('Invalid gender value');
  }

  const validHealthStatus = ['Excellent', 'Good', 'Average', 'Fair'];
  if (lead.healthStatus && !validHealthStatus.includes(lead.healthStatus)) {
    errors.push('Invalid health status value');
  }

  const validSmoker = ['Yes', 'No'];
  if (lead.smoker && !validSmoker.includes(lead.smoker)) {
    errors.push('Invalid smoker value');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes lead data to prevent injection attacks
 * @param {Lead} lead - Lead object to sanitize
 * @returns {Lead} Sanitized lead object
 */
export const sanitizeLead = (lead) => {
  const sanitized = { ...lead };
  
  // Sanitize string fields
  const stringFields = ['firstName', 'lastName', 'email', 'phone', 'zip', 'gender', 'healthStatus', 'smoker'];
  
  stringFields.forEach(field => {
    if (typeof sanitized[field] === 'string') {
      // Remove HTML/script tags and trim
      sanitized[field] = sanitized[field]
        .replace(/[<>]/g, '')
        .trim();
    }
  });

  return sanitized;
};

export default { validateLead, sanitizeLead };
