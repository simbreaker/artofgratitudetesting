/**
 * Locators for the dashboard page.
 */
export const DashboardPageLocators = {
  welcomeHeading: /Welcome to Your Gratitude Dashboard/i,
  searchInput: '[placeholder="Search supporters by name or email"]',
  searchButton: 'button[type="submit"]',
  editButton: '//button[text()="Edit"]',
  deleteButton: '//button[text()="Delete Supporter"]',
  deleteConfirmButton: 'button:has-text("OK")',
  deleteCancelButton: 'button:has-text("Cancel")',
  deleteModal: '[role="dialog"]',
} as const;


