import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Live Meeting Guidance Page
 * Handles meeting guidance and tips during live meetings
 */
export class LiveMeetingGuidancePage {
  readonly page: Page;

  // Guidance elements
  readonly guidancePanel: Locator;
  readonly guidanceTitle: Locator;
  readonly guidanceContent: Locator;
  readonly closeGuidanceButton: Locator;
  readonly nextTipButton: Locator;
  readonly previousTipButton: Locator;
  readonly skipGuidanceButton: Locator;
  readonly guidanceIndicator: Locator;

  constructor(page: Page) {
    this.page = page;

    // Guidance panel container
    this.guidancePanel = page.locator('[data-testid="guidance-panel"], [class*="guidance"], [class*="tip-panel"]').first();

    // Guidance title
    this.guidanceTitle = page.locator('[data-testid="guidance-title"], h3:has-text("Tip"), h3:has-text("Guidance")').first();

    // Guidance content/text
    this.guidanceContent = page.locator('[data-testid="guidance-content"], [class*="guidance-text"], [class*="tip-content"]').first();

    // Close guidance button
    this.closeGuidanceButton = page.locator('button[aria-label*="close" i], button:has(svg[class*="x"]), button:has(svg[class*="close"])').first();

    // Next tip button
    this.nextTipButton = page.locator('button:has-text("Next"), button[aria-label*="next" i], button:has(svg[class*="chevron-right"])').first();

    // Previous tip button
    this.previousTipButton = page.locator('button:has-text("Previous"), button[aria-label*="previous" i], button:has(svg[class*="chevron-left"])').first();

    // Skip guidance button
    this.skipGuidanceButton = page.locator('button:has-text("Skip"), button:has-text("Skip tips"), button[aria-label*="skip" i]').first();

    // Guidance indicator (e.g., "Tip 1 of 5")
    this.guidanceIndicator = page.locator('[data-testid="guidance-indicator"], [class*="tip-indicator"], span:has-text("of")').first();
  }

  /**
   * Wait for guidance panel to appear
   */
  async waitForGuidancePanel(): Promise<void> {
    await this.guidancePanel.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  /**
   * Check if guidance panel is visible
   */
  async isGuidanceVisible(): Promise<boolean> {
    try {
      return await this.guidancePanel.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      return false;
    }
  }

  /**
   * Close guidance panel
   */
  async closeGuidance(): Promise<void> {
    if (await this.isGuidanceVisible()) {
      await this.closeGuidanceButton.click({ timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }
}

