import { Page } from '@playwright/test';
import { SettingsPage } from '../../pages/settings/SettingsPage';

/**
 * Actions for Settings Page interactions
 * Contains all user actions that can be performed on the settings page
 */
export class SettingsActions {
  private settingsPage: SettingsPage;

  constructor(page: Page) {
    this.settingsPage = new SettingsPage(page);
  }

  /**
   * Navigate to settings page by clicking Settings button
   */
  async navigateToSettingsPage(): Promise<void> {
    await this.settingsPage.goto();
    await this.settingsPage.waitForPageLoad();
  }

  /**
   * Click Profile Info tab
   */
  async clickProfileInfoTab(): Promise<void> {
    await this.settingsPage.profileInfoTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.settingsPage.profileInfoTab.scrollIntoViewIfNeeded().catch(() => {});
    await this.settingsPage.profileInfoTab.click();
    await this.settingsPage.page.waitForTimeout(2000);
  }

  /**
   * Verify settings page is displayed
   */
  async verifySettingsPageDisplayed(): Promise<boolean> {
    return await this.settingsPage.isDisplayed();
  }

  /**
   * Verify Settings button is visible in sidebar
   */
  async verifySettingsButtonVisible(): Promise<boolean> {
    return await this.settingsPage.isSettingsButtonVisible();
  }

  /**
   * Verify Profile Info tab is active
   */
  async verifyProfileInfoTabActive(): Promise<boolean> {
    try {
      const dataState = await this.settingsPage.profileInfoTab.getAttribute('data-state');
      return dataState === 'active';
    } catch {
      return false;
    }
  }
}

