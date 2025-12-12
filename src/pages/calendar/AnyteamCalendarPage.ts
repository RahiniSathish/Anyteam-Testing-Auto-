import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Anyteam Calendar
 * Handles calendar elements within the Anyteam application
 */
export class AnyteamCalendarPage {
  readonly page: Page;

  // Calendar icon on home page
  readonly calendarIcon: Locator; // Calendar icon in home page sidebar or header

  // Meeting elements
  readonly meetingTitle: Locator;
  readonly meetingTimeSlot: Locator;
  readonly externalLinkIcon: Locator; // Icon to open meeting in Google Calendar
  readonly joinMeetButton: Locator; // Join button in Anyteam calendar

  constructor(page: Page) {
    this.page = page;

    // Calendar icon (scheduler) on home page - exact match: svg.lucide-calendar with size 24px
    // The icon is inside a button or clickable element
    this.calendarIcon = page.locator('svg.lucide-calendar[class*="size-[24px]"], button:has(svg.lucide-calendar), svg.lucide-calendar').first();

    // External link icon - exact match: svg.lucide-external-link with size 16px
    // This appears after clicking the calendar icon
    this.externalLinkIcon = page.locator('svg.lucide-external-link').first();

    // Meeting title - exact match: span.I0UMhf with text "Team Standup Meeting"
    // This is the created event that appears after clicking external link
    this.meetingTitle = page.locator('span.I0UMhf:has-text("Team Standup Meeting"), span:has-text("Team Standup Meeting")').first();

    // Meeting time slot (fallback selector)
    this.meetingTimeSlot = page.locator('p:has-text("14:00 - 15:00"), p:has-text("2:00pm - 3:00pm")').first();

    // Join Meet button in Anyteam calendar (after clicking meeting)
    this.joinMeetButton = page.locator('button:has-text("Join"), button:has-text("Join Meeting"), a:has-text("Join"), [aria-label*="Join" i]').first();
  }

  /**
   * Navigate to Anyteam home/calendar
   */
  async goto(): Promise<void> {
    await this.page.goto('/home');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  /**
   * Wait for calendar to load
   */
  async waitForCalendarLoad(): Promise<void> {
    await this.page.waitForTimeout(3000);
  }
}

