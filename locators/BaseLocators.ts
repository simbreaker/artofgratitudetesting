/**
 * Base Locators
 * Common locators that can be used across multiple pages
 */
export const BaseLocators = {
  // Common elements
  loadingSpinner: '[data-testid="loading"]',
  errorMessage: '[data-testid="error"]',
  successMessage: '[data-testid="success"]',
  
  // Common buttons
  submitButton: 'button[type="submit"]',
  cancelButton: 'button[type="button"]:has-text("Cancel")',
  closeButton: 'button[aria-label="Close"]',
  
  // Common modals
  modal: '[role="dialog"]',
  modalTitle: '[role="dialog"] h2',
  modalCloseButton: '[role="dialog"] button[aria-label="Close"]',
} as const;

