import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Notifications Page
 * Represents the Notifications panel/page in the anyteam.com application
 */
export class NotificationsPage {
  readonly page: Page;

  // Notifications heading
  readonly notificationsHeading: Locator;

  // Notification items
  readonly viewMeetingInsightsButton: Locator;
  readonly recentNotifications: Locator;
  readonly notificationItem: Locator; // Notification item div with cursor-pointer

  // Filter button and checkboxes
  readonly filterButton: Locator; // Filter button with list-filter icon
  readonly readCheckbox: Locator; // Read checkbox
  readonly unreadCheckbox: Locator; // Unread checkbox

  // Three-dotted menu and Mark all as read
  readonly threeDottedMenu: Locator; // Three-dotted menu button (ellipsis-vertical icon)
  readonly markAllAsReadButton: Locator; // Mark all as read button

  constructor(page: Page) {
    this.page = page;

    // Notifications heading: <h5 class="text-[17px] font-[400] pl-3 leading-none text-grayText">Notifications</h5>
    this.notificationsHeading = page.locator('h5:has-text("Notifications")').first();

    // View Meeting Insights button: <span class="text-[12px] leading-[15px] font-plus_jakarta_sans text-nowrap font-medium">View Meeting Insights</span>
    this.viewMeetingInsightsButton = page.locator('span:has-text("View Meeting Insights")').first();

    // Recent notifications container
    this.recentNotifications = page.locator('[class*="notification"], [data-testid*="notification"]').first();

    // Notification item: <div class="flex gap-3 px-4 py-3 border-b border-b-zinc-100 items-start cursor-pointer">
    this.notificationItem = page.locator('div.flex.gap-3.px-4.py-3.border-b.border-b-zinc-100.items-start.cursor-pointer').first();

    // Filter button: <button class="inline-flex items-center justify-center...h-9 w-9 p-0 hover:bg-zinc-100 relative z-50" data-state="closed">
    // with <svg class="lucide lucide-list-filter h-5 w-5 text-zinc-600">
    // This is for Read/Unread bulk selection (different from three-dotted menu)
    // This appears in the notification panel
    this.filterButton = page.locator('button.h-9.w-9:has(svg.lucide-list-filter), button:has(svg.lucide-list-filter.h-5.w-5)').first();

    // Read checkbox: <button type="button" role="checkbox" aria-checked="true/false" data-state="checked/unchecked" ...>
    // The checkbox is inside a label with text "Read"
    // Selected: aria-checked="true" data-state="checked" with <svg class="lucide lucide-check h-4 w-4">
    // Unselected: aria-checked="false" data-state="unchecked"
    this.readCheckbox = page.locator('label:has-text("Read") button[type="button"][role="checkbox"]').first();

    // Unread checkbox: <button type="button" role="checkbox" aria-checked="true/false" data-state="checked/unchecked" ...>
    // The checkbox is inside a label with text "Unread"
    // Selected: aria-checked="true" data-state="checked" with <svg class="lucide lucide-check h-4 w-4">
    // Unselected: aria-checked="false" data-state="unchecked"
    this.unreadCheckbox = page.locator('label:has-text("Unread") button[type="button"][role="checkbox"]').first();

    // Three-dotted menu: <div role="button" tabindex="0" class="p-2 rounded-full hover:bg-gray-100 cursor-pointer" aria-disabled="false">
    // with <svg class="lucide lucide-ellipsis-vertical w-6 h-6" data-state="closed">
    // This appears in the notification panel after clicking the bell icon
    this.threeDottedMenu = page.locator('div[role="button"].p-2.rounded-full.hover\\:bg-gray-100.cursor-pointer:has(svg.lucide-ellipsis-vertical.w-6.h-6)').first();

    // Mark all as read button: <button class="w-full text-left px-4 py-3 hover:bg-slate-100">Mark all as read</button>
    // This button appears after clicking the filter button
    this.markAllAsReadButton = page.locator('button.w-full.text-left.px-4.py-3:has-text("Mark all as read")').first();
  }

  /**
   * Wait for notifications panel to be visible
   */
  async waitForNotificationsPanel(): Promise<void> {
    await this.notificationsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click on the Notifications heading
   */
  async clickNotificationsHeading(): Promise<void> {
    // Wait for page to be ready first
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(2000);
    
    // Wait for home page content to be visible (sidebar, main content, etc.)
    const homePageIndicators = [
      this.page.locator('[data-sidebar]'),
      this.page.locator('button[data-sidebar="menu-button"]'),
      this.page.locator('text=/Good (Morning|Afternoon|Evening)/i'),
    ];
    
    let homePageReady = false;
    for (const indicator of homePageIndicators) {
      try {
        const isVisible = await indicator.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
          homePageReady = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!homePageReady) {
      // Wait a bit more for page to load
      await this.page.waitForTimeout(5000);
    }
    
    // Try multiple selectors to find the Notifications heading
    const selectors = [
      'h5:has-text("Notifications")',
      'h5.text-grayText:has-text("Notifications")',
      'h5[class*="text-grayText"]:has-text("Notifications")',
      'h5[class*="pl-3"]:has-text("Notifications")',
      'h5[class*="text-[17px]"]:has-text("Notifications")',
      'h5:has-text("Notifications")',
    ];

    let headingFound = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        // Wait longer for the element to appear
        await element.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        const isVisible = await element.isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          await element.scrollIntoViewIfNeeded().catch(() => {});
          await this.page.waitForTimeout(500); // Small wait before click
          await element.click({ timeout: 5000 });
          headingFound = true;
          console.log(`✓ Found and clicked Notifications heading with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!headingFound) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/notifications-heading-not-found.png', fullPage: true });
      throw new Error('Notifications heading not found. Screenshot saved to test-results/notifications-heading-not-found.png');
    }

    await this.page.waitForTimeout(2000);
  }

  /**
   * Click on "View Meeting Insights" button
   * This appears after clicking a notification item, inside a div with border-t border-t-zinc-100
   */
  async clickViewMeetingInsights(): Promise<void> {
    // Wait a bit for the View Meeting Insights to appear after clicking notification item
    await this.page.waitForTimeout(1000);

    // Try multiple selectors to find the View Meeting Insights button
    // Based on: <span class="text-[12px] leading-[15px] font-plus_jakarta_sans text-nowrap font-medium">View Meeting Insights</span>
    const selectors = [
      'div.border-t.border-t-zinc-100:has(span:has-text("View Meeting Insights")) span:has-text("View Meeting Insights")',
      'div[class*="border-t-zinc-100"] span:has-text("View Meeting Insights")',
      'span.text-\\[12px\\]:has-text("View Meeting Insights")',
      'span[class*="font-plus_jakarta_sans"]:has-text("View Meeting Insights")',
      'span[class*="text-nowrap"]:has-text("View Meeting Insights")',
      'span:has-text("View Meeting Insights")',
      'button:has-text("View Meeting Insights")',
      'a:has-text("View Meeting Insights")',
    ];

    let buttonFound = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        const isVisible = await element.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
          await element.scrollIntoViewIfNeeded().catch(() => {});
          await this.page.waitForTimeout(500);
          await element.click({ timeout: 5000 });
          buttonFound = true;
          console.log(`✓ Found and clicked View Meeting Insights with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!buttonFound) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/view-meeting-insights-not-found.png', fullPage: true });
      throw new Error('View Meeting Insights button not found. Screenshot saved to test-results/view-meeting-insights-not-found.png');
    }

    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if notifications panel is displayed
   */
  async isDisplayed(): Promise<boolean> {
    try {
      await this.notificationsHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.notificationsHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if View Meeting Insights is visible
   */
  async isViewMeetingInsightsVisible(): Promise<boolean> {
    try {
      return await this.viewMeetingInsightsButton.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Click on a notification item (meeting notification)
   * Looks for the notification div with cursor-pointer class
   */
  async clickNotificationItem(): Promise<void> {
    // Wait for notifications panel to be visible first
    await this.waitForNotificationsPanel();
    await this.page.waitForTimeout(1000);

    // Try multiple selectors to find the notification item
    const selectors = [
      'div.flex.gap-3.px-4.py-3.border-b.border-b-zinc-100.items-start.cursor-pointer',
      'div[class*="cursor-pointer"][class*="border-b"]',
      'div.cursor-pointer:has(img[alt="company-logo"])',
      'div.cursor-pointer:has-text("You have a meeting soon")',
      'div.cursor-pointer:has(svg.lucide-calendar)',
    ];

    let itemFound = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        const isVisible = await element.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
          await element.scrollIntoViewIfNeeded().catch(() => {});
          await this.page.waitForTimeout(500);
          await element.click({ timeout: 5000 });
          itemFound = true;
          console.log(`✓ Found and clicked notification item with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!itemFound) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/notification-item-not-found.png', fullPage: true });
      throw new Error('Notification item not found. Screenshot saved to test-results/notification-item-not-found.png');
    }

    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if notification item is visible
   */
  async isNotificationItemVisible(): Promise<boolean> {
    try {
      return await this.notificationItem.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Click the filter button (list-filter icon) to open filter options
   */
  async clickFilterButton(): Promise<void> {
    await this.filterButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.filterButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.filterButton.click({ timeout: 5000 });
    await this.page.waitForTimeout(1000); // Wait for filter menu to open
  }

  /**
   * Check the Read checkbox
   */
  async checkReadCheckbox(): Promise<void> {
    await this.readCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await this.isReadCheckboxChecked();
    if (!isChecked) {
      await this.readCheckbox.scrollIntoViewIfNeeded().catch(() => {});
      await this.readCheckbox.click({ timeout: 5000 });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Uncheck the Read checkbox
   */
  async uncheckReadCheckbox(): Promise<void> {
    await this.readCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await this.isReadCheckboxChecked();
    if (isChecked) {
      await this.readCheckbox.scrollIntoViewIfNeeded().catch(() => {});
      await this.readCheckbox.click({ timeout: 5000 });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Check if Read checkbox is checked
   */
  async isReadCheckboxChecked(): Promise<boolean> {
    try {
      const ariaChecked = await this.readCheckbox.getAttribute('aria-checked');
      const dataState = await this.readCheckbox.getAttribute('data-state');
      return ariaChecked === 'true' || dataState === 'checked';
    } catch {
      return false;
    }
  }

  /**
   * Check the Unread checkbox
   */
  async checkUnreadCheckbox(): Promise<void> {
    await this.unreadCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await this.isUnreadCheckboxChecked();
    if (!isChecked) {
      await this.unreadCheckbox.scrollIntoViewIfNeeded().catch(() => {});
      await this.unreadCheckbox.click({ timeout: 5000 });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Uncheck the Unread checkbox
   */
  async uncheckUnreadCheckbox(): Promise<void> {
    await this.unreadCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await this.isUnreadCheckboxChecked();
    if (isChecked) {
      await this.unreadCheckbox.scrollIntoViewIfNeeded().catch(() => {});
      await this.unreadCheckbox.click({ timeout: 5000 });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Check if Unread checkbox is checked
   */
  async isUnreadCheckboxChecked(): Promise<boolean> {
    try {
      const ariaChecked = await this.unreadCheckbox.getAttribute('aria-checked');
      const dataState = await this.unreadCheckbox.getAttribute('data-state');
      return ariaChecked === 'true' || dataState === 'checked';
    } catch {
      return false;
    }
  }

  /**
   * Verify filter button is visible
   */
  async isFilterButtonVisible(): Promise<boolean> {
    try {
      return await this.filterButton.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Verify Read checkbox is visible
   */
  async isReadCheckboxVisible(): Promise<boolean> {
    try {
      return await this.readCheckbox.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Verify Unread checkbox is visible
   */
  async isUnreadCheckboxVisible(): Promise<boolean> {
    try {
      return await this.unreadCheckbox.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Click the three-dotted menu (ellipsis-vertical icon)
   * This is in the notifications panel header
   */
  async clickThreeDottedMenu(): Promise<void> {
    // Try multiple selectors to find the three-dotted menu
    const selectors = [
      'div[role="button"].cursor-pointer:has(svg.lucide-ellipsis-vertical.w-6.h-6)',
      'div[role="button"]:has(svg.lucide-ellipsis-vertical)',
      'button:has(svg.lucide-ellipsis-vertical.w-6.h-6)',
      'button:has(svg.lucide-ellipsis-vertical)',
      '[role="button"]:has(svg.lucide-ellipsis-vertical)',
    ];

    let menuFound = false;
    for (const selector of selectors) {
      try {
        const menu = this.page.locator(selector).first();
        const count = await menu.count();
        if (count > 0) {
          const isVisible = await menu.isVisible({ timeout: 5000 }).catch(() => false);
          if (isVisible) {
            await menu.scrollIntoViewIfNeeded().catch(() => {});
            // If it's an SVG, click the parent button
            const tagName = await menu.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
            if (tagName === 'svg') {
              const parent = menu.locator('..');
              await parent.click({ timeout: 5000 });
            } else {
              await menu.click({ timeout: 5000 });
            }
            menuFound = true;
            console.log(`✓ Found and clicked three-dotted menu with selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }

    if (!menuFound) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/three-dotted-menu-not-found.png', fullPage: true });
      throw new Error('Three-dotted menu not found. Screenshot saved to test-results/three-dotted-menu-not-found.png');
    }

    await this.page.waitForTimeout(1000); // Wait for menu to open
  }

  /**
   * Click "Mark all as read" button
   * Based on: <button class="w-full text-left px-4 py-3 hover:bg-slate-100">Mark all as read</button>
   */
  async clickMarkAllAsRead(): Promise<void> {
    // Wait a bit for the menu to open after clicking filter
    await this.page.waitForTimeout(500);

    // Try multiple selectors to find the Mark all as read button
    const selectors = [
      'button.w-full.text-left.px-4.py-3:has-text("Mark all as read")',
      'button.w-full.text-left:has-text("Mark all as read")',
      'button.px-4.py-3:has-text("Mark all as read")',
      'button:has-text("Mark all as read")',
      'button:has-text("mark all as read")',
      '[role="menuitem"]:has-text("Mark all as read")',
      'div:has(button:has(svg.lucide-list-filter)) ~ * button:has-text("Mark all as read")',
    ];

    let buttonFound = false;
    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
          await button.scrollIntoViewIfNeeded().catch(() => {});
          await button.click({ timeout: 5000 });
          buttonFound = true;
          console.log(`✓ Found and clicked Mark all as read button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!buttonFound) {
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/mark-all-as-read-not-found.png', fullPage: true });
      
      // Print all buttons on the page for debugging
      const allButtons = await this.page.locator('button').allTextContents();
      console.log('All buttons on page:', allButtons.slice(0, 20)); // Log first 20 buttons
      
      throw new Error('Mark all as read button not found. Screenshot saved to test-results/mark-all-as-read-not-found.png');
    }

    await this.page.waitForTimeout(2000); // Wait for action to complete
  }

  /**
   * Verify three-dotted menu is visible
   * Tries multiple selectors to find the menu in the notification panel
   */
  async isThreeDottedMenuVisible(): Promise<boolean> {
    // Wait for notification panel first
    await this.page.waitForTimeout(500);
    
    const selectors = [
      'div[role="button"].p-2.rounded-full.cursor-pointer:has(svg.lucide-ellipsis-vertical)',
      'div[role="button"].p-2.rounded-full:has(svg.lucide-ellipsis-vertical)',
      'div[role="button"].p-2:has(svg.lucide-ellipsis-vertical)',
      'div[role="button"]:has(svg.lucide-ellipsis-vertical.w-6.h-6)',
      'div[role="button"]:has(svg.lucide-ellipsis-vertical)',
      'div.cursor-pointer:has(svg.lucide-ellipsis-vertical)',
      'svg.lucide-ellipsis-vertical.w-6.h-6',
      'svg.lucide-ellipsis-vertical',
    ];

    for (const selector of selectors) {
      try {
        const menu = this.page.locator(selector).first();
        const isVisible = await menu.isVisible({ timeout: 3000 }).catch(() => false);
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
   * Verify "Mark all as read" button is visible
   * Tries multiple selectors to find the button
   */
  async isMarkAllAsReadButtonVisible(): Promise<boolean> {
    // Wait a bit for menu to appear after clicking filter
    await this.page.waitForTimeout(500);

    const selectors = [
      'button.w-full.text-left.px-4.py-3:has-text("Mark all as read")',
      'button.w-full.text-left:has-text("Mark all as read")',
      'button.px-4.py-3:has-text("Mark all as read")',
      'button:has-text("Mark all as read")',
      'button:has-text("mark all as read")',
      '[role="menuitem"]:has-text("Mark all as read")',
    ];

    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 5000 }).catch(() => false);
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
   * Verify all notifications are marked as read
   * Checks if notification items have read state indicators
   */
  async verifyAllNotificationsMarkedAsRead(): Promise<{
    allMarkedAsRead: boolean;
    notificationCount: number;
    readCount: number;
  }> {
    const results = {
      allMarkedAsRead: false,
      notificationCount: 0,
      readCount: 0,
    };

    try {
      // Get all notification items
      const notificationItems = this.page.locator('div.flex.gap-3.px-4.py-3.border-b.border-b-zinc-100.items-start.cursor-pointer');
      results.notificationCount = await notificationItems.count();

      if (results.notificationCount > 0) {
        // Check each notification for read state
        // Read notifications might have different styling or indicators
        // Common indicators: opacity, different background color, checkmark icon, etc.
        for (let i = 0; i < results.notificationCount; i++) {
          const item = notificationItems.nth(i);
          const itemClasses = await item.getAttribute('class').catch(() => '');
          const itemOpacity = await item.evaluate((el) => {
            const win = el.ownerDocument.defaultView;
            if (!win) return 1;
            const style = win.getComputedStyle(el);
            return parseFloat(style.opacity);
          }).catch(() => 1);

          // Check for read indicators:
          // 1. Lower opacity (read items often have opacity < 1)
          // 2. Specific classes indicating read state
          // 3. Checkmark or read icon
          const hasReadIndicator = itemOpacity < 1 || 
                                   itemClasses?.includes('opacity') ||
                                   (await item.locator('svg.lucide-check, [class*="read"], [data-read="true"]').count() > 0);

          if (hasReadIndicator) {
            results.readCount++;
          }
        }

        // All notifications should be marked as read
        results.allMarkedAsRead = results.readCount === results.notificationCount;
      } else {
        // No notifications found, consider it as all read (no unread notifications)
        results.allMarkedAsRead = true;
      }
    } catch (error) {
      console.log('Error verifying notifications read state:', error);
    }

    return results;
  }
}


