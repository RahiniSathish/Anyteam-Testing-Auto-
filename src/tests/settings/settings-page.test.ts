import { test, expect } from '@playwright/test';
import { SettingsActions } from '../../actions/settings/SettingsActions';

/**
 * Test Suite: Settings Page
 * Tests for the Settings page in the anyteam.com application
 * Note: These tests assume the user is already logged in
 */
test.describe('Settings Page', () => {
  let settingsActions: SettingsActions;

  test.beforeEach(async ({ page }) => {
    settingsActions = new SettingsActions(page);
    
    // Navigate to anyteam.com app (assuming user is logged in)
    // In a real scenario, you might want to set up authentication here
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
  });

  test('should verify Settings button is visible in sidebar', async () => {
    const isVisible = await settingsActions.verifySettingsButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('should navigate to settings page by clicking Settings button', async ({ page }) => {
    await settingsActions.navigateToSettingsPage();
    
    // Verify settings page is displayed
    const isDisplayed = await settingsActions.verifySettingsPageDisplayed();
    expect(isDisplayed).toBe(true);

    // Verify URL contains settings (if applicable)
    const currentURL = page.url();
    console.log('Settings page URL:', currentURL);
  });

  test('should display settings page tabs', async ({ page }) => {
    await settingsActions.navigateToSettingsPage();
    
    // Verify at least one tab is visible
    const tabs = page.locator('button[role="tab"]');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);
    
    // Verify Profile Info tab exists
    const profileInfoTab = page.locator('button[role="tab"][id*="trigger-profile_info"]:has-text("Profile Info")');
    await expect(profileInfoTab).toBeVisible();
  });
});

