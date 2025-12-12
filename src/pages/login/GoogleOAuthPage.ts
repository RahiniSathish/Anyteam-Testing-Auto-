import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Google OAuth Flow
 * Handles all Google OAuth pages: Choose account, Email input, Password input, Consent pages
 */
export class GoogleOAuthPage {
  readonly page: Page;

  // "Choose an account" page elements
  readonly chooseAccountHeading: Locator;
  readonly savedAccountOption: Locator;
  readonly useAnotherAccountLink: Locator;

  // Email input page elements
  readonly emailInput: Locator;
  readonly nextButtonAfterEmail: Locator;
  readonly createAccountButton: Locator;
  readonly forgotEmailButton: Locator;

  // Password input page elements
  readonly passwordInput: Locator;
  readonly nextButtonAfterPassword: Locator;

  // Consent page elements ("You're signing back in to anyteam.com")
  readonly consentPageHeading: Locator;
  readonly continueButton: Locator; // <span jsname="V67aGc" class="VfPpkd-vQzf8d">Continue</span>

  // Permissions page elements ("anyteam.com wants to access your Google Account")
  readonly permissionsPageHeading: Locator;
  readonly allowButton: Locator; // <span jsname="V67aGc" class="VfPpkd-vQzf8d">Allow</span>

  // Captcha elements (if appears)
  readonly captchaImage: Locator;
  readonly captchaInput: Locator;
  readonly captchaAudioButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // "Choose an account" page
    this.chooseAccountHeading = page.locator('h1:has-text("Choose an account"), span:has-text("Choose an account")');
    this.savedAccountOption = page.locator('div[role="link"][jsname="MBVUVe"]');
    this.useAnotherAccountLink = page.locator(
      'div[role="link"][jsname="rwl3qc"]:has-text("Use another account"), div.riDSKb:has-text("Use another account"), li:has-text("Use another account") div[role="link"]'
    );

    // Email input page
    this.emailInput = page.locator('input[type="email"][name="identifier"], input#identifierId, input[aria-label="Email or phone"]');
    this.nextButtonAfterEmail = page.locator(
      'button:has(span[jsname="V67aGc"]:has-text("Next")), button:has-text("Next")'
    );
    this.createAccountButton = page.locator(
      'button[jsname="LgbsSe"]:has(span[jsname="V67aGc"]:has-text("Create account")), button[type="button"]:has(span:has-text("Create account"))'
    );
    this.forgotEmailButton = page.locator('button[jsname="Cuz2Ue"]:has-text("Forgot email?")');

    // Password input page
    this.passwordInput = page.locator('input[type="password"][name="Passwd"], input[aria-label="Enter your password"]');
    this.nextButtonAfterPassword = page.locator(
      'button:has(span[jsname="V67aGc"]:has-text("Next")), button:has-text("Next")'
    );

    // Consent page ("You're signing back in to anyteam.com")
    this.consentPageHeading = page.locator('text=/You.*re signing back in/');
    // Continue button: <span jsname="V67aGc" class="VfPpkd-vQzf8d">Continue</span>
    this.continueButton = page.locator('span[jsname="V67aGc"].VfPpkd-vQzf8d:has-text("Continue")').last();

    // Permissions page ("anyteam.com wants to access your Google Account")
    this.permissionsPageHeading = page.locator('text=/wants to access your Google Account/').first();
    // Allow button: <span jsname="V67aGc" class="VfPpkd-vQzf8d">Allow</span>
    this.allowButton = page.locator('span[jsname="V67aGc"].VfPpkd-vQzf8d:has-text("Allow")').last();

    // Captcha elements
    this.captchaImage = page.locator('img#captchaimg');
    this.captchaInput = page.locator('input[name="ca"]');
    this.captchaAudioButton = page.locator('button[aria-label="Listen and type the numbers you hear"]');
  }

  /**
   * Wait for "Choose an account" page to be displayed
   */
  async waitForChooseAccountPage(): Promise<void> {
    await this.chooseAccountHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for email input page to be displayed
   */
  async waitForEmailInputPage(): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for password input page to be displayed
   */
  async waitForPasswordInputPage(): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for consent page to be displayed
   */
  async waitForConsentPage(): Promise<void> {
    await this.consentPageHeading.waitFor({ state: 'visible', timeout: 20000 });
  }

  /**
   * Wait for permissions page to be displayed
   */
  async waitForPermissionsPage(): Promise<void> {
    await this.permissionsPageHeading.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Check if "Choose an account" page is displayed
   */
  async isChooseAccountPageDisplayed(): Promise<boolean> {
    try {
      await this.chooseAccountHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.chooseAccountHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if email input page is displayed
   */
  async isEmailInputPageDisplayed(): Promise<boolean> {
    try {
      await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
      return await this.emailInput.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if "Use another account" link is visible
   */
  async isUseAnotherAccountVisible(): Promise<boolean> {
    try {
      await this.useAnotherAccountLink.waitFor({ state: 'visible', timeout: 5000 });
      return await this.useAnotherAccountLink.isVisible();
    } catch {
      return false;
    }
  }
}

