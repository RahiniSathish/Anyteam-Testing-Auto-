import { Page } from '@playwright/test';
import { AnyteamCalendarPage } from '../../pages/calendar/AnyteamCalendarPage';

/**
 * Actions for Anyteam Calendar interactions
 * Contains all user actions for finding and joining meetings from Anyteam
 */
export class AnyteamCalendarActions {
  private anyteamCalendarPage: AnyteamCalendarPage;

  constructor(page: Page) {
    this.anyteamCalendarPage = new AnyteamCalendarPage(page);
  }

  /**
   * Navigate to Anyteam home/calendar
   */
  async navigateToAnyteamCalendar(): Promise<void> {
    await this.anyteamCalendarPage.goto();
    await this.anyteamCalendarPage.waitForCalendarLoad();
  }

  /**
   * Click calendar icon on home page to open calendar view
   */
  async clickCalendarIcon(): Promise<void> {
    await this.anyteamCalendarPage.calendarIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.anyteamCalendarPage.calendarIcon.scrollIntoViewIfNeeded().catch(() => {});
    
    // Try normal click first, fallback to force click if intercepted
    try {
      await this.anyteamCalendarPage.calendarIcon.click({ timeout: 5000 });
    } catch (error) {
      await this.anyteamCalendarPage.calendarIcon.click({ force: true });
    }
    
    await this.anyteamCalendarPage.page.waitForTimeout(2000);
  }

  /**
   * Find and click a meeting by title
   * @param meetingTitle - Title of the meeting to find
   */
  async findAndClickMeeting(meetingTitle: string): Promise<void> {
    const meetingSelectors = [
      `text="${meetingTitle}"`,
      `span:has-text("${meetingTitle}")`,
      `span.capitalize:has-text("${meetingTitle}")`,
    ];

    let meetingFound = false;

    for (const selector of meetingSelectors) {
      try {
        const meeting = this.anyteamCalendarPage.page.locator(selector).first();
        const isVisible = await meeting.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          await meeting.click();
          await this.anyteamCalendarPage.page.waitForTimeout(2000);
          meetingFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!meetingFound) {
      throw new Error(`Could not find meeting with title: ${meetingTitle}`);
    }
  }

  /**
   * Find and click a meeting by time slot
   * @param timeSlot - Time slot string (e.g., "14:00 - 15:00")
   */
  async findAndClickMeetingByTime(timeSlot: string): Promise<void> {
    const timeElement = this.anyteamCalendarPage.page.locator(`p:has-text("${timeSlot}")`).first();
    const isTimeVisible = await timeElement.isVisible({ timeout: 2000 }).catch(() => false);

    if (isTimeVisible) {
      // Click the parent container
      const parentDiv = timeElement.locator('xpath=ancestor::div[@class="text-[#000000] py-3 pl-5"]').first();
      await parentDiv.click();
      await this.anyteamCalendarPage.page.waitForTimeout(2000);
    } else {
      throw new Error(`Could not find meeting with time slot: ${timeSlot}`);
    }
  }

  /**
   * Click external link icon to open meeting in Google Calendar
   */
  async clickExternalLinkToGoogleCalendar(): Promise<Page | null> {
    const isVisible = await this.anyteamCalendarPage.externalLinkIcon.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      const [newPage] = await Promise.all([
        this.anyteamCalendarPage.page.context().waitForEvent('page'),
        this.anyteamCalendarPage.externalLinkIcon.click()
      ]);

      await newPage.waitForLoadState();
      await newPage.waitForTimeout(3000);
      return newPage;
    }

    return null;
  }

  /**
   * Complete flow: Click calendar icon -> Click external link -> Click meeting
   * This follows the exact flow: Home page -> Calendar icon -> External link -> Event in Google Calendar
   * @param meetingTitle - Title of the meeting (e.g., "Team Standup Meeting")
   * @param timeSlot - Optional time slot as fallback
   */
  async openMeetingInGoogleCalendar(meetingTitle: string, timeSlot?: string): Promise<Page | null> {
    console.log(`  Step 1: Clicking calendar icon (scheduler) on home page...`);
    
    // Step 1: Click calendar icon (scheduler) on home page
    await this.clickCalendarIcon();
    console.log('  ✓ Calendar icon clicked');
    
    // Wait for calendar view to load
    await this.anyteamCalendarPage.page.waitForTimeout(2000);
    
    // Step 2: Click external link icon (this opens Google Calendar)
    console.log('  Step 2: Clicking external link icon to open Google Calendar...');
    await this.anyteamCalendarPage.externalLinkIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.anyteamCalendarPage.externalLinkIcon.scrollIntoViewIfNeeded().catch(() => {});
    
    // Wait for external link to be ready
    await this.anyteamCalendarPage.page.waitForTimeout(1000);
    
    // Click external link - this opens Google Calendar in a new tab or navigates
    let googleCalendarPage: Page | null = null;
    try {
      const [newPage] = await Promise.all([
        this.anyteamCalendarPage.page.context().waitForEvent('page', { timeout: 5000 }),
        this.anyteamCalendarPage.externalLinkIcon.click()
      ]);
      googleCalendarPage = newPage;
      await googleCalendarPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await googleCalendarPage.waitForTimeout(3000);
      console.log('  ✓ External link clicked - Google Calendar opened');
    } catch {
      // If no new page opened, the external link might have navigated the current page
      console.log('  External link may have navigated current page, checking URL...');
      await this.anyteamCalendarPage.page.waitForTimeout(3000);
      const currentUrl = this.anyteamCalendarPage.page.url();
      if (currentUrl.includes('calendar.google.com')) {
        googleCalendarPage = this.anyteamCalendarPage.page;
        console.log('  ✓ Navigated to Google Calendar');
      } else {
        throw new Error('Could not open Google Calendar via external link');
      }
    }
    
    if (!googleCalendarPage) {
      throw new Error('Google Calendar page not available');
    }
    
    // Step 3: Find and click the created event in Google Calendar
    console.log(`  Step 3: Finding and clicking event: "${meetingTitle}" in Google Calendar...`);
    
    // Wait for Google Calendar to fully load
    await googleCalendarPage.waitForTimeout(2000);
    
    // Try to find the meeting by the exact selector (span.I0UMhf)
    const meetingSelectors = [
      `span.I0UMhf:has-text("${meetingTitle}")`,
      `span.I0UMhf`,
      `span:has-text("${meetingTitle}")`,
      `text="${meetingTitle}"`,
      `[aria-label*="${meetingTitle}"]`,
    ];
    
    let meetingFound = false;
    let meetingElement = null;
    
    for (const selector of meetingSelectors) {
      try {
        meetingElement = googleCalendarPage.locator(selector).first();
        const isVisible = await meetingElement.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isVisible) {
          const text = await meetingElement.textContent();
          if (text && text.trim().includes(meetingTitle)) {
            console.log(`  ✓ Found meeting with selector: ${selector}`);
            meetingFound = true;
            break;
          }
        }
      } catch {
        continue;
      }
    }
    
    if (!meetingFound || !meetingElement) {
      throw new Error(`Could not find meeting "${meetingTitle}" in Google Calendar`);
    }
    
    // Click the meeting
    await meetingElement.scrollIntoViewIfNeeded().catch(() => {});
    await meetingElement.click();
    await googleCalendarPage.waitForTimeout(2000);
    console.log(`  ✓ Meeting "${meetingTitle}" clicked in Google Calendar`);
    
    // Return the Google Calendar page
    return googleCalendarPage;
  }

  /**
   * Find meeting in Anyteam calendar and join from Anyteam app
   * Flow: Home page -> Calendar icon -> External link -> Find meeting -> Join from Anyteam
   * @param meetingTitle - Title of the meeting (e.g., "Team Standup Meeting")
   * @param timeSlot - Optional time slot as fallback
   * @param meetingDate - Optional meeting date to navigate to correct date in calendar
   */
  async findAndJoinMeetingFromAnyteam(meetingTitle: string, timeSlot?: string, meetingDate?: Date): Promise<Page | null> {
    console.log(`  Step 1: Clicking calendar icon (scheduler) on home page...`);
    
    // Step 1: Click calendar icon (scheduler) on home page
    await this.clickCalendarIcon();
    console.log('  ✓ Calendar icon clicked');
    
    // Wait for calendar view to load
    await this.anyteamCalendarPage.page.waitForTimeout(2000);
    
    // Step 2: Click external link icon (opens Google Calendar or shows meeting details)
    console.log('  Step 2: Clicking external link icon...');
    await this.anyteamCalendarPage.externalLinkIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.anyteamCalendarPage.externalLinkIcon.scrollIntoViewIfNeeded().catch(() => {});
    
    // Wait for external link to be ready
    await this.anyteamCalendarPage.page.waitForTimeout(1000);
    
    // Click external link - this may open Google Calendar in a new tab
    let googleCalendarPage: Page | null = null;
    try {
      const [newPage] = await Promise.all([
        this.anyteamCalendarPage.page.context().waitForEvent('page', { timeout: 5000 }),
        this.anyteamCalendarPage.externalLinkIcon.click()
      ]);
      googleCalendarPage = newPage;
      await googleCalendarPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await googleCalendarPage.waitForTimeout(2000);
      console.log('  ✓ External link clicked - Google Calendar opened in new tab');
      
      // Switch back to Anyteam page to continue with joining
      await this.anyteamCalendarPage.page.bringToFront();
      await this.anyteamCalendarPage.page.waitForTimeout(1000);
    } catch {
      // If no new page opened, the external link might have navigated the current page
      console.log('  External link may have navigated current page, checking...');
      await this.anyteamCalendarPage.page.waitForTimeout(2000);
      const currentUrl = this.anyteamCalendarPage.page.url();
      if (currentUrl.includes('calendar.google.com')) {
        // Navigate back to Anyteam home
        await this.anyteamCalendarPage.page.goto('/home');
        await this.anyteamCalendarPage.page.waitForTimeout(2000);
        console.log('  ✓ Navigated back to Anyteam after viewing Google Calendar');
      } else {
        console.log('  ✓ External link clicked - staying on Anyteam page');
      }
    }
    
    // Step 3: Navigate to correct date if meeting date provided
    if (meetingDate) {
      const today = new Date();
      const isTomorrow = meetingDate.getDate() === today.getDate() + 1 && 
                         meetingDate.getMonth() === today.getMonth() &&
                         meetingDate.getFullYear() === today.getFullYear();
      
      if (isTomorrow) {
        console.log(`  Step 3a: Meeting is scheduled for tomorrow, navigating to correct date...`);
        // Try to find and click date navigation controls
        // This depends on the calendar UI - may need to click "Next" or specific date
        try {
          // Look for date navigation or tomorrow's date
          const tomorrowButton = this.anyteamCalendarPage.page.locator('button:has-text("Tomorrow"), button[aria-label*="Tomorrow" i]').first();
          const isTomorrowButtonVisible = await tomorrowButton.isVisible({ timeout: 3000 }).catch(() => false);
          
          if (isTomorrowButtonVisible) {
            await tomorrowButton.click();
            await this.anyteamCalendarPage.page.waitForTimeout(2000);
            console.log('  ✓ Navigated to tomorrow\'s date');
          } else {
            // Try clicking next day arrow
            const nextButton = this.anyteamCalendarPage.page.locator('button[aria-label*="Next" i], button:has(svg.lucide-chevron-right)').first();
            const isNextVisible = await nextButton.isVisible({ timeout: 3000 }).catch(() => false);
            if (isNextVisible) {
              await nextButton.click();
              await this.anyteamCalendarPage.page.waitForTimeout(2000);
              console.log('  ✓ Clicked next day button');
            }
          }
        } catch {
          console.log('  ⚠ Could not navigate to tomorrow, will search current view');
        }
      }
    }
    
    // Step 3b: Find the meeting in Anyteam calendar
    console.log(`  Step 3: Finding meeting "${meetingTitle}" in Anyteam calendar...`);
    
    // Wait longer for calendar to sync - meetings may take time to appear
    console.log('    Waiting for calendar to sync (meetings may take 30-60 seconds to appear)...');
    await this.anyteamCalendarPage.page.waitForTimeout(5000);
    
    // Try refreshing the calendar view if meeting not found initially
    let refreshAttempted = false;
    
    // Try to find the meeting by title
    const meetingSelectors = [
      `span:has-text("${meetingTitle}")`,
      `text="${meetingTitle}"`,
      `[aria-label*="${meetingTitle}"]`,
      `div:has-text("${meetingTitle}")`,
    ];
    
    let meetingFound = false;
    let meetingElement = null;
    
    for (const selector of meetingSelectors) {
      try {
        meetingElement = this.anyteamCalendarPage.page.locator(selector).first();
        const isVisible = await meetingElement.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isVisible) {
          const text = await meetingElement.textContent();
          if (text && text.trim().includes(meetingTitle)) {
            console.log(`  ✓ Found meeting with selector: ${selector}`);
            meetingFound = true;
            break;
          }
        }
      } catch {
        continue;
      }
    }
    
    // If not found by title, try by time slot
    if (!meetingFound && timeSlot) {
      console.log(`  Trying to find meeting by time slot: ${timeSlot}...`);
      try {
        const timeElement = this.anyteamCalendarPage.page.locator(`p:has-text("${timeSlot}")`).first();
        const isTimeVisible = await timeElement.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isTimeVisible) {
          meetingElement = timeElement.locator('xpath=ancestor::div').first();
          meetingFound = true;
          console.log('  ✓ Found meeting by time slot');
        }
      } catch {
        // Continue
      }
    }
    
    // If still not found, try refreshing and waiting longer
    if (!meetingFound || !meetingElement) {
      if (!refreshAttempted) {
        console.log('  Meeting not found yet, refreshing calendar and waiting longer...');
        await this.anyteamCalendarPage.page.reload({ waitUntil: 'networkidle' });
        await this.anyteamCalendarPage.page.waitForTimeout(10000);
        refreshAttempted = true;
        
        // Try finding again after refresh
        for (const selector of meetingSelectors) {
          try {
            meetingElement = this.anyteamCalendarPage.page.locator(selector).first();
            const isVisible = await meetingElement.isVisible({ timeout: 5000 }).catch(() => false);
            
            if (isVisible) {
              const text = await meetingElement.textContent();
              if (text && text.trim().includes(meetingTitle)) {
                console.log(`  ✓ Found meeting after refresh with selector: ${selector}`);
                meetingFound = true;
                break;
              }
            }
          } catch {
            continue;
          }
        }
      }
    }
    
    if (!meetingFound || !meetingElement) {
      console.log(`  ⚠ Could not find meeting "${meetingTitle}" in Anyteam calendar`);
      console.log('    Possible reasons:');
      console.log('    1. Meeting needs more time to sync (can take 1-2 minutes)');
      console.log('    2. Meeting is on a different date than expected');
      console.log('    3. Calendar view needs to be scrolled or date changed');
      throw new Error(`Could not find meeting "${meetingTitle}" in Anyteam calendar after refresh`);
    }
    
    // Step 4: Click the meeting to open it
    console.log(`  Step 4: Clicking meeting "${meetingTitle}" in Anyteam calendar...`);
    await meetingElement.scrollIntoViewIfNeeded().catch(() => {});
    await meetingElement.click();
    await this.anyteamCalendarPage.page.waitForTimeout(2000);
    console.log(`  ✓ Meeting clicked`);
    
    // Step 5: Join the meeting from Anyteam app
    console.log('  Step 5: Joining meeting from Anyteam application...');
    
    // Wait for join button to appear
    await this.anyteamCalendarPage.page.waitForTimeout(2000);
    
    // Try multiple selectors for join button
    const joinButtonSelectors = [
      'button:has-text("Join")',
      'button:has-text("Join Meeting")',
      'a:has-text("Join")',
      '[aria-label*="Join" i]',
      'button:has-text("Join with Google Meet")',
    ];
    
    let joinButtonFound = false;
    let joinButton = null;
    
    for (const selector of joinButtonSelectors) {
      try {
        joinButton = this.anyteamCalendarPage.page.locator(selector).first();
        const isVisible = await joinButton.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isVisible) {
          console.log(`  ✓ Found join button with selector: ${selector}`);
          joinButtonFound = true;
          break;
        }
      } catch {
        continue;
      }
    }
    
    if (!joinButtonFound || !joinButton) {
      throw new Error('Could not find join button in Anyteam calendar');
    }
    
    // Click join button - this should open Google Meet
    const [meetPage] = await Promise.all([
      this.anyteamCalendarPage.page.context().waitForEvent('page', { timeout: 10000 }),
      joinButton.click()
    ]);
    
    await meetPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await meetPage.waitForTimeout(3000);
    console.log('  ✓ Joined meeting from Anyteam application');
    console.log(`  Meet URL: ${meetPage.url()}`);
    
    return meetPage;
  }
}

