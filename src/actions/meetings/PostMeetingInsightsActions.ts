import { Page } from '@playwright/test';
import { PostMeetingInsightsPage } from '../../pages/meetings/postMeetingInsightsPage';

/**
 * Actions for Post Meeting Insights interactions
 * Contains all user actions for post-meeting insights and analytics
 */
export class PostMeetingInsightsActions {
  private postMeetingInsightsPage: PostMeetingInsightsPage;

  constructor(page: Page) {
    this.postMeetingInsightsPage = new PostMeetingInsightsPage(page);
  }

  /**
   * Wait for insights page to load
   */
  async waitForInsightsLoad(): Promise<void> {
    await this.postMeetingInsightsPage.waitForInsightsLoad();
  }

  /**
   * Verify insights are visible
   */
  async verifyInsightsVisible(): Promise<boolean> {
    return await this.postMeetingInsightsPage.isInsightsVisible();
  }

  /**
   * Click download report button
   */
  async clickDownloadReport(): Promise<void> {
    await this.postMeetingInsightsPage.downloadReportButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.postMeetingInsightsPage.downloadReportButton.click();
  }

  /**
   * Click share insights button
   */
  async clickShareInsights(): Promise<void> {
    await this.postMeetingInsightsPage.shareInsightsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.postMeetingInsightsPage.shareInsightsButton.click();
  }

  /**
   * Click view details button
   */
  async clickViewDetails(): Promise<void> {
    await this.postMeetingInsightsPage.viewDetailsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.postMeetingInsightsPage.viewDetailsButton.click();
  }

  /**
   * Click close insights button
   */
  async clickCloseInsights(): Promise<void> {
    await this.postMeetingInsightsPage.closeInsightsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.postMeetingInsightsPage.closeInsightsButton.click();
  }

  /**
   * Verify meeting summary is visible
   */
  async verifyMeetingSummaryVisible(): Promise<boolean> {
    return await this.postMeetingInsightsPage.meetingSummary.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Verify key points are visible
   */
  async verifyKeyPointsVisible(): Promise<boolean> {
    return await this.postMeetingInsightsPage.keyPoints.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Verify action items are visible
   */
  async verifyActionItemsVisible(): Promise<boolean> {
    return await this.postMeetingInsightsPage.actionItems.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Get meeting summary text
   */
  async getMeetingSummary(): Promise<string | null> {
    try {
      return await this.postMeetingInsightsPage.meetingSummary.textContent();
    } catch {
      return null;
    }
  }
}

