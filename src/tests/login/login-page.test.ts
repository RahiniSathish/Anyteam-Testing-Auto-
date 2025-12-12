import { test, expect } from '@playwright/test';
import { LoginActions } from '../../actions/login/LoginActions';

/**
 * Test Suite: Login Page
 * Tests for the login page UI elements and basic interactions
 */
test.describe('Login Page', () => {
  let loginActions: LoginActions;

  test.beforeEach(async ({ page }) => {
    loginActions = new LoginActions(page);
    await loginActions.navigateToLoginPage();
  });

  test('should display login page with Continue with Google button', async ({ page }) => {
    // Verify the p element inside the button is visible
    const continueButton = page.locator('p:has-text("Continue with Google")');
    await expect(continueButton).toBeVisible();

    // Verify the parent button
    const button = continueButton.locator('..');
    await expect(button).toBeVisible();
  });

  test('should verify Continue with Google button structure', async ({ page }) => {
    const continueButton = page.locator('p:has-text("Continue with Google")');

    // Verify the p element classes
    const classes = await continueButton.getAttribute('class');
    expect(classes).toContain('text-[16px]');
    expect(classes).toContain('leading-[22px]');
    expect(classes).toContain('font-[500]');

    // Verify parent button has correct dimensions
    const button = continueButton.locator('..');
    const buttonClasses = await button.getAttribute('class');
    expect(buttonClasses).toContain('w-[276px]');
    expect(buttonClasses).toContain('h-[42px]');
    expect(buttonClasses).toContain('bg-black');
  });

  test('should verify Continue with Google button contains Google logo', async ({ page }) => {
    const continueButton = page.locator('p:has-text("Continue with Google")');
    const button = continueButton.locator('..');

    // Verify Google logo is present
    const googleLogo = button.locator('img[alt="logo-google"]');
    await expect(googleLogo).toBeVisible();
  });

  test('should verify login page is displayed', async () => {
    const isDisplayed = await loginActions.verifyLoginPageDisplayed();
    expect(isDisplayed).toBe(true);
  });
});

