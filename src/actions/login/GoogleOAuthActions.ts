import { Page } from '@playwright/test';
import { GoogleOAuthPage } from '../../pages/login/googleOAuthPage';

/**
 * Actions for Google OAuth Flow interactions
 * Contains all user actions that can be performed during Google OAuth authentication
 */
export class GoogleOAuthActions {
  private googleOAuthPage: GoogleOAuthPage;

  constructor(page: Page) {
    this.googleOAuthPage = new GoogleOAuthPage(page);
  }

  /**
   * Click "Use another account" link on "Choose an account" page
   */
  async clickUseAnotherAccount(): Promise<void> {
    await this.googleOAuthPage.useAnotherAccountLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.googleOAuthPage.useAnotherAccountLink.click();
    await this.googleOAuthPage.page.waitForTimeout(2000);
  }

  /**
   * Enter email in Google OAuth form
   * @param email - Email address to enter
   */
  async enterEmail(email: string): Promise<void> {
    await this.googleOAuthPage.waitForEmailInputPage();
    await this.googleOAuthPage.emailInput.clear();
    await this.googleOAuthPage.emailInput.fill(email);
    await this.googleOAuthPage.page.waitForTimeout(200);
  }

  /**
   * Enter password in Google OAuth form
   * @param password - Password to enter (masked, not visible)
   */
  async enterPassword(password: string): Promise<void> {
    await this.googleOAuthPage.waitForPasswordInputPage();

    // Click the password field first to focus it
    await this.googleOAuthPage.passwordInput.click();
    await this.googleOAuthPage.page.waitForTimeout(500);

    // Clear any existing value
    await this.googleOAuthPage.passwordInput.clear();
    await this.googleOAuthPage.page.waitForTimeout(300);

    // Type the password character by character for better reliability
    await this.googleOAuthPage.passwordInput.pressSequentially(password, { delay: 100 });
    await this.googleOAuthPage.page.waitForTimeout(500);
  }

  /**
   * Click Next button after entering email
   */
  async clickNextAfterEmail(): Promise<void> {
    await this.googleOAuthPage.nextButtonAfterEmail.waitFor({ state: 'visible', timeout: 10000 });
    const isDisabled = await this.googleOAuthPage.nextButtonAfterEmail.isDisabled();
    if (isDisabled) {
      throw new Error('Next button is disabled. Please enter a valid email first.');
    }
    await this.googleOAuthPage.nextButtonAfterEmail.click();
    await this.googleOAuthPage.page.waitForTimeout(1000);
  }

  /**
   * Click Next button after entering password
   */
  async clickNextAfterPassword(): Promise<void> {
    await this.googleOAuthPage.nextButtonAfterPassword.waitFor({ state: 'visible', timeout: 10000 });
    await this.googleOAuthPage.nextButtonAfterPassword.click();
    await this.googleOAuthPage.page.waitForTimeout(1000);
  }

  /**
   * Click Continue button on consent page ("You're signing back in to anyteam.com")
   */
  async clickContinueOnConsentPage(): Promise<void> {
    // Wait for Continue button directly, don't require specific heading text
    await this.googleOAuthPage.continueButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.googleOAuthPage.continueButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.googleOAuthPage.continueButton.click({ force: true });
    await this.googleOAuthPage.page.waitForTimeout(2000);
  }

  /**
   * Click Allow button on permissions page ("anyteam.com wants to access your Google Account")
   */
  async clickAllowOnPermissionsPage(): Promise<void> {
    // Wait for Allow button directly, don't require specific heading text
    await this.googleOAuthPage.allowButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.googleOAuthPage.allowButton.scrollIntoViewIfNeeded().catch(() => {});

    // Try normal click first, fallback to force click
    try {
      await this.googleOAuthPage.allowButton.click({ timeout: 5000 });
    } catch {
      await this.googleOAuthPage.allowButton.click({ force: true });
    }
    await this.googleOAuthPage.page.waitForTimeout(2000);
  }

  /**
   * Complete full Google OAuth flow
   * @param email - Email address for login
   * @param password - Password for login
   */
  async completeOAuthFlow(email: string, password: string): Promise<void> {
    // Handle "Use another account" if it appears
    const isUseAnotherVisible = await this.googleOAuthPage.isUseAnotherAccountVisible();
    if (isUseAnotherVisible) {
      await this.clickUseAnotherAccount();
    }

    // Enter email
    await this.enterEmail(email);
    await this.clickNextAfterEmail();
    await this.googleOAuthPage.page.waitForTimeout(2000);

    // Enter password
    await this.enterPassword(password);
    await this.clickNextAfterPassword();
    await this.googleOAuthPage.page.waitForTimeout(3000);

    // Click Continue on consent page
    await this.clickContinueOnConsentPage();
    await this.googleOAuthPage.page.waitForTimeout(2000);

    // Click Allow on permissions page
    await this.clickAllowOnPermissionsPage();
    await this.googleOAuthPage.page.waitForTimeout(2000);
  }

  /**
   * Verify "Choose an account" page is displayed
   */
  async verifyChooseAccountPageDisplayed(): Promise<boolean> {
    return await this.googleOAuthPage.isChooseAccountPageDisplayed();
  }

  /**
   * Verify email input page is displayed
   */
  async verifyEmailInputPageDisplayed(): Promise<boolean> {
    return await this.googleOAuthPage.isEmailInputPageDisplayed();
  }

  /**
   * Verify "Use another account" link is visible
   */
  async isUseAnotherAccountVisible(): Promise<boolean> {
    return await this.googleOAuthPage.isUseAnotherAccountVisible();
  }
}

