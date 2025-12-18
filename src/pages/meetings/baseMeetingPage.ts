import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Base Meeting Page
 * Handles common meeting elements and interactions
 */
export class BaseMeetingPage {
  readonly page: Page;

  // Common meeting elements
  readonly meetingTitle: Locator;
  readonly meetingDate: Locator;
  readonly meetingTime: Locator;
  readonly meetingParticipants: Locator;
  readonly meetingDescription: Locator;
  readonly joinButton: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Meeting title input/display
    this.meetingTitle = page.locator('input[name="title"], input[placeholder*="title" i], [data-testid="meeting-title"]').first();

    // Meeting date picker/display
    this.meetingDate = page.locator('input[type="date"], input[placeholder*="date" i], [data-testid="meeting-date"]').first();

    // Meeting time picker/display
    this.meetingTime = page.locator('input[type="time"], input[placeholder*="time" i], [data-testid="meeting-time"]').first();

    // Meeting participants
    this.meetingParticipants = page.locator('input[placeholder*="participant" i], input[placeholder*="guest" i], [data-testid="meeting-participants"]').first();

    // Meeting description
    this.meetingDescription = page.locator('textarea[placeholder*="description" i], textarea[name="description"], [data-testid="meeting-description"]').first();

    // Join button
    this.joinButton = page.locator('button:has-text("Join"), button:has-text("Join Meeting"), a:has-text("Join")').first();

    // Cancel button
    this.cancelButton = page.locator('button:has-text("Cancel"), button[aria-label*="cancel" i]').first();

    // Save button
    this.saveButton = page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
  }

  /**
   * Navigate to base meeting page
   */
  async goto(): Promise<void> {
    await this.page.goto('/home');
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  }

  /**
   * Wait for meeting page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }
}

