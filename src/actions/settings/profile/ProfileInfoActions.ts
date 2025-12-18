import { Page } from '@playwright/test';
import { ProfileInfoPage } from '../../../pages/settings/profile/profileInfoPage';

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

  /**
   * Verify all profile fields are visible
   * Returns an object with visibility status for each field
   */
  async verifyAllFieldsVisible(): Promise<{
    name: boolean;
    email: boolean;
    linkedIn: boolean;
    phone: boolean;
    about: boolean;
    allVisible: boolean;
  }> {
    return await this.profileInfoPage.verifyAllFieldsVisible();
  }

  /**
   * Check if all required fields are visible
   */
  async areAllRequiredFieldsVisible(): Promise<boolean> {
    return await this.profileInfoPage.areAllRequiredFieldsVisible();
  }

  /**
   * Verify pencil button (edit icon) is displayed on profile page
   */
  async verifyPencilButtonVisible(): Promise<boolean> {
    return await this.profileInfoPage.isPencilButtonVisible();
  }

  /**
   * Get count of visible pencil buttons
   */
  async getPencilButtonCount(): Promise<number> {
    return await this.profileInfoPage.getPencilButtonCount();
  }

  /**
   * Verify all profile page components are visible
   * Checks for all components: profile picture, fields, edit icons, tabs, buttons, etc.
   */
  async verifyAllComponentsVisible(): Promise<{
    profilePicture: boolean;
    nameHeading: boolean;
    nameEditIcon: boolean;
    emailHeading: boolean;
    aboutYourselfHeading: boolean;
    aboutYourselfEditIcon: boolean;
    tabsContainer: boolean;
    profileInfoTab: boolean;
    linkedAccountsTab: boolean;
    notificationsTab: boolean;
    logoutButton: boolean;
    deleteAccountButton: boolean;
    allComponentsVisible: boolean;
  }> {
    return await this.profileInfoPage.verifyAllComponentsVisible();
  }

  /**
   * Click on profile picture to trigger file input
   */
  async clickProfilePicture(): Promise<void> {
    await this.profileInfoPage.clickProfilePicture();
  }

  /**
   * Verify profile picture file input accepts only jpeg, jpg, png images (not all images)
   */
  async verifyProfilePictureFileInputAcceptsImages(): Promise<{
    fileInputExists: boolean;
    acceptAttribute: string | null;
    acceptsJpeg: boolean;
    acceptsPng: boolean;
    acceptsJpg: boolean;
    acceptsOnlyJpegJpgPng: boolean;
  }> {
    return await this.profileInfoPage.verifyProfilePictureFileInputAcceptsImages();
  }

  /**
   * Upload/change profile picture by selecting a file from local folders
   * @param filePath - Path to the image file (jpeg, jpg, or png) to upload
   *                   Example: '/path/to/image.jpg' or './test-images/profile.png'
   */
  async uploadProfilePicture(filePath: string): Promise<void> {
    // Click profile picture to trigger file input (opens file picker)
    await this.profileInfoPage.clickProfilePicture();
    
    // Wait a moment for file picker to be ready
    await this.profileInfoPage.page.waitForTimeout(1000);
    
    // Upload the file
    await this.profileInfoPage.uploadProfilePicture(filePath);
  }
}

