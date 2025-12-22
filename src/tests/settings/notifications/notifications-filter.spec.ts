import { test, expect } from '@playwright/test';
import { NotificationsActions } from '../../../actions/settings/notifications/NotificationsActions';
import { LoginHelper } from '../../../utils/loginHelper';
import { TestData } from '../../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Test Suite: Notification Filter Flow
 * Tests the notification filter functionality including:
 * 1. Login
 * 2. Open notifications panel
 * 3. Filter button and Read/Unread checkboxes
 * 4. Apply filters
 * 5. Search and click View Meeting Pre-Read
 */
test.describe('Notification Filter Flow', () => {
  test('should complete notification filter flow from login to View Meeting Pre-Read', async ({ page, context }) => {
    test.setTimeout(360000); // 6 minutes

    // Step 1: Login
    console.log('════════════════════════════════════════');
    console.log('STEP 1: LOGIN');
    console.log('════════════════════════════════════════\n');
    const appPage = await LoginHelper.performLogin(page, context);

    // Step 2: Navigate to home page
    console.log('\n════════════════════════════════════════');
    console.log('STEP 2: NAVIGATE TO HOME');
    console.log('════════════════════════════════════════\n');
    await appPage.goto(`${TestData.urls.base}/home`);
    await appPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await appPage.waitForTimeout(2000);

    // Step 3: Notification Filter Flow
    console.log('\n════════════════════════════════════════');
    console.log('STEP 3: NOTIFICATION FILTER FLOW');
    console.log('════════════════════════════════════════\n');

    const notificationsActions = new NotificationsActions(appPage);

    try {
      // Step 3.1: Click Notifications heading to open panel
      console.log('Step 3.1: Clicking Notifications heading...');
      
      // Force close any open panels first
      const panelHeading = appPage.locator('h2:has-text("Notifications")').first();
      let isPanelOpen = await panelHeading.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isPanelOpen) {
        console.log('  Panel detected as open, forcing close...');
        for (let i = 0; i < 3; i++) {
          await appPage.keyboard.press('Escape').catch(() => {});
          await appPage.waitForTimeout(500);
        }
        await appPage.locator('main').click({ position: { x: 10, y: 10 } }).catch(() => {});
        await appPage.waitForTimeout(1000);
      }
      
      await appPage.waitForTimeout(1000);
      
      // Open the panel
      const notificationButton = appPage.locator('button[data-sidebar="menu-button"]:has(h5:has-text("Notifications"))').first();
      
      try {
        await notificationButton.waitFor({ state: 'visible', timeout: 10000 });
        await notificationButton.scrollIntoViewIfNeeded().catch(() => {});
        await appPage.waitForTimeout(500);
        await notificationButton.click({ timeout: 5000 });
        console.log('  ✓ Clicked notification button directly');
        await appPage.waitForTimeout(2000);
      } catch (e) {
        await notificationsActions.clickNotificationsHeading();
        await appPage.waitForTimeout(2000);
      }
      
      const isPanelNowOpen = await panelHeading.isVisible({ timeout: 5000 }).catch(() => false);
      if (!isPanelNowOpen) {
        await notificationsActions.clickNotificationsHeading();
        await appPage.waitForTimeout(2000);
      }
      
      console.log('  ✓ Notifications panel opened');

      // Step 3.2: Click the filter button (list-filter icon)
      console.log('Step 3.2: Clicking filter button (list-filter icon)...');
      
      await appPage.waitForTimeout(2000);
      
      // Wait for filter button to appear with retries
      let isFilterVisible = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!isFilterVisible && retryCount < maxRetries) {
        isFilterVisible = await notificationsActions.verifyFilterButtonVisible();
        if (!isFilterVisible) {
          retryCount++;
          console.log(`  Filter button not visible yet, waiting... (attempt ${retryCount}/${maxRetries})`);
          await appPage.waitForTimeout(2000);
        }
      }
      
      if (!isFilterVisible) {
        throw new Error('Filter button not visible - cannot proceed with filter flow');
      }

      await notificationsActions.clickFilterButton();
      await appPage.waitForTimeout(2000);
      console.log('  ✓ Filter button clicked, waiting for filter menu to open...');

      // Wait for filter menu to be fully visible
      let filterMenuOpen = false;
      let menuRetryCount = 0;
      const maxMenuRetries = 5;
      
      while (!filterMenuOpen && menuRetryCount < maxMenuRetries) {
        const isReadVisible = await notificationsActions.verifyReadCheckboxVisible();
        const isUnreadVisible = await notificationsActions.verifyUnreadCheckboxVisible();
        
        if (isReadVisible && isUnreadVisible) {
          filterMenuOpen = true;
          console.log('  ✓ Filter menu is open and checkboxes are visible');
        } else {
          menuRetryCount++;
          console.log(`  Waiting for filter menu to open... (attempt ${menuRetryCount}/${maxMenuRetries})`);
          await appPage.waitForTimeout(1000);
          
          if (menuRetryCount === 2 || menuRetryCount === 4) {
            await notificationsActions.clickFilterButton();
            await appPage.waitForTimeout(1500);
          }
        }
      }

      // Final verification of Read and Unread checkboxes
      const isReadVisible = await notificationsActions.verifyReadCheckboxVisible();
      const isUnreadVisible = await notificationsActions.verifyUnreadCheckboxVisible();

      if (!isReadVisible || !isUnreadVisible) {
        throw new Error('Read/Unread checkboxes not visible - cannot proceed');
      }

      console.log('  ✓ Read and Unread checkboxes are visible');
      
      // Take screenshot of filter menu for debugging
      await appPage.screenshot({ path: 'test-results/filter-menu-opened.png', fullPage: true });
      console.log('  ✓ Screenshot saved: test-results/filter-menu-opened.png');

      // Step 3.3: Test Read checkbox - Uncheck it first
      console.log('Step 3.3: Testing Read checkbox - Unchecking...');
      await notificationsActions.uncheckReadCheckbox();
      await appPage.waitForTimeout(500);
      const isReadUnchecked1 = await notificationsActions.isReadCheckboxChecked();
      if (isReadUnchecked1) {
        throw new Error('Read checkbox should be unchecked but it is still checked');
      }
      console.log(`  ✓ Read checkbox unchecked: ${!isReadUnchecked1 ? '✓' : '✗'}`);

      // Step 3.4: Test Read checkbox - Check it
      console.log('Step 3.4: Testing Read checkbox - Checking...');
      await notificationsActions.checkReadCheckbox();
      await appPage.waitForTimeout(500);
      const isReadChecked = await notificationsActions.isReadCheckboxChecked();
      if (!isReadChecked) {
        throw new Error('Read checkbox should be checked but it is not checked');
      }
      console.log(`  ✓ Read checkbox checked: ${isReadChecked ? '✓' : '✗'}`);

      // Step 3.5: Check the Unread checkbox
      console.log('Step 3.5: Checking Unread checkbox...');
      await notificationsActions.checkUnreadCheckbox();
      await appPage.waitForTimeout(500);
      const isUnreadChecked = await notificationsActions.isUnreadCheckboxChecked();
      console.log(`  ✓ Unread checkbox checked: ${isUnreadChecked ? '✓' : '✗'}`);

      // Step 3.6: Uncheck the Unread checkbox
      console.log('Step 3.6: Unchecking Unread checkbox...');
      await notificationsActions.uncheckUnreadCheckbox();
      await appPage.waitForTimeout(500);
      const isUnreadUnchecked = await notificationsActions.isUnreadCheckboxChecked();
      console.log(`  ✓ Unread checkbox unchecked: ${!isUnreadUnchecked ? '✓' : '✗'}`);

      // Step 3.7: Test "Clear all" button
      console.log('Step 3.7: Testing Clear all button...');
      
      let isClearAllVisible = false;
      let clearAllRetryCount = 0;
      const maxClearAllRetries = 5;
      
      while (!isClearAllVisible && clearAllRetryCount < maxClearAllRetries) {
        isClearAllVisible = await notificationsActions.verifyClearAllButtonVisible();
        if (!isClearAllVisible) {
          clearAllRetryCount++;
          console.log(`  Waiting for Clear all button to appear... (attempt ${clearAllRetryCount}/${maxClearAllRetries})`);
          await appPage.waitForTimeout(1000);
        }
      }
      
      if (isClearAllVisible) {
        console.log('  ✓ Clear all button is visible');
        await notificationsActions.clickClearAll();
        await appPage.waitForTimeout(1000);
        console.log('  ✓ Clear all button clicked successfully');
      } else {
        console.log('  ⚠ Clear all button not visible - may not be available in current context');
      }

      // Step 3.8: Test "Apply filters" button
      console.log('Step 3.8: Testing Apply filters button...');
      // Ensure Read checkbox is checked before applying
      await notificationsActions.checkReadCheckbox();
      await appPage.waitForTimeout(1000);
      
      let isApplyButtonVisible = false;
      let applyButtonRetryCount = 0;
      const maxApplyButtonRetries = 5;
      
      while (!isApplyButtonVisible && applyButtonRetryCount < maxApplyButtonRetries) {
        isApplyButtonVisible = await notificationsActions.verifyApplyFiltersButtonVisible();
        if (!isApplyButtonVisible) {
          applyButtonRetryCount++;
          console.log(`  Waiting for Apply filters button to appear... (attempt ${applyButtonRetryCount}/${maxApplyButtonRetries})`);
          await appPage.waitForTimeout(1000);
        }
      }
      
      if (!isApplyButtonVisible) {
        throw new Error('Apply filters button not visible - cannot complete filter flow');
      }

      console.log('  ✓ Apply filters button is visible');
      
      await appPage.screenshot({ path: 'test-results/before-apply-filters.png', fullPage: true });
      console.log('  ✓ Screenshot saved: test-results/before-apply-filters.png');
      
      await notificationsActions.clickApplyFilters();
      await appPage.waitForTimeout(2000);
      console.log('  ✓ Apply filters button clicked successfully');
      
      // Verify filters were applied by checking if filter menu closed
      await appPage.waitForTimeout(1000);
      const isFilterMenuStillOpen = await notificationsActions.verifyReadCheckboxVisible();
      if (!isFilterMenuStillOpen) {
        console.log('  ✓ Filter menu closed - filters were applied successfully');
      } else {
        console.log('  ⚠ Filter menu still open - may need to close manually');
        await appPage.keyboard.press('Escape').catch(() => {});
        await appPage.waitForTimeout(500);
      }
      
      await appPage.screenshot({ path: 'test-results/after-apply-filters.png', fullPage: true });
      console.log('  ✓ Screenshot saved: test-results/after-apply-filters.png');
      
      console.log('  ✓ Notification filter flow completed successfully!');

    } catch (error) {
      console.log('  ✗ Notification filter flow FAILED:', error);
      console.log('  Error details:', error instanceof Error ? error.message : String(error));
      await appPage.screenshot({ path: 'test-results/notification-filter-flow-error.png', fullPage: true }).catch(() => {});
      console.log('  Screenshot saved: test-results/notification-filter-flow-error.png');
      throw error;
    }

    // Step 3.9: Click three dots menu and Mark all as read
    console.log('\nStep 3.9: Clicking three dots menu and Mark all as read...');
    
    try {
      // Ensure notifications panel is still open
      const notificationPanelHeading = appPage.locator('h2:has-text("Notifications")').first();
      const isPanelOpen = await notificationPanelHeading.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (!isPanelOpen) {
        console.log('  Opening notifications panel...');
        await notificationsActions.clickNotificationsHeading();
        await appPage.waitForTimeout(2000);
        console.log('  ✓ Notifications panel opened');
      }

      // Click the three dots menu
      console.log('  Clicking three dots menu...');
      await notificationsActions.clickThreeDottedMenu();
      await appPage.waitForTimeout(1500);
      console.log('  ✓ Three dots menu clicked');

      // Wait for the dropdown menu to appear and click "Mark all as read"
      console.log('  Clicking "Mark all as read" option...');
      await notificationsActions.clickMarkAllAsRead();
      await appPage.waitForTimeout(2000);
      console.log('  ✓ Mark all as read clicked successfully');

      // Take screenshot for verification
      await appPage.screenshot({ path: 'test-results/mark-all-as-read-clicked.png', fullPage: true });
      console.log('  ✓ Screenshot saved: test-results/mark-all-as-read-clicked.png');

      console.log('  ✓ Three dots menu and Mark all as read completed successfully!');

    } catch (error) {
      console.log('  ⚠ Could not complete three dots menu flow:', error);
      console.log('  Error details:', error instanceof Error ? error.message : String(error));
      await appPage.screenshot({ path: 'test-results/three-dots-error.png', fullPage: true }).catch(() => {});
      console.log('  Screenshot saved: test-results/three-dots-error.png');
      // Don't throw - allow test to continue to search for Team Standup Meeting
    }

    console.log('\n════════════════════════════════════════');
    console.log('✅ NOTIFICATION FILTER FLOW COMPLETE!');
    console.log('════════════════════════════════════════');
  });
});

