import { Page, Locator } from '@playwright/test';

/**
 * Base Page class that all page objects will extend
 * Contains common methods and utilities
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Helper method to initialize locators from multiple locator objects
   * Useful when a page needs locators from multiple sources
   * 
   * @param locatorObjects - Multiple locator objects to merge
   * @returns Combined object with Locator instances
   * 
   * @example
   * const locators = this.initMultipleLocators(HomePageLocators, LoginPageLocators);
   * this.header = locators.header; // from HomePageLocators
   * this.usernameInput = locators.usernameInput; // from LoginPageLocators
   */
  protected initMultipleLocators<T1 extends Record<string, string | ((...args: any[]) => string)>, T2 extends Record<string, string | ((...args: any[]) => string)>>(
    locatorsObject1: T1,
    locatorsObject2: T2
  ): { [K in keyof (T1 & T2)]: (T1 & T2)[K] extends string ? Locator : (T1 & T2)[K] } {
    const merged: any = {};
    
    // Merge all locator objects
    for (const locatorsObject of [locatorsObject1, locatorsObject2]) {
      for (const [key, value] of Object.entries(locatorsObject)) {
        // Skip function-based locators and avoid overwriting existing keys
        if (typeof value === 'function' || merged[key]) {
          continue;
        }
        merged[key] = this.page.locator(value as string);
      }
    }
    
    return merged;
  }

  /**
   * Helper method to initialize locators from a locators object
   * This reduces boilerplate in page object constructors
   * 
   * @param locatorsObject - Object containing locator strings/selectors
   * @returns Object with Locator instances mapped to the same keys
   * 
   * @example
   * const locators = this.initLocators(HomePageLocators);
   * this.header = locators.header;
   */
  protected initLocators<T extends Record<string, string | ((...args: any[]) => string)>>(
    locatorsObject: T
  ): { [K in keyof T]: T[K] extends string ? Locator : T[K] } {
    const result: any = {};
    
    for (const [key, value] of Object.entries(locatorsObject)) {
      // Skip function-based locators (they need parameters)
      if (typeof value === 'function') {
        continue;
      }
      result[key] = this.page.locator(value as string);
    }
    
    return result;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for page to load
   */
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Click on an element
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill an input field
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Get text content of an element
   */
  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }
}

