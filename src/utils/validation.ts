/**
 * Input validation utilities
 */

export const validation = {
  /**
   * Validates email format (must contain @)
   */
  validateEmail: (email: string): boolean => {
    if (!email) return false;
    return email.includes('@') && email.includes('.');
  },

  /**
   * Validates phone number format
   * Allows: numbers, +, spaces, hyphens, parentheses
   * Minimum 7 digits required
   */
  validatePhone: (phone: string): boolean => {
    if (!phone?.trim()) return false; // Required field
    const phoneRegex = /^[\d+\s\-()]*$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  },

  /**
   * Validates document/ID number (only digits allowed)
   */
  validateDocumentNumber: (docNumber: string): boolean => {
    if (!docNumber?.trim()) return false; // Required field
    return /^\d+$/.test(docNumber);
  },

  /**
   * Sanitizes phone input to only allow valid characters
   */
  sanitizePhone: (value: string): string => {
    return value.replace(/[^0-9+\s\-()]/g, '');
  },

  /**
   * Sanitizes document number to only allow digits
   */
  sanitizeDocumentNumber: (value: string): string => {
    return value.replace(/\D/g, '');
  },

  /**
   * Sanitizes text input (removes leading/trailing spaces)
   */
  sanitizeText: (value: string): string => {
    return value.trim();
  },
};
