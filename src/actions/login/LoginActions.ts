import { Page, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';

/**
 * Actions for Login Page interactions
 * Contains all user actions that can be performed on the login page
 */
export class LoginActions {
  private loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.waitForPageLoad();
  }

  /**
   * Click on "Continue with Google" button
   * Handles popup window or navigation that may occur
   * Waits for either "Choose an account" page or email input page
   */
  async clickContinueWithGoogle(): Promise<void> {
    // Wait for popup or click button
    const popupPromise = this.loginPage.page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    await this.loginPage.continueWithGoogleButton.click();
    
    // Wait for either popup or navigation in current page
    const popup = await popupPromise;
    
    if (popup) {
      // Popup opened - wait for Google page to load
      await popup.waitForLoadState('domcontentloaded');
      // Wait for either "Choose an account" heading or email input
      try {
        await Promise.race([
          popup.locator('h1:has-text("Choose an account")').waitFor({ state: 'visible', timeout: 10000 }),
          popup.locator('input[type="email"][name="identifier"]').waitFor({ state: 'visible', timeout: 10000 })
        ]);
      } catch {
        // Fallback: just wait for page to be ready
        await popup.waitForLoadState('networkidle', { timeout: 10000 });
      }
    } else {
      // No popup - wait in current page
      try {
        await Promise.race([
          this.loginPage.chooseAccountHeading.waitFor({ state: 'visible', timeout: 10000 }),
          this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 10000 })
        ]);
      } catch {
        // If neither found, wait for Google OAuth URL
        await this.loginPage.page.waitForURL('**/accounts.google.com/**', { timeout: 10000 });
      }
    }
  }

  /**
   * Enter email in Google OAuth form
   * @param email - Email address to enter
   */
  async enterEmail(email: string): Promise<void> {
    await this.loginPage.emailInput.waitFor({ state: 'visible' });
    // Clear any existing value first
    await this.loginPage.emailInput.clear();
    // Fill the email
    await this.loginPage.emailInput.fill(email);
    // Wait a bit for the input to be processed
    await this.loginPage.page.waitForTimeout(500);
  }

  /**
   * Enter password in Google OAuth form
   * @param password - Password to enter (will not be visible in logs)
   */
  async enterPassword(password: string): Promise<void> {
    await this.loginPage.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    // Clear any existing value first
    await this.loginPage.passwordInput.clear();
    // Fill the password (input type is password, so it's masked)
    await this.loginPage.passwordInput.fill(password);
    // Wait for input to be processed
    await this.loginPage.page.waitForTimeout(500);
  }

  /**
   * Click Next button in Google OAuth form
   * Waits for button to be visible and enabled before clicking
   */
  async clickNext(): Promise<void> {
    await this.loginPage.nextButton.waitFor({ state: 'visible', timeout: 10000 });
    // Wait for button to be enabled (not disabled)
    await this.loginPage.nextButton.waitFor({ state: 'attached' });
    // Verify button is enabled
    const isDisabled = await this.loginPage.nextButton.isDisabled();
    if (isDisabled) {
      throw new Error('Next button is disabled. Please enter a valid email first.');
    }
    await this.loginPage.nextButton.click();
    // Wait a bit for the action to process
    await this.loginPage.page.waitForTimeout(1000);
  }

  /**
   * Verify Next button is visible and enabled
   */
  async isNextButtonEnabled(): Promise<boolean> {
    try {
      await this.loginPage.nextButton.waitFor({ state: 'visible', timeout: 5000 });
      return !(await this.loginPage.nextButton.isDisabled());
    } catch {
      return false;
    }
  }

  /**
   * Click "Use another account" link
   * This is a clickable div with role="link" that appears on "Choose an account" page
   */
  async clickUseAnotherAccount(): Promise<void> {
    // Wait for the "Use another account" link to be visible
    // This appears on the "Choose an account" page after clicking Continue with Google
    await this.loginPage.useAnotherAccountLink.waitFor({ state: 'visible', timeout: 10000 });
    // Verify it's clickable
    await expect(this.loginPage.useAnotherAccountLink).toBeVisible();
    // Click the link
    await this.loginPage.useAnotherAccountLink.click();
    // Wait for email input to appear after clicking
    await this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click "Create account" button
   */
  async clickCreateAccount(): Promise<void> {
    await this.loginPage.createAccountButton.waitFor({ state: 'visible' });
    await this.loginPage.createAccountButton.click();
  }

  /**
   * Click "Forgot email?" button
   */
  async clickForgotEmail(): Promise<void> {
    await this.loginPage.forgotEmailButton.waitFor({ state: 'visible' });
    await this.loginPage.forgotEmailButton.click();
  }

  /**
   * Complete Google OAuth login flow
   * @param email - Email address for login
   */
  async loginWithGoogle(email: string): Promise<void> {
    await this.clickContinueWithGoogle();
    await this.enterEmail(email);
    await this.clickNext();
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed(): Promise<boolean> {
    return await this.loginPage.isDisplayed();
  }

  /**
   * Verify Google OAuth form is displayed
   */
  async verifyGoogleOAuthFormDisplayed(): Promise<boolean> {
    return await this.loginPage.isGoogleOAuthFormDisplayed();
  }

  /**
   * Verify "Choose an account" page is displayed
   */
  async verifyChooseAccountPageDisplayed(): Promise<boolean> {
    try {
      await this.loginPage.chooseAccountHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.loginPage.chooseAccountHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify "Use another account" link is visible
   */
  async isUseAnotherAccountVisible(): Promise<boolean> {
    try {
      await this.loginPage.useAnotherAccountLink.waitFor({ state: 'visible', timeout: 5000 });
      return await this.loginPage.useAnotherAccountLink.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Click on Terms of Service link
   */
  async clickTermsOfService(): Promise<void> {
    await this.loginPage.termsOfServiceLink.click();
  }

  /**
   * Click on Privacy Policy link
   */
  async clickPrivacyPolicy(): Promise<void> {
    await this.loginPage.privacyPolicyLink.click();
  }

  /**
   * Get the text of business email hint
   */
  async getBusinessEmailHintText(): Promise<string | null> {
    return await this.loginPage.businessEmailHint.textContent();
  }

  /**
   * Check if business email hint is visible
   */
  async isBusinessEmailHintVisible(): Promise<boolean> {
    return await this.loginPage.businessEmailHint.isVisible();
  }
}

