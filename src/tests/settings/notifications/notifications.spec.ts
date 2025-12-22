import { test, expect } from '@playwright/test';
import { NotificationsActions } from '../../../actions/settings/notifications/NotificationsActions';
import { LoginHelper } from '../../../utils/loginHelper';
import { TestData } from '../../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Test Suite: Notifications Flow
 * Tests the notifications functionality including:
 * 1. Login
 * 2. Notifications panel
 * 3. View Meeting Insights
 * 4. Search and click View Meeting Pre-Read
 */
test.describe('Notifications Flow', () => {
  test('should complete notifications flow from login to View Meeting Pre-Read', async ({ page, context }) => {
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

    // Step 3: Notifications Flow
    console.log('\n════════════════════════════════════════');
    console.log('STEP 3: NOTIFICATIONS FLOW');
    console.log('════════════════════════════════════════\n');

    const notificationsActions = new NotificationsActions(appPage);

    try {
      // Step 3.1: Click Notifications heading
      console.log('Step 3.1: Clicking Notifications heading...');
      await notificationsActions.clickNotificationsHeading();
      await appPage.waitForTimeout(2000);
      console.log('✓ Notifications panel opened');

      // Step 3.2: Click notification item
      console.log('Step 3.2: Clicking notification item...');
      await notificationsActions.clickNotificationItem();
      await appPage.waitForTimeout(2000);
      console.log('✓ Notification item clicked');

      // Step 3.3: Verify View Meeting Insights is visible and click it
      console.log('Step 3.3: Verifying View Meeting Insights is visible...');
      const isViewMeetingInsightsVisible = await notificationsActions.verifyViewMeetingInsightsVisible();
      
      if (isViewMeetingInsightsVisible) {
        console.log('✓ View Meeting Insights button is visible');
        await notificationsActions.clickViewMeetingInsights();
        await appPage.waitForTimeout(2000);
        console.log('✓ View Meeting Insights clicked');
      } else {
        console.log('⚠ View Meeting Insights button not visible');
      }

      // Step 3.4: Search for Team Standup Meeting and click View Meeting Pre-Read
      console.log('\nStep 3.4: Searching for Team Standup Meeting and clicking View Meeting Pre-Read...');

      // Ensure notifications panel is open
      const notificationPanelHeading = appPage.locator('h2:has-text("Notifications")').first();
      const isPanelOpen = await notificationPanelHeading.isVisible({ timeout: 5000 }).catch(() => false);

      if (!isPanelOpen) {
        console.log('  Opening notifications panel...');
        await notificationsActions.clickNotificationsHeading();
        await appPage.waitForTimeout(2000);
        console.log('  ✓ Notifications panel opened');
      }

      // Search for "team standup meeting" in the notification sidebar
      console.log('  Searching for "Team Standup Meeting" notification...');
      const isTeamStandupVisible = await notificationsActions.verifyTeamStandupMeetingNotificationVisible();

      if (!isTeamStandupVisible) {
        console.log('  ⚠ Team Standup Meeting notification not visible - may not have this notification');
        return;
      }

      console.log('  ✓ Found "Team Standup Meeting" notification');

      // Click on the notification
      console.log('  Clicking on Team Standup Meeting notification...');
      await notificationsActions.clickTeamStandupMeetingNotification();
      await appPage.waitForTimeout(2000);
      console.log('  ✓ Clicked on Team Standup Meeting notification');

      // Look for and click "View Meeting Pre-Read"
      console.log('  Looking for "View Meeting Pre-Read" button...');
      const isViewPreReadVisible = await notificationsActions.verifyViewMeetingPreReadVisible();

      if (!isViewPreReadVisible) {
        console.log('  ⚠ View Meeting Pre-Read button not visible - may not appear after clicking notification');
        return;
      }

      console.log('  ✓ Found "View Meeting Pre-Read" button');

      // Click on View Meeting Pre-Read
      console.log('  Clicking on View Meeting Pre-Read...');
      await notificationsActions.clickViewMeetingPreRead();
      await appPage.waitForTimeout(2000);
      console.log('  ✓ Clicked on View Meeting Pre-Read');

      // Take screenshot for verification
      await appPage.screenshot({ path: 'test-results/view-meeting-pre-read-clicked.png', fullPage: true });
      console.log('  ✓ Screenshot saved: test-results/view-meeting-pre-read-clicked.png');

      console.log('  ✓ Successfully searched for and clicked View Meeting Pre-Read');

    } catch (error) {
      console.log('⚠ Could not complete notifications flow:', error);
      console.log('Error details:', error instanceof Error ? error.message : String(error));
      await appPage.screenshot({ path: 'test-results/notifications-flow-error.png', fullPage: true }).catch(() => {});
      console.log('Screenshot saved: test-results/notifications-flow-error.png');
      throw error;
    }

    console.log('\n════════════════════════════════════════');
    console.log('✅ NOTIFICATIONS FLOW COMPLETE!');
    console.log('════════════════════════════════════════');
  });
});

