import { Page } from '@playwright/test';
import { LiveMeetingGuidancePage } from '../../pages/meetings/liveMeetingGuidancePage';

/**
 * Actions for Live Meeting Guidance interactions
 * Contains all user actions for meeting guidance and tips
 */
export class LiveMeetingGuidanceActions {
  private liveMeetingGuidancePage: LiveMeetingGuidancePage;

  constructor(page: Page) {
    this.liveMeetingGuidancePage = new LiveMeetingGuidancePage(page);
  }

  /**
   * Wait for guidance panel to appear
   */
  async waitForGuidancePanel(): Promise<void> {
    await this.liveMeetingGuidancePage.waitForGuidancePanel();
  }

  /**
   * Verify guidance is visible
   */
  async verifyGuidanceVisible(): Promise<boolean> {
    return await this.liveMeetingGuidancePage.isGuidanceVisible();
  }

  /**
   * Click next tip button
   */
  async clickNextTip(): Promise<void> {
    await this.liveMeetingGuidancePage.nextTipButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingGuidancePage.nextTipButton.click();
    await this.liveMeetingGuidancePage.page.waitForTimeout(500);
  }

  /**
   * Click previous tip button
   */
  async clickPreviousTip(): Promise<void> {
    await this.liveMeetingGuidancePage.previousTipButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingGuidancePage.previousTipButton.click();
    await this.liveMeetingGuidancePage.page.waitForTimeout(500);
  }

  /**
   * Click skip guidance button
   */
  async clickSkipGuidance(): Promise<void> {
    await this.liveMeetingGuidancePage.skipGuidanceButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingGuidancePage.skipGuidanceButton.click();
  }

  /**
   * Close guidance panel
   */
  async closeGuidance(): Promise<void> {
    await this.liveMeetingGuidancePage.closeGuidance();
  }

  /**
   * Verify guidance title is visible
   */
  async verifyGuidanceTitleVisible(): Promise<boolean> {
    return await this.liveMeetingGuidancePage.guidanceTitle.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Verify guidance content is visible
   */
  async verifyGuidanceContentVisible(): Promise<boolean> {
    return await this.liveMeetingGuidancePage.guidanceContent.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Get guidance text
   */
  async getGuidanceText(): Promise<string | null> {
    try {
      return await this.liveMeetingGuidancePage.guidanceContent.textContent();
    } catch {
      return null;
    }
  }
}

