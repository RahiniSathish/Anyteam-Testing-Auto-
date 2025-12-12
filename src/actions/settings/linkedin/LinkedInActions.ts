import { Page } from '@playwright/test';
import { LinkedInPage } from '../../../pages/settings/linkedin/LinkedInPage';

/**
 * Actions for LinkedIn Page interactions
 * Contains all user actions that can be performed on the LinkedIn page
 */
export class LinkedInActions {
  private linkedInPage: LinkedInPage;

  constructor(page: Page) {
    this.linkedInPage = new LinkedInPage(page);
  }

  /**
   * Click LinkedIn tab
   */
  async clickLinkedInTab(): Promise<void> {
    await this.linkedInPage.waitForLinkedInTab();
    await this.linkedInPage.linkedInTab.scrollIntoViewIfNeeded().catch(() => {});
    
    // Wait a moment for any overlays/animations to settle
    await this.linkedInPage.page.waitForTimeout(500);
    
    // Try normal click first, fallback to force click if intercepted
    try {
      await this.linkedInPage.linkedInTab.click({ timeout: 5000 });
    } catch (error) {
      // If normal click fails due to interception, use force click
      await this.linkedInPage.linkedInTab.click({ force: true });
    }
    
    await this.linkedInPage.waitForContentLoad();
  }

  /**
   * Click the LinkedIn edit icon (pencil)
   */
  async clickLinkedInEditIcon(): Promise<void> {
    await this.linkedInPage.linkedInEditIcon.waitFor({ state: 'visible', timeout: 10000 });
    await this.linkedInPage.linkedInEditIcon.scrollIntoViewIfNeeded().catch(() => {});

    // Try normal click first, fallback to force click if intercepted
    try {
      await this.linkedInPage.linkedInEditIcon.click({ timeout: 5000 });
    } catch (error) {
      await this.linkedInPage.linkedInEditIcon.click({ force: true });
    }

    // Wait for the field to become editable
    await this.linkedInPage.page.waitForTimeout(1000);
  }

  /**
   * Edit LinkedIn information
   * @param linkedInInfo - LinkedIn URL or information to enter
   */
  async editLinkedInInfo(linkedInInfo: string): Promise<void> {
    try {
      // First click the edit icon to make the field editable
      await this.clickLinkedInEditIcon();

      // Wait for the input field to be visible and editable
      await this.linkedInPage.linkedInField.waitFor({ state: 'visible', timeout: 5000 });
      await this.linkedInPage.linkedInField.scrollIntoViewIfNeeded().catch(() => {});
      await this.linkedInPage.linkedInField.clear();
      await this.linkedInPage.linkedInField.fill(linkedInInfo);
      await this.linkedInPage.page.waitForTimeout(500);
    } catch (error) {
      console.log('LinkedIn field not found, skipping...');
    }
  }

  /**
   * Save LinkedIn information
   */
  async saveLinkedInInfo(): Promise<void> {
    await this.linkedInPage.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.linkedInPage.saveButton.scrollIntoViewIfNeeded().catch(() => {});

    // Try normal click first, fallback to force click if intercepted
    try {
      await this.linkedInPage.saveButton.click({ timeout: 5000 });
    } catch (error) {
      await this.linkedInPage.saveButton.click({ force: true });
    }

    // Wait for save to complete
    await this.linkedInPage.page.waitForTimeout(2000);
  }

  /**
   * Verify LinkedIn tab is active
   */
  async verifyLinkedInTabActive(): Promise<boolean> {
    return await this.linkedInPage.isLinkedInTabActive();
  }

  /**
   * Verify LinkedIn content is displayed
   */
  async verifyLinkedInContentDisplayed(): Promise<boolean> {
    return await this.linkedInPage.isContentDisplayed();
  }
}

