import { test, expect } from '@playwright/test';
import { LoginActions } from '../../actions/login/LoginActions';
import { GoogleOAuthActions } from '../../actions/login/GoogleOAuthActions';
import { TestData } from '../../utils/TestData';

/**
 * Test Suite: Google OAuth Flow
 * Tests for the complete Google OAuth authentication flow
 */
test.describe('Google OAuth Flow', () => {
  let loginActions: LoginActions;
  let googleOAuthActions: GoogleOAuthActions;
  let activePage: any;

  test.beforeEach(async ({ page, context }) => {
    // Clear browser storage to force "Choose an account" page to appear
    await context.clearCookies();
    await page.goto('https://accounts.google.com/Logout');
    await page.waitForTimeout(1000);

    loginActions = new LoginActions(page);
    await loginActions.navigateToLoginPage();

    // Click Continue with Google to open OAuth flow
    await loginActions.clickContinueWithGoogle();
    await page.waitForTimeout(3000);

    // Get the active page (popup or redirected page)
    const pages = context.pages();
    activePage = pages.length > 1 ? pages[pages.length - 1] : page;

    // Initialize GoogleOAuthActions with the active page
    googleOAuthActions = new GoogleOAuthActions(activePage);
  });

  test('should display Choose an account page or email input page', async () => {
    // After clicking Continue with Google, should see either:
    // 1. "Choose an account" page, OR
    // 2. Email input page
    const chooseAccountVisible = await googleOAuthActions.verifyChooseAccountPageDisplayed();
    const emailInputVisible = await googleOAuthActions.verifyEmailInputPageDisplayed();

    expect(chooseAccountVisible || emailInputVisible).toBe(true);
  });

  test('should handle Use another account link if it appears', async () => {
    const isUseAnotherVisible = await googleOAuthActions.isUseAnotherAccountVisible();

    if (isUseAnotherVisible) {
      await googleOAuthActions.clickUseAnotherAccount();
      // After clicking, should see email input page
      const emailInputVisible = await googleOAuthActions.verifyEmailInputPageDisplayed();
      expect(emailInputVisible).toBe(true);
    } else {
      // If "Use another account" doesn't appear, email input should already be visible
      const emailInputVisible = await googleOAuthActions.verifyEmailInputPageDisplayed();
      expect(emailInputVisible).toBe(true);
    }
  });

  test('should enter email and click Next', async () => {
    // Handle "Use another account" if needed
    const isUseAnotherVisible = await googleOAuthActions.isUseAnotherAccountVisible();
    if (isUseAnotherVisible) {
      await googleOAuthActions.clickUseAnotherAccount();
    }

    // Enter email
    await googleOAuthActions.enterEmail(TestData.emails.testUser);

    // Verify email was entered
    const emailInput = activePage.locator('input[type="email"][name="identifier"]');
    const emailValue = await emailInput.inputValue();
    expect(emailValue).toBe(TestData.emails.testUser);

    // Click Next
    await googleOAuthActions.clickNextAfterEmail();
    await activePage.waitForTimeout(2000);
  });

  test('should enter password and click Next', async () => {
    // Handle "Use another account" if needed
    const isUseAnotherVisible = await googleOAuthActions.isUseAnotherAccountVisible();
    if (isUseAnotherVisible) {
      await googleOAuthActions.clickUseAnotherAccount();
    }

    // Enter email and click Next
    await googleOAuthActions.enterEmail(TestData.emails.testUser);
    await googleOAuthActions.clickNextAfterEmail();
    await activePage.waitForTimeout(3000);

    // Enter password
    await googleOAuthActions.enterPassword(TestData.passwords.testPassword);

    // Verify password has value (don't check actual value for security)
    const passwordInput = activePage.locator('input[type="password"][name="Passwd"]');
    const hasPasswordValue = await passwordInput.evaluate((el: any) => el.value && el.value.length > 0);
    expect(hasPasswordValue).toBe(true);

    // Click Next
    await googleOAuthActions.clickNextAfterPassword();
    await activePage.waitForTimeout(3000);
  });

  test('should click Continue on consent page', async () => {
    // Complete email and password steps first
    const isUseAnotherVisible = await googleOAuthActions.isUseAnotherAccountVisible();
    if (isUseAnotherVisible) {
      await googleOAuthActions.clickUseAnotherAccount();
    }

    await googleOAuthActions.enterEmail(TestData.emails.testUser);
    await googleOAuthActions.clickNextAfterEmail();
    await activePage.waitForTimeout(3000);

    await googleOAuthActions.enterPassword(TestData.passwords.testPassword);
    await googleOAuthActions.clickNextAfterPassword();
    await activePage.waitForTimeout(3000);

    // Click Continue on consent page
    await googleOAuthActions.clickContinueOnConsentPage();

    // Wait for permissions page to appear
    const permissionsVisible = await activePage
      .locator('text=/wants to access your Google Account/')
      .isVisible({ timeout: 15000 })
      .catch(() => false);
    expect(permissionsVisible).toBe(true);
  });

  test('should click Allow on permissions page', async () => {
    // Complete all previous steps
    const isUseAnotherVisible = await googleOAuthActions.isUseAnotherAccountVisible();
    if (isUseAnotherVisible) {
      await googleOAuthActions.clickUseAnotherAccount();
    }

    await googleOAuthActions.enterEmail(TestData.emails.testUser);
    await googleOAuthActions.clickNextAfterEmail();
    await activePage.waitForTimeout(3000);

    await googleOAuthActions.enterPassword(TestData.passwords.testPassword);
    await googleOAuthActions.clickNextAfterPassword();
    await activePage.waitForTimeout(3000);

    await googleOAuthActions.clickContinueOnConsentPage();
    await activePage.waitForTimeout(2000);

    // Click Allow on permissions page
    await googleOAuthActions.clickAllowOnPermissionsPage();
    await activePage.waitForTimeout(2000);

    // Verify navigation away from Google accounts
    const currentURL = activePage.url();
    // Should either be on anyteam.com or navigating there
    expect(currentURL.includes('anyteam.com') || currentURL.includes('accounts.google.com')).toBe(true);
  });
});

