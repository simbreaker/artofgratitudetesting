/**
 * Locators for the supporters workflow.
 */
export const SupportersLocators = {
  supportersNav: /Supporters/i,
  addSupporterButton: /Add Supporter/i,
  firstNameLabel: /First Name/i,
  lastNameLabel: /Last Name/i,
  addressLabel: '[placeholder="Enter complete shipping address for touchpoint delivery"]',
  addressSuggestion: 'div[data-state="open"] > div form > div:nth-child(3) > div > div > div',
  emailLabel: /Email Address/i,
  SupporterType: '//*[text()="Supporter Types * (select all that apply)"]/following::div[1]/label/span[text()="Donor"]',
  giftTierCombobox: '//label[@for="tier"]/following::button[1]',
  giftTierSelect: '//label[@for="tier"]/following::select[1]',
  submitButton: /^Add Supporter$/,
} as const;



