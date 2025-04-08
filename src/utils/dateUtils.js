import { format, parseISO, differenceInDays } from 'date-fns';

// Format date to display format
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return dateString;
  }
};

// Get days until expiry
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  try {
    const today = new Date();
    const expiry = parseISO(expiryDate);
    return differenceInDays(expiry, today);
  } catch (error) {
    return null;
  }
};

// Check if date is within range
export const isDateInRange = (dateString, startDate, endDate) => {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    const start = startDate ? parseISO(startDate) : new Date(0);
    const end = endDate ? parseISO(endDate) : new Date();
    
    return date >= start && date <= end;
  } catch (error) {
    return false;
  }
};

// Get current date in ISO format
export const getCurrentDateISO = () => {
  return new Date().toISOString().split('T')[0];
};

// Get month name from date
export const getMonthName = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMMM yyyy');
  } catch (error) {
    return '';
  }
};
