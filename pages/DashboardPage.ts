import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { DashboardPageLocators } from '../locators/DashboardPageLocators';

/**
 * Page object representing the authenticated dashboard.
 */
export class DashboardPage extends BasePage {
  readonly welcomeHeading: Locator;
  readonly searchInput: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole('heading', {
      name: DashboardPageLocators.welcomeHeading,
    });
    this.searchInput = page.locator(DashboardPageLocators.searchInput);
    this.editButton = page.locator(DashboardPageLocators.editButton);
    this.deleteButton = page.locator(DashboardPageLocators.deleteButton);
  }

  /**
   * Search for a supporter by name or email.
   */
  async searchForSupporter(nameOrEmail: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(nameOrEmail);
  }

  /**
   * Edit a supporter.
   */
  async editSupporter(): Promise<void> {
    await this.editButton.first().click();
  }

  /**
   * Delete a supporter with native browser alert/confirm dialog handling.
   * 
   * @param confirm - Whether to confirm (true) or cancel (false) the deletion. Default: true
   * @returns The alert/confirm dialog message text
   */
  async deleteSupporter(confirm: boolean = true): Promise<void> {
    await this.deleteButton.waitFor({ state: 'visible' });
    await this.deleteButton.scrollIntoViewIfNeeded();
    await this.deleteButton.click();
  }


  /**
   * Assert the dashboard welcome heading is visible.
   */
  async expectWelcomeHeadingVisible(): Promise<void> {
    await this.welcomeHeading.waitFor({ state: 'visible' });
  }

  /**
   * Check whether the dashboard is loaded.
  */
  async isLoaded(): Promise<boolean> {
    return this.welcomeHeading.isVisible();
  }
}


