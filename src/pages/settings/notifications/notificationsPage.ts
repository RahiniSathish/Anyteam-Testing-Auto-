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

  // Filter action buttons
  readonly applyFiltersButton: Locator; // Apply filters button
  readonly clearAllButton: Locator; // Clear all button

  // Context menu items for individual notifications
  readonly markAsReadButton: Locator; // Context menu: Mark as Read
  readonly markAsUnreadButton: Locator; // Context menu: Mark Selected as Unread

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

    // Apply filters button: <button class="inline-flex items-center justify-center gap-2...bg-neutral-900 text-neutral-50...h-9 px-4 py-2 w-11/12 text-[10px] font-medium my-4 mx-3 rounded-b-md">Apply filters</button>
    this.applyFiltersButton = page.locator('button:has-text("Apply filters")').first();

    // Clear all button: <button class="inline-flex items-center justify-center gap-2...text-[#0F66BE] h-9 px-4 py-2 text-xs">Clear all</button>
    this.clearAllButton = page.locator('button:has-text("Clear all")').first();

    // Context menu buttons for individual notifications
    // These appear when right-clicking on a notification item
    this.markAsReadButton = page.locator('button:has-text("Mark as Read"), [role="menuitem"]:has-text("Mark as Read")').first();
    this.markAsUnreadButton = page.locator('button:has-text("Mark Selected as Unread"), button:has-text("Mark as Unread"), [role="menuitem"]:has-text("Mark as Unread")').first();
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

    // Check if notifications panel is already open
    const panelHeading = this.page.locator('h2:has-text("Notifications")').first();
    const isPanelOpen = await panelHeading.isVisible({ timeout: 2000 }).catch(() => false);

    if (isPanelOpen) {
      console.log('✓ Notifications panel already open, skipping click');
      return;
    }

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

    // Click the sidebar notification button using the exact selector
    // <button data-sidebar="menu-button"><h5 class="...text-grayText">Notifications</h5></button>
    const notificationButton = this.page.locator('button[data-sidebar="menu-button"]:has(h5:has-text("Notifications"))').first();

    try {
      await notificationButton.waitFor({ state: 'visible', timeout: 10000 });
      await notificationButton.scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(500);
      await notificationButton.click({ timeout: 5000 });
      console.log('✓ Clicked Notifications button in sidebar');
      await this.page.waitForTimeout(2000);
      return;
    } catch (e) {
      console.log('Primary selector failed, trying fallback selectors...');
    }

    // Fallback: Try multiple selectors to find the Notifications heading
    const selectors = [
      'h5:has-text("Notifications")',
      'h5.text-grayText:has-text("Notifications")',
      'h5[class*="text-grayText"]:has-text("Notifications")',
      'h5[class*="pl-3"]:has-text("Notifications")',
      'h5[class*="text-[17px]"]:has-text("Notifications")',
      'button:has(h5:has-text("Notifications"))',
    ];

    let headingFound = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        const isVisible = await element.isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          await element.scrollIntoViewIfNeeded().catch(() => {});
          await this.page.waitForTimeout(500);
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
   * Verify Team Standup Meeting notification is visible
   * Scrolls the notification panel to find the notification
   */
  async isTeamStandupMeetingNotificationVisible(): Promise<boolean> {
    try {
      // First try without scrolling
      const isVisible = await this.teamStandupMeetingNotification.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        return true;
      }
      
      // If not visible, try scrolling the notification panel
      console.log('  Notification not immediately visible, scrolling to find it...');
      await this.page.evaluate(() => {
        const win = globalThis as any;
        const notificationContainer = win.document.querySelector('[class*="notification"], div:has(h2:has-text("Notifications"))') || win.document.body;
        notificationContainer.scrollBy(0, 300);
      });
      await this.page.waitForTimeout(500);
      
      // Check again after scrolling
      return await this.teamStandupMeetingNotification.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Click on Team Standup Meeting notification
   * Scrolls to find the notification first, then clicks it
   */
  async clickTeamStandupMeetingNotification(): Promise<void> {
    // First, scroll the notifications panel to find the Team Standup Meeting notification
    console.log('  Scrolling to find Team Standup Meeting notification...');
    
    // Scroll the notification panel to ensure we can see all notifications
    const notificationPanel = this.page.locator('h2:has-text("Notifications")').locator('..').first();
    await notificationPanel.scrollIntoViewIfNeeded().catch(() => {});
    
    // Try scrolling down in the notification list to find the Team Standup Meeting
    await this.page.evaluate(() => {
      const win = globalThis as any;
      const notificationContainer = win.document.querySelector('[class*="notification"], div:has(h2:has-text("Notifications"))') || win.document.body;
      notificationContainer.scrollBy(0, 300);
    });
    await this.page.waitForTimeout(500);
    
    // Wait for the notification to be visible
    await this.teamStandupMeetingNotification.waitFor({ state: 'visible', timeout: 10000 });
    
    // Scroll the specific notification into view
    await this.teamStandupMeetingNotification.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    // Click on the notification
    await this.teamStandupMeetingNotification.click({ timeout: 5000 });
  }

  /**
   * Verify View Meeting Pre-Read button is visible
   */
  async isViewMeetingPreReadVisible(): Promise<boolean> {
    try {
      return await this.viewMeetingPreReadButton.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Click on View Meeting Pre-Read button
   * Scrolls to find the button first, then clicks it
   * The button is in: <div class="border-t border-t-zinc-100 py-2 my-3 flex flex-row items-center justify-between">
   */
  async clickViewMeetingPreRead(): Promise<void> {
    // Scroll to ensure the button is visible
    console.log('  Scrolling to find View Meeting Pre-Read button...');
    
    // Scroll the page to find the View Meeting Pre-Read button
    await this.page.evaluate(() => {
      const win = globalThis as any;
      win.scrollBy(0, 200);
    });
    await this.page.waitForTimeout(500);
    
    // Wait for the button to be visible (using the parent div selector for better reliability)
    await this.viewMeetingPreReadButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Scroll the button into view
    await this.viewMeetingPreReadButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    // Click on the button (the parent div or the span)
    try {
      await this.viewMeetingPreReadButton.click({ timeout: 5000 });
    } catch (e) {
      // If direct click fails, try force click
      console.log('  Direct click failed, trying force click...');
      await this.viewMeetingPreReadButton.click({ force: true, timeout: 5000 });
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
    console.log('  🔍 Attempting to click filter button...');

    // First, ensure any open dropdowns are closed (from three-dotted menu)
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(500);

    // Click outside any dropdowns to close them
    await this.page.locator('main').click({ position: { x: 10, y: 10 } }).catch(() => {});
    await this.page.waitForTimeout(500);

    // Use the exact filter button selector from the HTML
    // <button class="... h-9 w-9 p-0 hover:bg-zinc-100 relative z-50" data-state="closed">
    //   <svg class="lucide lucide-list-filter h-5 w-5 text-zinc-600">
    const filterBtn = this.page.locator('button:has(svg.lucide-list-filter.h-5.w-5.text-zinc-600)').first();

    // Verify button exists
    const filterBtnCount = await filterBtn.count();
    console.log(`  Filter button found: ${filterBtnCount > 0 ? 'YES' : 'NO'} (count: ${filterBtnCount})`);

    if (filterBtnCount === 0) {
      await this.page.screenshot({ path: 'test-results/filter-button-not-found.png', fullPage: true });
      throw new Error('Filter button not found. Screenshot saved.');
    }

    await filterBtn.waitFor({ state: 'visible', timeout: 10000 });
    await filterBtn.scrollIntoViewIfNeeded().catch(() => {});

    // Take screenshot before click
    await this.page.screenshot({ path: 'test-results/before-filter-click.png', fullPage: true });
    console.log('  📸 Screenshot before click: test-results/before-filter-click.png');

    // Try normal click first
    try {
      await filterBtn.click({ timeout: 3000 });
      console.log('  ✓ Filter button clicked (normal click)');
    } catch (e) {
      // If blocked, use force click
      console.log('  ⚠ Normal click blocked, using force click...');
      await filterBtn.click({ force: true, timeout: 5000 });
      console.log('  ✓ Filter button clicked (force click)');
    }

    await this.page.waitForTimeout(2000); // Increased wait for filter menu to open

    // Take screenshot after click to verify dropdown opened
    await this.page.screenshot({ path: 'test-results/after-filter-click.png', fullPage: true });
    console.log('  📸 Screenshot after click: test-results/after-filter-click.png');

    // Verify filter dropdown is actually open by checking for checkboxes
    const readCheckboxVisible = await this.page.locator('label:has-text("Read")').isVisible({ timeout: 3000 }).catch(() => false);
    const unreadCheckboxVisible = await this.page.locator('label:has-text("Unread")').isVisible({ timeout: 3000 }).catch(() => false);

    console.log(`  Filter dropdown status: Read checkbox = ${readCheckboxVisible ? 'visible' : 'NOT visible'}, Unread checkbox = ${unreadCheckboxVisible ? 'visible' : 'NOT visible'}`);

    if (!readCheckboxVisible && !unreadCheckboxVisible) {
      console.log('  ⚠ WARNING: Filter dropdown may not have opened! Retrying...');
      // Try clicking again
      await filterBtn.click({ force: true, timeout: 5000 });
      await this.page.waitForTimeout(2000);

      // Check again
      const readCheckboxVisible2 = await this.page.locator('label:has-text("Read")').isVisible({ timeout: 3000 }).catch(() => false);
      const unreadCheckboxVisible2 = await this.page.locator('label:has-text("Unread")').isVisible({ timeout: 3000 }).catch(() => false);

      if (!readCheckboxVisible2 && !unreadCheckboxVisible2) {
        await this.page.screenshot({ path: 'test-results/filter-dropdown-failed-to-open.png', fullPage: true });
        throw new Error('Filter dropdown failed to open after retry. Screenshot saved to test-results/filter-dropdown-failed-to-open.png');
      }

      console.log('  ✓ Filter dropdown opened after retry');
    } else {
      console.log('  ✓ Filter dropdown opened successfully');
    }
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
      // Wait a bit for filter menu to open
      await this.page.waitForTimeout(500);

      // Try multiple selectors to find the Read checkbox
      const selectors = [
        'label:has-text("Read") button[type="button"][role="checkbox"]',
        'label:has-text("Read") button[role="checkbox"]',
        'button[role="checkbox"]:near(label:has-text("Read"))',
        'label:has-text("Read")',
      ];

      console.log('  🔍 Checking Read checkbox visibility...');

      for (const selector of selectors) {
        try {
          const checkbox = this.page.locator(selector).first();
          const count = await checkbox.count();
          const isVisible = await checkbox.isVisible({ timeout: 3000 }).catch(() => false);
          console.log(`    Selector "${selector}": count=${count}, visible=${isVisible}`);
          if (isVisible) {
            // Scroll into view to ensure it's actually visible
            await checkbox.scrollIntoViewIfNeeded().catch(() => {});
            console.log('  ✓ Read checkbox is visible');
            return true;
          }
        } catch {
          continue;
        }
      }

      console.log('  ✗ Read checkbox NOT visible');
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/read-checkbox-not-visible.png', fullPage: true });
      console.log('  📸 Screenshot saved: test-results/read-checkbox-not-visible.png');

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Verify Unread checkbox is visible
   */
  async isUnreadCheckboxVisible(): Promise<boolean> {
    try {
      // Wait a bit for filter menu to open
      await this.page.waitForTimeout(500);

      // Try multiple selectors to find the Unread checkbox
      const selectors = [
        'label:has-text("Unread") button[type="button"][role="checkbox"]',
        'label:has-text("Unread") button[role="checkbox"]',
        'button[role="checkbox"]:near(label:has-text("Unread"))',
        'label:has-text("Unread")',
      ];

      console.log('  🔍 Checking Unread checkbox visibility...');

      for (const selector of selectors) {
        try {
          const checkbox = this.page.locator(selector).first();
          const count = await checkbox.count();
          const isVisible = await checkbox.isVisible({ timeout: 3000 }).catch(() => false);
          console.log(`    Selector "${selector}": count=${count}, visible=${isVisible}`);
          if (isVisible) {
            // Scroll into view to ensure it's actually visible
            await checkbox.scrollIntoViewIfNeeded().catch(() => {});
            console.log('  ✓ Unread checkbox is visible');
            return true;
          }
        } catch {
          continue;
        }
      }

      console.log('  ✗ Unread checkbox NOT visible');
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'test-results/unread-checkbox-not-visible.png', fullPage: true });
      console.log('  📸 Screenshot saved: test-results/unread-checkbox-not-visible.png');

      return false;
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

  /**
   * Right-click on a notification item to open context menu
   * @param index - The index of the notification to right-click (0-based)
   */
  async rightClickNotification(index: number = 0): Promise<void> {
    // Get all notification items
    const notificationItems = this.page.locator('div.flex.gap-3.px-4.py-3.border-b.border-b-zinc-100.items-start.cursor-pointer');
    const count = await notificationItems.count();

    if (count === 0) {
      throw new Error('No notification items found to right-click');
    }

    if (index >= count) {
      throw new Error(`Notification index ${index} is out of bounds. Only ${count} notifications found.`);
    }

    // Right-click on the specified notification
    const targetNotification = notificationItems.nth(index);
    await targetNotification.scrollIntoViewIfNeeded().catch(() => {});
    await targetNotification.click({ button: 'right', timeout: 5000 });
    await this.page.waitForTimeout(1000); // Wait for context menu to appear
  }

  /**
   * Click "Mark as Read" button from context menu
   */
  async clickMarkAsRead(): Promise<void> {
    // Try multiple selectors to find the Mark as Read button
    const selectors = [
      'button:has-text("Mark as Read")',
      '[role="menuitem"]:has-text("Mark as Read")',
      'button.w-full:has-text("Mark as Read")',
      '[class*="menu"] button:has-text("Mark as Read")',
    ];

    let buttonFound = false;
    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          await button.scrollIntoViewIfNeeded().catch(() => {});
          await button.click({ timeout: 5000 });
          buttonFound = true;
          console.log(`✓ Clicked Mark as Read with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!buttonFound) {
      await this.page.screenshot({ path: 'test-results/mark-as-read-not-found.png', fullPage: true });
      throw new Error('Mark as Read button not found. Screenshot saved to test-results/mark-as-read-not-found.png');
    }

    await this.page.waitForTimeout(1000); // Wait for action to complete
  }

  /**
   * Click "Mark as Unread" or "Mark Selected as Unread" button from context menu
   */
  async clickMarkAsUnread(): Promise<void> {
    // Try multiple selectors to find the Mark as Unread button
    const selectors = [
      'button:has-text("Mark Selected as Unread")',
      'button:has-text("Mark as Unread")',
      '[role="menuitem"]:has-text("Mark as Unread")',
      '[role="menuitem"]:has-text("Mark Selected as Unread")',
      'button.w-full:has-text("Mark as Unread")',
      '[class*="menu"] button:has-text("Mark as Unread")',
    ];

    let buttonFound = false;
    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          await button.scrollIntoViewIfNeeded().catch(() => {});
          await button.click({ timeout: 5000 });
          buttonFound = true;
          console.log(`✓ Clicked Mark as Unread with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!buttonFound) {
      await this.page.screenshot({ path: 'test-results/mark-as-unread-not-found.png', fullPage: true });
      throw new Error('Mark as Unread button not found. Screenshot saved to test-results/mark-as-unread-not-found.png');
    }

    await this.page.waitForTimeout(1000); // Wait for action to complete
  }

  /**
   * Verify "Mark as Read" button is visible in context menu
   */
  async isMarkAsReadButtonVisible(): Promise<boolean> {
    const selectors = [
      'button:has-text("Mark as Read")',
      '[role="menuitem"]:has-text("Mark as Read")',
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

  /**
   * Verify "Mark as Unread" or "Mark Selected as Unread" button is visible in context menu
   */
  async isMarkAsUnreadButtonVisible(): Promise<boolean> {
    const selectors = [
      'button:has-text("Mark Selected as Unread")',
      'button:has-text("Mark as Unread")',
      '[role="menuitem"]:has-text("Mark as Unread")',
      '[role="menuitem"]:has-text("Mark Selected as Unread")',
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

  /**
   * Click "Apply filters" button
   * Based on: <button class="inline-flex items-center justify-center gap-2...bg-neutral-900 text-neutral-50...h-9 px-4 py-2 w-11/12 text-[10px] font-medium my-4 mx-3 rounded-b-md">Apply filters</button>
   */
  async clickApplyFilters(): Promise<void> {
    // Wait a bit for the button to be ready
    await this.page.waitForTimeout(500);

    // Try multiple selectors to find the Apply filters button
    const selectors = [
      'button:has-text("Apply filters")',
      'button.bg-neutral-900:has-text("Apply filters")',
      'button.text-neutral-50:has-text("Apply filters")',
      'button.h-9.px-4.py-2:has-text("Apply filters")',
      'button.w-11\\/12:has-text("Apply filters")',
      'button.text-\\[10px\\]:has-text("Apply filters")',
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
          console.log(`✓ Found and clicked Apply filters button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!buttonFound) {
      await this.page.screenshot({ path: 'test-results/apply-filters-not-found.png', fullPage: true });
      throw new Error('Apply filters button not found. Screenshot saved to test-results/apply-filters-not-found.png');
    }

    await this.page.waitForTimeout(1000); // Wait for action to complete
  }

  /**
   * Verify "Apply filters" button is visible
   */
  async isApplyFiltersButtonVisible(): Promise<boolean> {
    await this.page.waitForTimeout(500);

    const selectors = [
      'button:has-text("Apply filters")',
      'button.bg-neutral-900:has-text("Apply filters")',
      'button.text-neutral-50:has-text("Apply filters")',
      'button.h-9.px-4.py-2:has-text("Apply filters")',
      'button.w-11\\/12:has-text("Apply filters")',
      'button.text-\\[10px\\]:has-text("Apply filters")',
      'button:has-text("Apply filters"):visible',
    ];

    console.log('  🔍 Checking Apply filters button visibility...');

    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const count = await button.count();
        const isVisible = await button.isVisible({ timeout: 3000 }).catch(() => false);
        console.log(`    Selector "${selector}": count=${count}, visible=${isVisible}`);
        if (isVisible) {
          // Scroll into view to ensure it's actually visible
          await button.scrollIntoViewIfNeeded().catch(() => {});
          // Double-check it's still visible after scrolling
          const stillVisible = await button.isVisible({ timeout: 1000 }).catch(() => false);
          if (stillVisible) {
            console.log('  ✓ Apply filters button is visible');
            return true;
          }
        }
      } catch {
        continue;
      }
    }

    console.log('  ✗ Apply filters button NOT visible');
    await this.page.screenshot({ path: 'test-results/apply-filters-not-visible.png', fullPage: true });
    console.log('  📸 Screenshot saved: test-results/apply-filters-not-visible.png');

    return false;
  }

  /**
   * Click "Clear all" button
   * Based on: <button class="inline-flex items-center justify-center gap-2...text-[#0F66BE] h-9 px-4 py-2 text-xs">Clear all</button>
   */
  async clickClearAll(): Promise<void> {
    // Wait a bit for the button to be ready
    await this.page.waitForTimeout(500);

    // Try multiple selectors to find the Clear all button
    const selectors = [
      'button:has-text("Clear all")',
      'button.text-\\[\\#0F66BE\\]:has-text("Clear all")',
      'button.text-xs:has-text("Clear all")',
      'button.h-9.px-4.py-2:has-text("Clear all")',
      'button.underline-offset-4:has-text("Clear all")',
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
          console.log(`✓ Found and clicked Clear all button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!buttonFound) {
      await this.page.screenshot({ path: 'test-results/clear-all-not-found.png', fullPage: true });
      throw new Error('Clear all button not found. Screenshot saved to test-results/clear-all-not-found.png');
    }

    await this.page.waitForTimeout(1000); // Wait for action to complete
  }

  /**
   * Verify "Clear all" button is visible
   */
  async isClearAllButtonVisible(): Promise<boolean> {
    await this.page.waitForTimeout(500);

    const selectors = [
      'button:has-text("Clear all")',
      'button.text-\\[\\#0F66BE\\]:has-text("Clear all")',
      'button.text-xs:has-text("Clear all")',
      'button.h-9.px-4.py-2:has-text("Clear all")',
      'button.underline-offset-4:has-text("Clear all")',
      'button:has-text("Clear all"):visible',
    ];

    console.log('  🔍 Checking Clear all button visibility...');

    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        const count = await button.count();
        const isVisible = await button.isVisible({ timeout: 3000 }).catch(() => false);
        console.log(`    Selector "${selector}": count=${count}, visible=${isVisible}`);
        if (isVisible) {
          // Scroll into view to ensure it's actually visible
          await button.scrollIntoViewIfNeeded().catch(() => {});
          // Double-check it's still visible after scrolling
          const stillVisible = await button.isVisible({ timeout: 1000 }).catch(() => false);
          if (stillVisible) {
            console.log('  ✓ Clear all button is visible');
            return true;
          }
        }
      } catch {
        continue;
      }
    }

    console.log('  ✗ Clear all button NOT visible');
    await this.page.screenshot({ path: 'test-results/clear-all-not-visible.png', fullPage: true });
    console.log('  📸 Screenshot saved: test-results/clear-all-not-visible.png');

    return false;
  }
}


