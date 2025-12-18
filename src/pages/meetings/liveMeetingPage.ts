import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Live Meeting Page
 * Handles live meeting elements and interactions
 */
export class LiveMeetingPage {
  readonly page: Page;

  // Live meeting controls
  readonly muteButton: Locator;
  readonly videoButton: Locator;
  readonly shareScreenButton: Locator;
  readonly chatButton: Locator;
  readonly participantsButton: Locator;
  readonly leaveButton: Locator;
  readonly endMeetingButton: Locator;
  readonly meetingTimer: Locator;
  readonly meetingTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Mute/Unmute button
    this.muteButton = page.locator('button[aria-label*="microphone" i], button[aria-label*="mute" i], button:has(svg[class*="mic"])').first();

    // Video on/off button
    this.videoButton = page.locator('button[aria-label*="camera" i], button[aria-label*="video" i], button:has(svg[class*="video"])').first();

    // Share screen button
    this.shareScreenButton = page.locator('button[aria-label*="screen" i], button[aria-label*="share" i], button:has(svg[class*="screen"])').first();

    // Chat button
    this.chatButton = page.locator('button[aria-label*="chat" i], button:has(svg[class*="message"])').first();

    // Participants button
    this.participantsButton = page.locator('button[aria-label*="participant" i], button:has(svg[class*="user"])').first();

    // Leave meeting button
    this.leaveButton = page.locator('button:has-text("Leave"), button:has-text("Leave meeting"), button[aria-label*="leave" i]').first();

    // End meeting button
    this.endMeetingButton = page.locator('button:has-text("End"), button:has-text("End meeting"), button[aria-label*="end" i]').first();

    // Meeting timer
    this.meetingTimer = page.locator('[data-testid="meeting-timer"], [class*="timer"], span:has-text(":")').first();

    // Meeting title in live view
    this.meetingTitle = page.locator('h1, h2, [data-testid="meeting-title"], [class*="meeting-title"]').first();
  }

  /**
   * Wait for live meeting to load
   */
  async waitForMeetingLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await this.page.waitForTimeout(3000);
  }

  /**
   * Check if meeting is active
   */
  async isMeetingActive(): Promise<boolean> {
    try {
      return await this.meetingTimer.isVisible({ timeout: 5000 }).catch(() => false);
    } catch {
      return false;
    }
  }
}

