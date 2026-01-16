/**
 * CRM Service Layer
 * Handles all communication with CRM systems
 * Implements abstraction for external CRM APIs
 */

import { validateLead, sanitizeLead } from '../interfaces/Lead';

/**
 * CRM Service Class
 * Responsible for:
 * - Lead submission to CRM
 * - Error handling and retry logic
 * - Logging and monitoring
 * - Service abstraction
 */
class CRMService {
  constructor(config = {}) {
    this.endpoint = config.endpoint || process.env.REACT_APP_CRM_ENDPOINT || '/api/leads';
    this.apiKey = config.apiKey || process.env.REACT_APP_CRM_API_KEY;
    this.timeout = config.timeout || 10000; // 10 seconds
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000; // 1 second
    this.logger = config.logger || console;
  }

  /**
   * Sends lead data to CRM
   * @param {Lead} leadData - Lead object to submit
   * @returns {Promise<Object>} Response from CRM
   * @throws {Error} If submission fails after retries
   */
  async submitLead(leadData) {
    // Validate lead data
    const validation = validateLead(leadData);
    if (!validation.isValid) {
      const error = new Error('Lead validation failed: ' + validation.errors.join(', '));
      error.code = 'VALIDATION_ERROR';
      error.details = validation.errors;
      this.logger.error('Lead validation failed:', error);
      throw error;
    }

    // Sanitize lead data
    const sanitizedLead = sanitizeLead(leadData);

    // Log submission attempt
    this.logger.log('Submitting lead to CRM:', {
      email: sanitizedLead.email,
      timestamp: new Date().toISOString()
    });

    // Attempt submission with retry logic
    return this._submitWithRetry(sanitizedLead, 0);
  }

  /**
   * Internal method: Submit with exponential backoff retry
   * @private
   */
  async _submitWithRetry(leadData, attempt = 0) {
    try {
      const response = await this._postToCRM(leadData);
      
      this.logger.log('Lead successfully submitted to CRM:', {
        email: leadData.email,
        leadId: response.leadId,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response,
        message: 'Lead submitted successfully'
      };
    } catch (error) {
      attempt++;

      // Check if error is retryable (network errors, timeouts, 5xx errors)
      const isRetryable = this._isRetryableError(error) && attempt < this.retryAttempts;

      if (isRetryable) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        this.logger.warn(`Retry attempt ${attempt}/${this.retryAttempts} after ${delay}ms`, error.message);
        
        await this._sleep(delay);
        return this._submitWithRetry(leadData, attempt);
      }

      // All retries exhausted or non-retryable error
      this.logger.error('Lead submission failed after retries:', {
        email: leadData.email,
        attempts: attempt,
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Posts lead data to CRM endpoint
   * @private
   */
  async _postToCRM(leadData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'HealthcareAmericanQuoteTool/1.0'
      };

      // Add API key if configured
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(leadData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text().catch(() => null);
        const error = new Error(`CRM API returned ${response.status}: ${errorData || response.statusText}`);
        error.status = response.status;
        error.response = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        const timeoutError = new Error('CRM request timeout');
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }
      
      throw error;
    }
  }

  /**
   * Determines if an error is retryable
   * @private
   */
  _isRetryableError(error) {
    // Network errors are retryable
    if (error.code === 'TIMEOUT' || error.message.includes('Failed to fetch')) {
      return true;
    }

    // Server errors (5xx) are retryable
    if (error.status >= 500) {
      return true;
    }

    // Too Many Requests is retryable
    if (error.status === 429) {
      return true;
    }

    return false;
  }

  /**
   * Utility: Sleep for specified milliseconds
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test CRM connectivity
   * @returns {Promise<boolean>} True if CRM is reachable
   */
  async healthCheck() {
    try {
      const response = await fetch(this.endpoint, {
        method: 'OPTIONS',
        headers: {
          'User-Agent': 'HealthcareAmericanQuoteTool/1.0'
        }
      });
      return response.ok;
    } catch (error) {
      this.logger.warn('CRM health check failed:', error.message);
      return false;
    }
  }
}

// Create singleton instance
let crmServiceInstance = null;

/**
 * Get or create CRM Service instance
 * @param {Object} config - Configuration object
 * @returns {CRMService} CRM Service instance
 */
export const getCRMService = (config = {}) => {
  if (!crmServiceInstance) {
    crmServiceInstance = new CRMService(config);
  }
  return crmServiceInstance;
};

export default CRMService;
