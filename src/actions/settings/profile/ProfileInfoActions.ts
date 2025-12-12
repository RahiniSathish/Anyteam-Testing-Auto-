import { Page } from '@playwright/test';
import { ProfileInfoPage } from '../../../pages/settings/profile/ProfileInfoPage';

/**
 * Actions for Profile Info Page interactions
 * Contains all user actions that can be performed on the Profile Info page
 */
export class ProfileInfoActions {
  private profileInfoPage: ProfileInfoPage;

  constructor(page: Page) {
    this.profileInfoPage = new ProfileInfoPage(page);
  }

  /**
   * Click Profile Info tab
   */
  async clickProfileInfoTab(): Promise<void> {
    await this.profileInfoPage.waitForProfileInfoTab();
    await this.profileInfoPage.profileInfoTab.scrollIntoViewIfNeeded().catch(() => {});
    
    // Wait a moment for any overlays/animations to settle
    await this.profileInfoPage.page.waitForTimeout(500);
    
    // Try normal click first, fallback to force click if intercepted
    try {
      await this.profileInfoPage.profileInfoTab.click({ timeout: 5000 });
    } catch (error) {
      // If normal click fails due to interception, use force click
      await this.profileInfoPage.profileInfoTab.click({ force: true });
    }
    
    await this.profileInfoPage.waitForContentLoad();
  }

  /**
   * Verify Profile Info tab is active
   */
  async verifyProfileInfoTabActive(): Promise<boolean> {
    return await this.profileInfoPage.isProfileInfoTabActive();
  }

  /**
   * Verify Profile Info content is displayed
   */
  async verifyProfileInfoContentDisplayed(): Promise<boolean> {
    return await this.profileInfoPage.isContentDisplayed();
  }

  /**
   * Click the edit icon (pencil) for "About yourself" field
   */
  async clickAboutYourselfEditIcon(): Promise<void> {
    // Scroll down to make sure About Yourself section is visible
    await this.profileInfoPage.page.evaluate(() => window.scrollBy(0, 300));
    await this.profileInfoPage.page.waitForTimeout(500);

    await this.profileInfoPage.aboutYourselfEditIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileInfoPage.aboutYourselfEditIcon.scrollIntoViewIfNeeded().catch(() => {});

    // Try normal click first, fallback to force click if intercepted
    try {
      await this.profileInfoPage.aboutYourselfEditIcon.click({ timeout: 5000 });
    } catch (error) {
      await this.profileInfoPage.aboutYourselfEditIcon.click({ force: true });
    }

    // Wait longer for the field to become editable
    await this.profileInfoPage.page.waitForTimeout(2000);
  }

  /**
   * Edit "About yourself" field
   * @param aboutText - Text to enter in "About yourself" field
   */
  async editAboutYourself(aboutText: string): Promise<void> {
    // Check if textarea is already visible
    const isTextareaVisible = await this.profileInfoPage.aboutYourselfField.isVisible().catch(() => false);

    if (!isTextareaVisible) {
      // Click the edit icon to make the field editable
      await this.clickAboutYourselfEditIcon();
      // Wait for the textarea to become visible
      await this.profileInfoPage.aboutYourselfField.waitFor({ state: 'visible', timeout: 10000 });
    }

    // Fill the textarea
    await this.profileInfoPage.aboutYourselfField.scrollIntoViewIfNeeded().catch(() => {});
    await this.profileInfoPage.aboutYourselfField.clear();
    await this.profileInfoPage.aboutYourselfField.fill(aboutText);
    await this.profileInfoPage.page.waitForTimeout(500);
  }

  /**
   * Save Profile Info
   */
  async saveProfileInfo(): Promise<void> {
    await this.profileInfoPage.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileInfoPage.saveButton.scrollIntoViewIfNeeded().catch(() => {});
    
    // Try normal click first, fallback to force click if intercepted
    try {
      await this.profileInfoPage.saveButton.click({ timeout: 5000 });
    } catch (error) {
      await this.profileInfoPage.saveButton.click({ force: true });
    }
    
    // Wait for save to complete
    await this.profileInfoPage.page.waitForTimeout(2000);
  }
}

