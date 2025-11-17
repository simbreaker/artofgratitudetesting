import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { DashboardPageLocators } from '../locators/DashboardPageLocators';

/**
 * Page object representing the authenticated dashboard.
 */
export class DashboardPage extends BasePage {
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole('heading', {
      name: DashboardPageLocators.welcomeHeading,
    });
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


