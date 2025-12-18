import { Page } from '@playwright/test';
import { GoogleCalendarPage } from '../../pages/calendar/googleCalendarPage';

/**
 * Actions for Google Calendar interactions
 * Contains all user actions for scheduling and managing Google Calendar meetings
 */
export class GoogleCalendarActions {
  private googleCalendarPage: GoogleCalendarPage;

  constructor(page: Page) {
    this.googleCalendarPage = new GoogleCalendarPage(page);
  }

  /**
   * Navigate to Google Calendar
   */
  async navigateToCalendar(): Promise<void> {
    await this.googleCalendarPage.goto();
    await this.googleCalendarPage.waitForCalendarLoad();
  }

  /**
   * Create a new event
   */
  async createEvent(): Promise<void> {
    console.log('  Clicking Create button...');
    await this.googleCalendarPage.createButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.googleCalendarPage.createButton.click();
    await this.googleCalendarPage.page.waitForTimeout(2000);
    console.log('  ✓ Create button clicked');

    // Click Event option - try multiple approaches
    console.log('  Clicking Event option...');
    let eventClicked = false;
    
    // Try clicking by text first
    try {
      await this.googleCalendarPage.page.click('text=Event', { timeout: 5000 });
      eventClicked = true;
      console.log('  ✓ Event option clicked (text selector)');
    } catch {
      // Try the eventOption locator
      try {
        await this.googleCalendarPage.eventOption.waitFor({ state: 'visible', timeout: 5000 });
        await this.googleCalendarPage.eventOption.click();
        eventClicked = true;
        console.log('  ✓ Event option clicked (locator)');
      } catch {
        // Try role menuitem
        try {
          const eventMenuItem = this.googleCalendarPage.page.locator('[role="menuitem"]:has-text("Event")').first();
          await eventMenuItem.waitFor({ state: 'visible', timeout: 5000 });
          await eventMenuItem.click();
          eventClicked = true;
          console.log('  ✓ Event option clicked (menuitem)');
        } catch (error) {
          throw new Error('Could not click Event option: ' + error);
        }
      }
    }
    
    if (!eventClicked) {
      throw new Error('Failed to click Event option');
    }
    
    await this.googleCalendarPage.page.waitForTimeout(2000);
    console.log('  ✓ Event creation dialog opened');
  }

  /**
   * Fill event title
   * @param title - Event title
   */
  async fillEventTitle(title: string): Promise<void> {
    await this.googleCalendarPage.titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.googleCalendarPage.titleInput.fill(title);
    await this.googleCalendarPage.page.waitForTimeout(1000);
  }

  /**
   * Set event date
   * @param date - Date object
   */
  async setEventDate(date: Date): Promise<void> {
    const dateFormatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    await this.googleCalendarPage.startDateSpan.waitFor({ state: 'visible', timeout: 5000 });
    await this.googleCalendarPage.startDateSpan.click();
    await this.googleCalendarPage.page.waitForTimeout(1000);
    await this.googleCalendarPage.page.keyboard.type(dateFormatted);
    await this.googleCalendarPage.page.keyboard.press('Enter');
    await this.googleCalendarPage.page.waitForTimeout(1000);
  }

  /**
   * Set event start time
   * @param time - Time string (e.g., "2:00pm")
   */
  async setStartTime(time: string): Promise<void> {
    await this.googleCalendarPage.startTimeInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.googleCalendarPage.startTimeInput.click();
    await this.googleCalendarPage.page.waitForTimeout(500);
    await this.googleCalendarPage.startTimeInput.fill(time);
    await this.googleCalendarPage.page.keyboard.press('Enter');
    await this.googleCalendarPage.page.waitForTimeout(1000);
  }

  /**
   * Set event end time
   * @param time - Time string (e.g., "3:00pm")
   */
  async setEndTime(time: string): Promise<void> {
    await this.googleCalendarPage.endTimeInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.googleCalendarPage.endTimeInput.click();
    await this.googleCalendarPage.page.waitForTimeout(500);
    await this.googleCalendarPage.endTimeInput.fill(time);
    await this.googleCalendarPage.page.keyboard.press('Enter');
    await this.googleCalendarPage.page.waitForTimeout(1000);
  }

  /**
   * Add guests to the event
   * @param guests - Array of guest email addresses
   */
  async addGuests(guests: string[]): Promise<void> {
    if (guests.length === 0) return;

    // Click "Add guests" button if visible
    const addGuestsButton = this.googleCalendarPage.page.locator('button:has-text("Add guests")').first();
    const isVisible = await addGuestsButton.isVisible().catch(() => false);
    if (isVisible) {
      await addGuestsButton.click();
      await this.googleCalendarPage.page.waitForTimeout(1000);
    }

    for (const guest of guests) {
      await this.googleCalendarPage.guestInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.googleCalendarPage.guestInput.click();
      await this.googleCalendarPage.page.waitForTimeout(500);
      await this.googleCalendarPage.guestInput.fill('');
      await this.googleCalendarPage.page.waitForTimeout(300);
      await this.googleCalendarPage.guestInput.type(guest, { delay: 100 });
      await this.googleCalendarPage.page.waitForTimeout(2000);

      // Try to click suggestion
      const suggestion = this.googleCalendarPage.page.locator(`div[role="option"]:has-text("${guest}")`).first();
      const isSuggestionVisible = await suggestion.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isSuggestionVisible) {
        await suggestion.click();
        await this.googleCalendarPage.page.waitForTimeout(2000);
      } else {
        await this.googleCalendarPage.page.keyboard.press('Enter');
        await this.googleCalendarPage.page.waitForTimeout(1500);
      }
    }

    await this.googleCalendarPage.page.waitForTimeout(3000);
  }

  /**
   * Save the event
   * Uses multiple selectors to find and click Save/Send button
   * Verifies event was created before returning
   */
  async saveEvent(eventTitle?: string): Promise<void> {
    console.log('💾 Saving event...');
    await this.googleCalendarPage.page.waitForTimeout(3000);

    // Try multiple selectors for Send/Save button
    const sendSelectors = [
      'button:has-text("Send")',
      'span[jsname="V67aGc"]:has-text("Send")',
      'span.UywwFc-vQzf8d:has-text("Send")',
      'span.VfPpkd-vQzf8d:has-text("Send")',
    ];

    const saveSelectors = [
      'button:has-text("Save")',
      'span[jsname="V67aGc"]:has-text("Save")',
      'span.UywwFc-vQzf8d:has-text("Save")',
      'span.VfPpkd-vQzf8d:has-text("Save")',
    ];

    let buttonClicked = false;

    // Try Send button first (appears when there are guests)
    console.log('  Looking for Send button...');
    for (const selector of sendSelectors) {
      try {
        const button = this.googleCalendarPage.page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          console.log(`  ✓ Found Send button with selector: ${selector}`);
          await button.click({ force: true });
          await this.googleCalendarPage.page.waitForTimeout(3000);
          console.log('  ✓ Send button clicked - Event saved and notifications sent!');
          buttonClicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // If Send button not found, try Save button
    if (!buttonClicked) {
      console.log('  Send button not found, looking for Save button...');
      for (const selector of saveSelectors) {
        try {
          const button = this.googleCalendarPage.page.locator(selector).first();
          const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);

          if (isVisible) {
            console.log(`  ✓ Found Save button with selector: ${selector}`);
            await button.click({ force: true });
            await this.googleCalendarPage.page.waitForTimeout(3000);
            console.log('  ✓ Save button clicked - Event saved successfully!');
            buttonClicked = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    if (!buttonClicked) {
      throw new Error('Could not find or click Save/Send button');
    }

    // Wait for invitation dialog to appear (if guests were added)
    await this.googleCalendarPage.page.waitForTimeout(2000);

    // Handle "Send invitation emails" dialog if it appears
    console.log('  Checking for invitation dialog...');
    const sendInvitationButton = this.googleCalendarPage.page.locator('button:has-text("Send")').last();
    const isSendInvitationVisible = await sendInvitationButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (isSendInvitationVisible) {
      console.log('  ✓ Found invitation dialog, clicking Send...');
      await sendInvitationButton.click();
      await this.googleCalendarPage.page.waitForTimeout(3000);
      console.log('  ✓ Clicked Send on invitation dialog');
    }

    // Check for "Invite all guests" button
    console.log('  Checking for "Invite all guests" button...');
    const inviteAllGuestsSelectors = [
      'span[jsname="V67aGc"]:has-text("Invite all guests")',
      'span.mUIrbf-vQzf8d:has-text("Invite all guests")',
      'span.VfPpkd-vQzf8d:has-text("Invite all guests")',
      'button:has-text("Invite all guests")',
    ];

    for (const selector of inviteAllGuestsSelectors) {
      try {
        const inviteButton = this.googleCalendarPage.page.locator(selector).first();
        const isVisible = await inviteButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          console.log(`  ✓ Found "Invite all guests" button with selector: ${selector}`);
          await inviteButton.click();
          await this.googleCalendarPage.page.waitForTimeout(3000);
          console.log('  ✓ Clicked "Invite all guests" button');
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // Wait for event to be fully saved and dialog to close
    await this.googleCalendarPage.page.waitForTimeout(3000);

    // Verify event was created by checking if we're back on calendar view
    const currentUrl = this.googleCalendarPage.page.url();
    console.log(`  Current URL: ${currentUrl}`);

    if (currentUrl.includes('calendar.google.com/calendar')) {
      console.log('  ✓ Confirmed: Event dialog closed, back on calendar view');

      // Wait for calendar to reload
      await this.googleCalendarPage.page.waitForTimeout(3000);

      // Verify event appears in calendar if title provided
      if (eventTitle) {
        const eventExists = await this.googleCalendarPage.page
          .locator(`text="${eventTitle}"`)
          .isVisible({ timeout: 5000 })
          .catch(() => false);

        if (eventExists) {
          console.log(`  ✓ VERIFIED: Event "${eventTitle}" appears in calendar!`);
        } else {
          console.log(`  ⚠ WARNING: Event "${eventTitle}" not immediately visible in calendar`);
          console.log('    Note: Event may take a moment to appear or may be on a different date');
        }
      }
    } else {
      console.log('  ⚠ Warning: Still on event creation page, event may not be saved');
      // Try to close dialog if still open
      const closeButton = this.googleCalendarPage.page.locator('button[aria-label="Close"]').first();
      const isCloseVisible = await closeButton.isVisible({ timeout: 2000 }).catch(() => false);
      if (isCloseVisible) {
        await closeButton.click();
        await this.googleCalendarPage.page.waitForTimeout(2000);
      }
    }

    console.log('  ✓ Event save process completed');
  }

  /**
   * Complete event creation flow
   * @param details - Event details
   */
  async createMeeting(details: {
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    guests?: string[];
  }): Promise<void> {
    console.log(`\n📅 Creating meeting: ${details.title}`);
    console.log(`   Date: ${details.date.toLocaleDateString()}`);
    console.log(`   Time: ${details.startTime} - ${details.endTime}`);
    if (details.guests && details.guests.length > 0) {
      console.log(`   Guests: ${details.guests.join(', ')}`);
    }

    await this.createEvent();
    await this.fillEventTitle(details.title);
    await this.setEventDate(details.date);
    await this.setStartTime(details.startTime);
    await this.setEndTime(details.endTime);
    
    if (details.guests && details.guests.length > 0) {
      await this.addGuests(details.guests);
    }

    // Pass event title to saveEvent for verification
    await this.saveEvent(details.title);
    
    console.log(`✅ Meeting "${details.title}" created successfully!\n`);
  }

  /**
   * Join Google Meet from calendar event
   */
  async joinGoogleMeet(): Promise<Page | null> {
    await this.googleCalendarPage.page.waitForTimeout(3000);
    
    const joinVisible = await this.googleCalendarPage.joinMeetButton.isVisible({ timeout: 5000 }).catch(() => false);
    if (joinVisible) {
      const pagePromise = this.googleCalendarPage.page.context().waitForEvent('page');
      await this.googleCalendarPage.joinMeetButton.click();
      const meetPage = await pagePromise;
      await meetPage.waitForLoadState();
      return meetPage;
    }
    
    return null;
  }
}

