import { Page } from '@playwright/test';

/**
 * Helper utilities for test automation
 */
export class Helpers {
  /**
   * Wait for element to be visible with timeout
   */
  static async waitForElement(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }

  /**
   * Wait for network to be idle
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Check if element exists (doesn't throw if not found)
   */
  static async elementExists(page: Page, selector: string): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text safely
   */
  static async getElementText(page: Page, selector: string): Promise<string | null> {
    try {
      const element = await page.locator(selector).first();
      return await element.textContent();
    } catch {
      return null;
    }
  }
}

