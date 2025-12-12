import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Google Calendar
 * Handles Google Calendar page elements and interactions
 */
export class GoogleCalendarPage {
  readonly page: Page;

  // Navigation elements
  readonly createButton: Locator;
  readonly eventOption: Locator;

  // Event creation form elements
  readonly titleInput: Locator;
  readonly startDateSpan: Locator;
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;
  readonly guestInput: Locator;
  readonly guestSuggestion: Locator;

  // Action buttons
  readonly saveButton: Locator;
  readonly sendButton: Locator;
  readonly inviteAllGuestsButton: Locator;

  // Meeting elements
  readonly joinMeetButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Create button - try multiple selectors
    this.createButton = page.locator('button[jsname="todz4c"]:has-text("Create"), button:has-text("Create"), button:has-text("+ Create")').first();

    // Event option in dropdown
    this.eventOption = page.locator('[role="menuitem"]:has-text("Event"), text=Event').first();

    // Event form elements
    this.titleInput = page.locator('input[aria-label="Add title"]');
    this.startDateSpan = page.locator('span[data-key="startDate"]');
    this.startTimeInput = page.locator('input[aria-label="Start time"]');
    this.endTimeInput = page.locator('input[aria-label="End time"]');
    this.guestInput = page.locator('input[aria-label="Guests"]');
    this.guestSuggestion = page.locator('div[role="option"]');

    // Action buttons
    this.saveButton = page.locator('button:has-text("Save"), span[jsname="V67aGc"]:has-text("Save")').first();
    this.sendButton = page.locator('button:has-text("Send"), span[jsname="V67aGc"]:has-text("Send")').first();
    this.inviteAllGuestsButton = page.locator('span[jsname="V67aGc"]:has-text("Invite all guests"), button:has-text("Invite all guests")').first();

    // Join Meet button
    this.joinMeetButton = page.locator('button:has-text("Join with Google Meet"), a:has-text("Join with Google Meet")').first();
  }

  /**
   * Navigate to Google Calendar
   */
  async goto(): Promise<void> {
    await this.page.goto('https://calendar.google.com/calendar/u/0/r');
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(3000);
  }

  /**
   * Wait for calendar to load
   */
  async waitForCalendarLoad(): Promise<void> {
    await this.createButton.waitFor({ state: 'visible', timeout: 10000 });
  }
}

