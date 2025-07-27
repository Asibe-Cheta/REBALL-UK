export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    errors.push('This field is required');
    return { isValid: false, errors };
  }

  if (!value || value.trim() === '') {
    return { isValid: true, errors: [] };
  }

  // Length validations
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }

  // Email validation
  if (rules.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      errors.push('Please enter a valid email address');
    }
  }

  // Phone validation
  if (rules.phone) {
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    if (!phonePattern.test(cleanPhone)) {
      errors.push('Please enter a valid phone number');
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (values: Record<string, string>, rules: Record<string, ValidationRule>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  Object.keys(rules).forEach(fieldName => {
    const value = values[fieldName] || '';
    results[fieldName] = validateField(value, rules[fieldName]);
  });

  return results;
};

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: { required: true, email: true },
  phone: { required: true, phone: true },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Must contain at least one number';
      return null;
    }
  },
  name: { required: true, minLength: 2, maxLength: 50 },
  message: { required: true, minLength: 10, maxLength: 1000 },
  postcode: {
    required: true,
    pattern: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
    custom: (value: string) => {
      if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(value)) {
        return 'Please enter a valid UK postcode';
      }
      return null;
    }
  }
};

// Helper function to get field error class
export const getFieldErrorClass = (hasError: boolean, touched: boolean): string => {
  if (!touched) return '';
  return hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-green-500 focus:border-green-500 focus:ring-green-500';
};

// Helper function to get field success class
export const getFieldSuccessClass = (isValid: boolean, touched: boolean): string => {
  if (!touched) return '';
  return isValid && touched ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : '';
};

// Helper function to format error messages
export const formatErrorMessage = (errors: string[]): string => {
  return errors.join(', ');
};

// Helper function to check if form is valid
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
}; 