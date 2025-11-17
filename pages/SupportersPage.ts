import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SupportersLocators } from '../locators/SupportersLocators';

export type SupporterFormData = {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  giftTier: string;
};

/**
 * Page object encapsulating supporter management flows.
 */
export class SupportersPage extends BasePage {
  private readonly supportersLink: Locator;
  private readonly addSupporterButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly emailInput: Locator;
  private readonly donorCheckbox: Locator;
  private readonly giftTierCombobox: Locator;
  private readonly giftTierSelect: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.supportersLink = page.getByRole('link', { name: SupportersLocators.supportersNav });
    this.addSupporterButton = page.getByRole('button', { name: SupportersLocators.addSupporterButton });
    this.firstNameInput = page.getByLabel(SupportersLocators.firstNameLabel);
    this.lastNameInput = page.getByLabel(SupportersLocators.lastNameLabel);
    this.addressInput = page.locator(SupportersLocators.addressLabel);
    this.emailInput = page.getByLabel(SupportersLocators.emailLabel);
    this.donorCheckbox = page.locator(SupportersLocators.SupporterType);
    this.giftTierCombobox = page.locator(SupportersLocators.giftTierCombobox);
    this.giftTierSelect = page.locator(SupportersLocators.giftTierSelect);
    this.submitButton = page.getByRole('button', { name: SupportersLocators.submitButton });
  }

  /**
   * Opens the supporters page via the navigation link.
   */
  async openFromNavigation(): Promise<void> {
    await this.supportersLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Opens the modal to add a supporter.
   */
  async openAddSupporterModal(): Promise<void> {
    await this.addSupporterButton.click();
    // Wait for modal/form to be visible and ready
    await this.firstNameInput.waitFor({ state: 'visible' });
    // Wait for any async form initialization
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Adds a supporter using the provided data.
   */
  async addSupporter(data: SupporterFormData): Promise<void> {
    await this.openAddSupporterModal();
    await this.fillSupporterForm(data);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify the supporter is visible in the supporters list.
   */
  async expectSupporterInList(data: SupporterFormData): Promise<void> {
    const { firstName, lastName, email } = data;
    await expect(this.page.getByText(new RegExp(`${firstName}\\s+${lastName}`, 'i'))).toBeVisible();
    await expect(this.page.getByText(email)).toBeVisible();
  }

  private async fillSupporterForm(data: SupporterFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.page.waitForTimeout(1000);
    try {
      await this.page.locator(SupportersLocators.addressSuggestion).click();
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.log('Address suggestions did not appear or could not be clicked, continuing without selection:', error);
    }

    await this.emailInput.fill(data.email);
    await this.donorCheckbox.first().check();
    
    // Wait for form to stabilize and ensure gift tier combobox is ready
    await this.page.waitForLoadState('networkidle');
    
    // Additional wait to ensure combobox is fully loaded
    await this.giftTierCombobox.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.selectGiftTier(data.giftTier);
  }

  private async selectGiftTier(giftTier: string): Promise<void> {
    // Wait for combobox to be ready
    await this.giftTierCombobox.waitFor({ state: 'visible', timeout: 10000 });
    await this.giftTierCombobox.scrollIntoViewIfNeeded();
    
    // Wait for the hidden select element to be attached (it should already be in DOM)
    await this.giftTierSelect.waitFor({ state: 'attached', timeout: 10000 });
    
    // Map gift tier name to option value
    const optionValueMap: Record<string, string> = {
      'Oak': 'Oak',
      'Bloom': 'Bloom',
      'Seed': 'Seed'
    };
    
    const optionValue = optionValueMap[giftTier] || giftTier;
    
    // Use selectOption on the hidden select element (works even when hidden)
    await this.giftTierSelect.selectOption({ value: optionValue });
    
    // Wait for selection to be applied
    await this.page.waitForTimeout(500);
  }

}


