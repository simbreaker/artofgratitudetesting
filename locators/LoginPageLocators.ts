/**
 * Locators for the login page.
 * Regex values are used with Playwright's role/label queries for resilience.
 */
export const LoginPageLocators = {
  emailLabel: /Email Address/i,
  passwordLabel: /Password/i,
  signInButtonName: /Sign In to Dashboard/i,
  dashboardHeading: /Welcome to Your Gratitude Dashboard/i,
} as const;


