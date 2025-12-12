import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Settings Page
 * Represents the Settings page in the anyteam.com application
 */
export class SettingsPage {
  readonly page: Page;

  // Sidebar elements
  readonly settingsButton: Locator; // Settings button in sidebar

  // Settings page tabs
  readonly profileInfoTab: Locator;
  readonly otherTabs: Locator; // For future tabs if needed

  constructor(page: Page) {
    this.page = page;

    // Settings button in sidebar: <button data-sidebar="menu-button"> containing <h5>Settings</h5>
    this.settingsButton = page.locator('button[data-sidebar="menu-button"]:has(h5:has-text("Settings"))');

    // Profile Info tab: <button role="tab" id="radix-*-trigger-profile_info">Profile Info</button>
    this.profileInfoTab = page.locator('button[role="tab"][id*="trigger-profile_info"]:has-text("Profile Info")');
    this.otherTabs = page.locator('button[role="tab"]');
  }

  /**
   * Navigate to settings page by clicking Settings button
   */
  async goto(): Promise<void> {
    await this.settingsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.settingsButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.settingsButton.click();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  }

  /**
   * Wait for settings page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for at least one tab to be visible
    await this.otherTabs.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check if settings page is displayed
   */
  async isDisplayed(): Promise<boolean> {
    try {
      await this.waitForPageLoad();
      return await this.otherTabs.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if Settings button is visible in sidebar
   */
  async isSettingsButtonVisible(): Promise<boolean> {
    try {
      await this.settingsButton.waitFor({ state: 'visible', timeout: 5000 });
      return await this.settingsButton.isVisible();
    } catch {
      return false;
    }
  }
}

