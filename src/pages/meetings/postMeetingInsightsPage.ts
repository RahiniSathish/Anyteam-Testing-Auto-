import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Post Meeting Insights Page
 * Handles post-meeting insights, analytics, and summaries
 */
export class PostMeetingInsightsPage {
  readonly page: Page;

  // Insights elements
  readonly insightsTitle: Locator;
  readonly meetingSummary: Locator;
  readonly keyPoints: Locator;
  readonly actionItems: Locator;
  readonly participantsList: Locator;
  readonly meetingDuration: Locator;
  readonly downloadReportButton: Locator;
  readonly shareInsightsButton: Locator;
  readonly viewDetailsButton: Locator;
  readonly closeInsightsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Insights title
    this.insightsTitle = page.locator('h1:has-text("Insights"), h2:has-text("Insights"), [data-testid="insights-title"]').first();

    // Meeting summary section
    this.meetingSummary = page.locator('[data-testid="meeting-summary"], [class*="summary"], [class*="meeting-summary"]').first();

    // Key points section
    this.keyPoints = page.locator('[data-testid="key-points"], [class*="key-points"], ul:has-text("Key Points")').first();

    // Action items section
    this.actionItems = page.locator('[data-testid="action-items"], [class*="action-items"], ul:has-text("Action Items")').first();

    // Participants list
    this.participantsList = page.locator('[data-testid="participants"], [class*="participants-list"], ul:has-text("Participants")').first();

    // Meeting duration
    this.meetingDuration = page.locator('[data-testid="duration"], [class*="duration"], span:has-text("min")').first();

    // Download report button
    this.downloadReportButton = page.locator('button:has-text("Download"), button:has-text("Download Report"), button[aria-label*="download" i]').first();

    // Share insights button
    this.shareInsightsButton = page.locator('button:has-text("Share"), button:has-text("Share Insights"), button[aria-label*="share" i]').first();

    // View details button
    this.viewDetailsButton = page.locator('button:has-text("View Details"), button:has-text("See More"), a:has-text("View Details")').first();

    // Close insights button
    this.closeInsightsButton = page.locator('button[aria-label*="close" i], button:has(svg[class*="x"]), button:has(svg[class*="close"])').first();
  }

  /**
   * Wait for insights page to load
   */
  async waitForInsightsLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if insights are visible
   */
  async isInsightsVisible(): Promise<boolean> {
    try {
      return await this.insightsTitle.isVisible({ timeout: 5000 }).catch(() => false);
    } catch {
      return false;
    }
  }
}

