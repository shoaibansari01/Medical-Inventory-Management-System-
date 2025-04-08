// Validate required field
export const required = (value) => {
  if (!value && value !== 0) return 'This field is required';
  return '';
};

// Validate minimum length
export const minLength = (value, min) => {
  if (!value) return '';
  if (value.length < min) return `Must be at least ${min} characters`;
  return '';
};

// Validate maximum length
export const maxLength = (value, max) => {
  if (!value) return '';
  if (value.length > max) return `Must be at most ${max} characters`;
  return '';
};

// Validate number
export const isNumber = (value) => {
  if (!value && value !== 0) return '';
  if (isNaN(Number(value))) return 'Must be a number';
  return '';
};

// Validate positive number
export const isPositive = (value) => {
  if (!value && value !== 0) return '';
  if (Number(value) <= 0) return 'Must be a positive number';
  return '';
};

// Validate date
export const isValidDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (date.toString() === 'Invalid Date') return 'Invalid date format';
  return '';
};

// Validate future date
export const isFutureDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) return 'Date must be in the future';
  return '';
};

// Validate form fields
export const validateForm = (values, validations) => {
  const errors = {};
  
  Object.keys(validations).forEach(field => {
    const value = values[field];
    const fieldValidations = validations[field];
    
    for (const validation of fieldValidations) {
      const error = validation(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};
