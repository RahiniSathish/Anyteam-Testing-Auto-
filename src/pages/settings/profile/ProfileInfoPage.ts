import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Profile Info Page
 * Represents the Profile Info tab within the Settings page
 */
export class ProfileInfoPage {
  readonly page: Page;

  // Profile Info tab
  readonly profileInfoTab: Locator;

  // Profile Info form elements
  readonly profileInfoContent: Locator;
  readonly aboutYourselfEditIcon: Locator; // Pencil/edit icon for "About yourself"
  readonly aboutYourselfField: Locator; // Textarea or input for "About yourself"
  readonly saveButton: Locator; // Save button for Profile Info

  constructor(page: Page) {
    this.page = page;

    // Profile Info tab: <button role="tab" id="radix-*-trigger-profile_info">Profile Info</button>
    this.profileInfoTab = page.locator('button[role="tab"][id*="trigger-profile_info"]:has-text("Profile Info")');

    // Profile Info content area
    this.profileInfoContent = page.locator('[id*="content-profile_info"]');

    // About yourself edit icon - pencil icon (lucide-pencil class)
    // Using last() to get the last pencil icon on the page (About yourself should be last)
    this.aboutYourselfEditIcon = page.locator('button:has(svg.lucide-pencil)').last();

    // About yourself field - exact match: <textarea name="about">
    this.aboutYourselfField = page.locator('textarea[name="about"]');

    // Save button - exact match: <button class="text-sm flex items-center underline underline-offset-2">Save</button>
    this.saveButton = page.locator('button.text-sm.flex.items-center.underline.underline-offset-2:has-text("Save")').first();
  }

  /**
   * Wait for Profile Info tab to be visible
   */
  async waitForProfileInfoTab(): Promise<void> {
    await this.profileInfoTab.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for Profile Info content to be loaded
   */
  async waitForContentLoad(): Promise<void> {
    await this.page.waitForTimeout(2000);
    // Add more specific waits as needed when form elements are identified
  }

  /**
   * Check if Profile Info tab is active
   */
  async isProfileInfoTabActive(): Promise<boolean> {
    try {
      const dataState = await this.profileInfoTab.getAttribute('data-state');
      return dataState === 'active';
    } catch {
      return false;
    }
  }

  /**
   * Check if Profile Info content is displayed
   */
  async isContentDisplayed(): Promise<boolean> {
    try {
      return await this.profileInfoContent.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }
}

