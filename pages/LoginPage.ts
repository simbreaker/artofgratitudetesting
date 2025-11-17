import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPageLocators } from '../locators/LoginPageLocators';

/**
 * Page object for Art of Gratitude login experience.
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel(LoginPageLocators.emailLabel);
    this.passwordInput = page.getByLabel(LoginPageLocators.passwordLabel);
    this.signInButton = page.getByRole('button', {
      name: LoginPageLocators.signInButtonName,
    });
  }

  /**
   * Navigate directly to the login page.
   */
  async navigate(baseUrl: string): Promise<void> {
    await this.goto(`${baseUrl}/auth`);
    await this.waitForLoadState('networkidle');
  }

  /**
   * Perform a login using the provided credentials.
   */
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submit();
  }

  /**
   * Enter only the email.
   */
  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Enter only the password.
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the sign-in button.
   */
  async submit(): Promise<void> {
    await this.signInButton.click();
  }
}


