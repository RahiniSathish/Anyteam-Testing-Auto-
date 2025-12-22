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
  
  // Meeting item in calendar view (with time, company logo, and title)
  readonly teamStandupMeetingItem: Locator; // The div with time "16:00 - 17:00" and "fourentech - Team Standup Meeting"
  readonly joinArrowIcon: Locator; // Chevron-down icon to join meeting
  readonly joinButton: Locator; // Join button after clicking join arrow

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

    // Meeting item: <div class="flex flex-row items-center space-x-2 cursor-pointer px-4 pt-4">
    // Contains: time "16:00 - 17:00", company logo, and "fourentech - Team Standup Meeting"
    // More flexible selector to find the div containing the time and meeting title
    this.teamStandupMeetingItem = page.locator('div.flex.flex-row.items-center.space-x-2.cursor-pointer.px-4.pt-4:has(p:has-text("16:00 - 17:00")), div.cursor-pointer:has(p:has-text("16:00 - 17:00")):has(span:has-text("Team Standup Meeting")), div:has(p:has-text("16:00 - 17:00")):has(span:has-text("fourentech")):has(span:has-text("Team Standup Meeting"))').first();

    // Join arrow icon: <svg class="lucide lucide-chevron-down">
    // The arrow might be inside a button or clickable element, so we'll try multiple selectors
    this.joinArrowIcon = page.locator('svg.lucide-chevron-down, button:has(svg.lucide-chevron-down), div:has(svg.lucide-chevron-down), [role="button"]:has(svg.lucide-chevron-down)').first();

    // Join button: <button type="button" class="text-white font-medium rounded-l-md hover:bg-white/10 transition-colors h-8 px-3 text-xs cursor-pointer" data-state="closed">Join</button>
    // Try multiple selectors to be flexible with class variations
    this.joinButton = page.locator('button[type="button"].text-white.font-medium.rounded-l-md[data-state="closed"]:has-text("Join"), button[type="button"].text-white.font-medium.rounded-l-md:has-text("Join")').first();
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

  /**
   * Click on Team Standup Meeting item (the div with time, company logo, and title)
   */
  async clickTeamStandupMeetingItem(): Promise<void> {
    await this.teamStandupMeetingItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.teamStandupMeetingItem.scrollIntoViewIfNeeded();
    await this.teamStandupMeetingItem.click({ timeout: 5000 });
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if Team Standup Meeting item is visible
   */
  async isTeamStandupMeetingItemVisible(): Promise<boolean> {
    try {
      return await this.teamStandupMeetingItem.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Find and click any meeting item by time slot (e.g., "14:15 - 15:15")
   * More flexible method that works with any meeting
   */
  async clickMeetingItemByTime(timeSlot: string): Promise<void> {
    const meetingItem = this.page.locator(
      `div.flex.flex-row.items-center.space-x-2.cursor-pointer.px-4.pt-4:has(p:has-text("${timeSlot}"))`
    ).first();
    
    await meetingItem.waitFor({ state: 'visible', timeout: 10000 });
    await meetingItem.scrollIntoViewIfNeeded();
    await meetingItem.click({ timeout: 5000 });
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if meeting item with specific time slot is visible
   */
  async isMeetingItemByTimeVisible(timeSlot: string): Promise<boolean> {
    try {
      const meetingItem = this.page.locator(
        `div.flex.flex-row.items-center.space-x-2.cursor-pointer.px-4.pt-4:has(p:has-text("${timeSlot}"))`
      ).first();
      return await meetingItem.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Click the first available meeting item in the calendar
   * Finds any meeting item that matches the calendar structure
   */
  async clickFirstAvailableMeetingItem(): Promise<void> {
    const meetingItem = this.page.locator(
      'div.flex.flex-row.items-center.space-x-2.cursor-pointer.px-4.pt-4'
    ).first();
    
    await meetingItem.waitFor({ state: 'visible', timeout: 10000 });
    await meetingItem.scrollIntoViewIfNeeded();
    await meetingItem.click({ timeout: 5000 });
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if any meeting item is visible
   */
  async isAnyMeetingItemVisible(): Promise<boolean> {
    try {
      const meetingItem = this.page.locator(
        'div.flex.flex-row.items-center.space-x-2.cursor-pointer.px-4.pt-4'
      ).first();
      return await meetingItem.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Click the join arrow (chevron-down icon)
   * Tries multiple strategies to find and click the arrow
   */
  async clickJoinArrow(): Promise<void> {
    console.log('  🔍 Looking for join arrow (chevron-down icon)...');
    
    // Try multiple selectors to find the join arrow
    const selectors = [
      'svg.lucide-chevron-down',
      'button:has(svg.lucide-chevron-down)',
      'div:has(svg.lucide-chevron-down)',
      '[role="button"]:has(svg.lucide-chevron-down)',
      'div.cursor-pointer:has(svg.lucide-chevron-down)',
      'button[aria-label*="join" i]:has(svg.lucide-chevron-down)',
      'button[aria-label*="Join" i]:has(svg.lucide-chevron-down)',
    ];

    let arrowFound = false;
    
    for (const selector of selectors) {
      try {
        const arrow = this.page.locator(selector).first();
        const count = await arrow.count();
        const isVisible = await arrow.isVisible({ timeout: 3000 }).catch(() => false);
        
        console.log(`    Selector "${selector}": count=${count}, visible=${isVisible}`);
        
        if (isVisible && count > 0) {
          await arrow.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          
          // Try to click
          try {
            await arrow.click({ timeout: 5000 });
            console.log(`  ✓ Clicked join arrow using selector: ${selector}`);
            arrowFound = true;
            break;
          } catch (clickError) {
            // If normal click fails, try force click
            console.log(`  ⚠ Normal click failed, trying force click...`);
            await arrow.click({ force: true, timeout: 5000 });
            console.log(`  ✓ Clicked join arrow (force) using selector: ${selector}`);
            arrowFound = true;
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }

    if (!arrowFound) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/join-arrow-not-found.png', fullPage: true });
      throw new Error('Join arrow (chevron-down) not found. Screenshot saved to test-results/join-arrow-not-found.png');
    }
    
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if join arrow is visible
   * Tries multiple selectors to find the arrow
   */
  async isJoinArrowVisible(): Promise<boolean> {
    const selectors = [
      'svg.lucide-chevron-down',
      'button:has(svg.lucide-chevron-down)',
      'div:has(svg.lucide-chevron-down)',
      '[role="button"]:has(svg.lucide-chevron-down)',
    ];

    for (const selector of selectors) {
      try {
        const arrow = this.page.locator(selector).first();
        const isVisible = await arrow.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          return true;
        }
      } catch {
        continue;
      }
    }
    
    return false;
  }

  /**
   * Click the Join button after join arrow is clicked
   */
  async clickJoinButton(): Promise<void> {
    console.log('  🔍 Looking for Join button...');
    
    // Try multiple selectors to find the Join button
    // Based on: <button type="button" class="text-white font-medium rounded-l-md hover:bg-white/10 transition-colors h-8 px-3 text-xs cursor-pointer" data-state="closed">Join</button>
    // Note: hover:bg-white/10 is a pseudo-class and won't be in the DOM selector
    const selectors = [
      // Exact match: type="button", data-state="closed", with text-white, font-medium, rounded-l-md classes
      'button[type="button"][data-state="closed"].text-white.font-medium.rounded-l-md.h-8.px-3.text-xs.cursor-pointer:has-text("Join")',
      'button[type="button"][data-state="closed"].text-white.font-medium.rounded-l-md:has-text("Join")',
      'button[type="button"][data-state="closed"].text-white.font-medium:has-text("Join")',
      'button[type="button"][data-state="closed"]:has-text("Join")',
      'button[type="button"].text-white.font-medium.rounded-l-md[data-state="closed"]:has-text("Join")',
      'button[type="button"].text-white.font-medium:has-text("Join")',
      'button.text-white.font-medium.rounded-l-md[data-state="closed"]:has-text("Join")',
      'button.text-white.font-medium.rounded-l-md:has-text("Join")',
      'button[data-state="closed"]:has-text("Join")',
      'button.text-white.cursor-pointer:has-text("Join")',
      'button.h-8.px-3.text-xs:has-text("Join")',
      'button.text-white:has-text("Join")',
      'button:has-text("Join")',
    ];

    let buttonFound = false;
    
    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const count = await button.count();
        const isVisible = await button.isVisible({ timeout: 3000 }).catch(() => false);
        
        console.log(`    Selector "${selector}": count=${count}, visible=${isVisible}`);
        
        if (isVisible && count > 0) {
          await button.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(500);
          
          // Try to click
          try {
            await button.click({ timeout: 5000 });
            console.log(`  ✓ Clicked Join button using selector: ${selector}`);
            buttonFound = true;
            break;
          } catch (clickError) {
            // If normal click fails, try force click
            console.log(`  ⚠ Normal click failed, trying force click...`);
            await button.click({ force: true, timeout: 5000 });
            console.log(`  ✓ Clicked Join button (force) using selector: ${selector}`);
            buttonFound = true;
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }

    if (!buttonFound) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/join-button-not-found.png', fullPage: true });
      throw new Error('Join button not found. Screenshot saved to test-results/join-button-not-found.png');
    }
    
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if Join button is visible
   */
  async isJoinButtonVisible(): Promise<boolean> {
    // Try multiple selectors to find the Join button
    // Based on: <button type="button" class="text-white font-medium rounded-l-md hover:bg-white/10 transition-colors h-8 px-3 text-xs cursor-pointer" data-state="closed">Join</button>
    // Note: hover:bg-white/10 is a pseudo-class and won't be in the DOM selector
    const selectors = [
      // Exact match: type="button", data-state="closed", with text-white, font-medium, rounded-l-md classes
      'button[type="button"][data-state="closed"].text-white.font-medium.rounded-l-md.h-8.px-3.text-xs.cursor-pointer:has-text("Join")',
      'button[type="button"][data-state="closed"].text-white.font-medium.rounded-l-md:has-text("Join")',
      'button[type="button"][data-state="closed"].text-white.font-medium:has-text("Join")',
      'button[type="button"][data-state="closed"]:has-text("Join")',
      'button[type="button"].text-white.font-medium.rounded-l-md[data-state="closed"]:has-text("Join")',
      'button[type="button"].text-white.font-medium:has-text("Join")',
      'button.text-white.font-medium.rounded-l-md[data-state="closed"]:has-text("Join")',
      'button.text-white.font-medium.rounded-l-md:has-text("Join")',
      'button[data-state="closed"]:has-text("Join")',
      'button.text-white.cursor-pointer:has-text("Join")',
      'button.h-8.px-3.text-xs:has-text("Join")',
      'button.text-white:has-text("Join")',
      'button:has-text("Join")',
    ];

    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          return true;
        }
      } catch {
        continue;
      }
    }
    
    return false;
  }
}

