# Clean Architecture: Services & Interfaces

## Project Structure
```
src/
├── core/
│   ├── interfaces/
│   │   └── Lead.js                 # Lead data contract & validation
│   ├── services/
│   │   └── CRMService.js           # CRM communication layer
│   ├── lifeInsurance.js            # Business logic (premium calculation)
│
├── features/
│   └── Life/
│       ├── LifeQuotePage.jsx       # Step 1: Quote form
│       ├── LifeResults.jsx         # Step 2: Results & customization
│       └── ContactForm.jsx         # Step 3: Lead capture
│
├── shared/
│   └── Header.jsx                  # Navigation & progress
│
└── App.jsx                         # Main orchestrator
```

## Architecture Principles

### Separation of Concerns
- **Core Layer**: Pure business logic & data contracts
- **Services Layer**: External integrations (CRM communication)
- **Features Layer**: React UI components
- **Shared Layer**: Reusable UI components

### Data Flow
```
User Input (UI) 
    ↓
App.jsx (State Management)
    ↓
Service Layer (CRMService)
    ↓
Interface Validation (Lead)
    ↓
External API (CRM/Backend)
```

## Services

### CRMService
**Location**: `src/core/services/CRMService.js`

**Responsibilities**:
- Submit leads to CRM backend
- Validate lead data
- Handle errors and retries with exponential backoff
- Log and monitor submissions
- Provide health checks

**Usage**:
```javascript
import { getCRMService } from './core/services/CRMService';

const crmService = getCRMService();
const result = await crmService.submitLead(leadData);
```

**Configuration** (via environment variables):
```
REACT_APP_CRM_ENDPOINT=https://your-crm.com/api/leads
REACT_APP_CRM_API_KEY=your_api_key_here
```

**Features**:
- ✅ Automatic validation via Lead interface
- ✅ Data sanitization (XSS prevention)
- ✅ Retry logic with exponential backoff (3 attempts)
- ✅ Request timeout handling (10 seconds)
- ✅ Health checks
- ✅ Comprehensive error handling
- ✅ Request/response logging

## Interfaces

### Lead Interface
**Location**: `src/core/interfaces/Lead.js`

**Validates**:
- Required fields present
- Email format
- Phone number format
- Age range (18-150)
- Coverage range ($100k-$5M)
- Enum values (gender, health status, smoker)

**Functions**:
- `validateLead(lead)` - Validates lead object
- `sanitizeLead(lead)` - Sanitizes for XSS protection

**Usage**:
```javascript
import { validateLead, sanitizeLead } from './core/interfaces/Lead';

const validation = validateLead(leadData);
if (!validation.isValid) {
  console.error(validation.errors); // Array of error messages
}

const safe = sanitizeLead(leadData);
```

## Configuration

### Environment Variables
Create `.env` file in project root:

```env
# CRM Configuration
REACT_APP_CRM_ENDPOINT=https://your-crm-api.com/leads
REACT_APP_CRM_API_KEY=your_secret_api_key

# Optional
REACT_APP_LOG_LEVEL=debug
REACT_APP_RETRY_ATTEMPTS=3
```

### Runtime Configuration
```javascript
const crmService = getCRMService({
  endpoint: 'https://custom-crm.com/api',
  apiKey: 'custom-key',
  timeout: 15000,
  retryAttempts: 5,
  retryDelay: 2000,
  logger: customLogger
});
```

## Error Handling

### Automatic Retry Logic
- **Network errors** → Retry with exponential backoff
- **Server errors (5xx)** → Retry with exponential backoff
- **Rate limiting (429)** → Retry with exponential backoff
- **Validation errors** → Fail immediately (no retry)
- **Client errors (4xx)** → Fail immediately (no retry)

### Error Codes
- `VALIDATION_ERROR` - Lead data validation failed
- `TIMEOUT` - Request timeout
- `NETWORK_ERROR` - Network connectivity issue

## Example: Integrating with Popular CRMs

### HubSpot
```env
REACT_APP_CRM_ENDPOINT=https://api.hubapi.com/crm/v3/objects/contacts
REACT_APP_CRM_API_KEY=your-hubspot-api-key
```

### Pipedrive
```env
REACT_APP_CRM_ENDPOINT=https://api.pipedrive.com/v1/persons
REACT_APP_CRM_API_KEY=your-pipedrive-api-key
```

### Custom Backend
```env
REACT_APP_CRM_ENDPOINT=https://your-backend.com/api/leads
REACT_APP_CRM_API_KEY=your-backend-token
```

## Security Features

✅ **Input Validation**
- All lead fields validated before submission
- Type checking and format validation

✅ **Data Sanitization**
- HTML/script tags removed from string fields
- XSS attack prevention

✅ **HTTPS Only**
- All requests use HTTPS

✅ **API Key Management**
- Keys stored in environment variables
- Never hardcoded in source

✅ **Error Disclosure**
- Validation errors shown to user
- Technical errors logged but not exposed

## Monitoring & Logging

All submissions logged with:
- Email address
- Timestamp
- Lead ID (from CRM response)
- Error messages and retry attempts

Access logs via browser console:
```javascript
// Check recent submissions
import { getCRMService } from './core/services/CRMService';
getCRMService().logger.log('Last submission info');
```

## Adding Custom Business Logic

### Extending the Service
```javascript
// src/core/services/CRMService.js
async submitWithFollowUp(leadData, followUpDate) {
  // Your custom logic here
  const result = await this.submitLead(leadData);
  // Schedule follow-up
  return result;
}
```

### Custom Validators
```javascript
// src/core/interfaces/Lead.js
export const validateLeadWithCustomRules = (lead) => {
  const base = validateLead(lead);
  // Add custom validation
  return base;
};
```

## Testing

```javascript
// Test lead validation
const testLead = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  age: 35,
  zip: '10001',
  gender: 'Male',
  healthStatus: 'Good',
  smoker: 'No',
  coverage: 500000,
  years: 20,
  estimatedMonthlyPremium: '45.99'
};

const validation = validateLead(testLead);
console.log(validation.isValid); // true
```

## Next Steps

1. **Configure CRM endpoint** in `.env`
2. **Set up backend API** to receive leads
3. **Test submission** via contact form
4. **Add monitoring** for submission success rate
5. **Implement logging service** for production use
