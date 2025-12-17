import { Page, Locator } from '@playwright/test';
import { TestData } from '../../utils/TestData';

/**
 * Page Object Model for the Login Page
 * Represents the login page at /onboarding/Login
 */
export class LoginPage {
  readonly page: Page;
  
  // Main elements
  readonly anyteamLogo: Locator;
  readonly continueWithGoogleButton: Locator; // Targets the clickable <p> element
  readonly continueWithGoogleButtonParent: Locator; // Parent button element for styling checks
  readonly businessEmailHint: Locator;
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;
  
  // Google OAuth elements (appear after clicking Continue with Google)
  // "Choose an account" page elements
  readonly chooseAccountHeading: Locator;
  readonly savedAccountOption: Locator;
  readonly useAnotherAccountLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly createAccountButton: Locator;
  readonly forgotEmailButton: Locator;
  readonly captchaImage: Locator;
  readonly captchaInput: Locator;
  readonly captchaAudioButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Main login page elements
    // Target the main logo in the login form (not the header logo)
    // The header logo has 'absolute' class, so we target the one without it (the main form logo)
    this.anyteamLogo = page.locator('img[alt="anyteam-logo"]:not(.absolute)');
    // Target the clickable p element with classes: text-[16px] leading-[22px] font-[500]
    // Button structure: <button class="... bg-black ..."><img alt="logo-google" .../><p class="text-[16px] leading-[22px] font-[500]">Continue with Google</p></button>
    // This is the actual clickable element: <p class="text-[16px] leading-[22px] font-[500]">Continue with Google</p>
    this.continueWithGoogleButton = page.locator('p:has-text("Continue with Google")');
    // Parent button element for styling and dimension checks (w-[276px] h-[42px] bg-black)
    this.continueWithGoogleButtonParent = this.continueWithGoogleButton.locator('..');
    this.businessEmailHint = page.locator('h6:has-text("Use business email to unlock more features")');
    this.termsOfServiceLink = page.locator('span:has-text("terms of service")');
    this.privacyPolicyLink = page.locator('span:has-text("privacy policy")');
    
    // Google OAuth elements (appear after clicking Continue with Google)
    // "Choose an account" page
    this.chooseAccountHeading = page.locator('h1:has-text("Choose an account"), span:has-text("Choose an account")');
    this.savedAccountOption = page.locator('div[role="link"][jsname="MBVUVe"]');
    // Use another account clickable div
    // Structure: <li class="aZvCDf mIVEJc W7Aapd zpCp3 SmR8">
    //              <div class="VV3oRb YZVTmd SmR8" role="link" tabindex="0" jsname="rwl3qc">
    //                <div class="CvsT4e"><div class="riDSKb">Use another account</div></div>
    //              </div>
    //            </li>
    // Target the parent div with role="link" and jsname="rwl3qc" for reliable clicking
    this.useAnotherAccountLink = page.locator('div[role="link"][jsname="rwl3qc"]:has-text("Use another account"), div.riDSKb:has-text("Use another account"), li:has-text("Use another account") div[role="link"]');
    // Email input field - using multiple selectors for reliability
    this.emailInput = page.locator('input[type="email"][name="identifier"], input#identifierId, input[aria-label="Email or phone"]');
    // Password input field
    this.passwordInput = page.locator('input[type="password"][name="Passwd"], input[aria-label="Enter your password"]');
    // Next button - target button with jsname="LgbsSe" that contains span with "Next" text
    // Using multiple selectors for reliability
    this.nextButton = page.locator('button[jsname="LgbsSe"]:has(span[jsname="V67aGc"]:has-text("Next")), button:has(span[jsname="V67aGc"]:has-text("Next")), button:has-text("Next")');
    this.createAccountButton = page.locator('button[jsname="LgbsSe"]:has(span[jsname="V67aGc"]:has-text("Create account")), button[type="button"]:has(span:has-text("Create account"))');
    this.forgotEmailButton = page.locator('button[jsname="Cuz2Ue"]:has-text("Forgot email?")');
    this.captchaImage = page.locator('img#captchaimg');
    this.captchaInput = page.locator('input[name="ca"]');
    this.captchaAudioButton = page.locator('button[aria-label="Listen and type the numbers you hear"]');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto(`${TestData.urls.base}${TestData.urls.login}`);
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      // Page may have redirected or closed during navigation - wait for domcontentloaded instead
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => {});
    }
  }

  /**
   * Wait for the login page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.anyteamLogo.waitFor({ state: 'visible' });
    await this.continueWithGoogleButton.waitFor({ state: 'visible' });
  }

  /**
   * Check if the login page is displayed
   */
  async isDisplayed(): Promise<boolean> {
    try {
      await this.waitForPageLoad();
      return await this.anyteamLogo.isVisible() && await this.continueWithGoogleButton.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if Google OAuth form is displayed
   */
  async isGoogleOAuthFormDisplayed(): Promise<boolean> {
    try {
      await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
      return await this.emailInput.isVisible();
    } catch {
      return false;
    }
  }
}

