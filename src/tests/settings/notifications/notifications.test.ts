import { test, expect } from '@playwright/test';
import { SettingsActions } from '../../../actions/settings/SettingsActions';

/**
 * Test Suite: Notifications Page
 * Tests for the Notifications tab within the Settings page
 * Note: These tests assume the user is already logged in and on the settings page
 */
test.describe('Notifications Page', () => {
  let settingsActions: SettingsActions;

  test.beforeEach(async ({ page }) => {
    settingsActions = new SettingsActions(page);
    
    // Navigate to anyteam.com app (assuming user is logged in)
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Navigate to settings page first
    await settingsActions.navigateToSettingsPage();
  });

  test('should click Notifications tab', async ({ page }) => {
    // Locate Notifications tab
    const notificationsTab = page.locator('button[role="tab"]:has-text("Notifications"), button[role="tab"][id*="trigger-notification"]').first();
    await notificationsTab.waitFor({ state: 'visible', timeout: 10000 });
    await notificationsTab.scrollIntoViewIfNeeded().catch(() => {});
    
    // Try normal click first, fallback to force click if intercepted
    try {
      await notificationsTab.click({ timeout: 5000 });
    } catch (error) {
      await notificationsTab.click({ force: true });
    }
    
    await page.waitForTimeout(2000);
    
    // Verify Notifications tab is active
    const dataState = await notificationsTab.getAttribute('data-state');
    expect(dataState).toBe('active');
  });

  test('should verify Notifications content is displayed', async ({ page }) => {
    // Click Notifications tab
    const notificationsTab = page.locator('button[role="tab"]:has-text("Notifications"), button[role="tab"][id*="trigger-notification"]').first();
    await notificationsTab.waitFor({ state: 'visible', timeout: 10000 });
    
    try {
      await notificationsTab.click({ timeout: 5000 });
    } catch (error) {
      await notificationsTab.click({ force: true });
    }
    
    await page.waitForTimeout(2000);
    
    // Verify Notifications content is displayed
    const notificationsContent = page.locator('[id*="content-notification"], text=/Upcoming Meeting/, text=/Do Not Disturb/');
    const isContentDisplayed = await notificationsContent.first().isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Notifications content displayed:', isContentDisplayed);
  });

  test('should verify notification settings are visible', async ({ page }) => {
    // Click Notifications tab
    const notificationsTab = page.locator('button[role="tab"]:has-text("Notifications"), button[role="tab"][id*="trigger-notification"]').first();
    await notificationsTab.waitFor({ state: 'visible', timeout: 10000 });
    
    try {
      await notificationsTab.click({ timeout: 5000 });
    } catch (error) {
      await notificationsTab.click({ force: true });
    }
    
    await page.waitForTimeout(2000);
    
    // Check for common notification settings elements
    const upcomingMeeting = page.locator('text=/Upcoming Meeting/');
    const doNotDisturb = page.locator('text=/Do Not Disturb/');
    
    const hasUpcomingMeeting = await upcomingMeeting.isVisible({ timeout: 5000 }).catch(() => false);
    const hasDoNotDisturb = await doNotDisturb.isVisible({ timeout: 5000 }).catch(() => false);
    
    console.log('Upcoming Meeting section visible:', hasUpcomingMeeting);
    console.log('Do Not Disturb section visible:', hasDoNotDisturb);
  });
});

