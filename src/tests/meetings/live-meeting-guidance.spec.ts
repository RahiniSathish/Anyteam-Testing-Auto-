import { test, expect } from '@playwright/test';
import { LiveMeetingGuidanceActions } from '../../actions/meetings/LiveMeetingGuidanceActions';
import { LiveMeetingActions } from '../../actions/meetings/LiveMeetingActions';
import { LoginActions } from '../../actions/login/LoginActions';
import { GoogleOAuthActions } from '../../actions/login/GoogleOAuthActions';
import { TestData } from '../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Suite: Live Meeting Guidance
 * Tests for meeting guidance, tips, and help during live meetings
 */
test.describe('Live Meeting Guidance', () => {
  let liveMeetingGuidanceActions: LiveMeetingGuidanceActions;
  let liveMeetingActions: LiveMeetingActions;

  test.beforeEach(async ({ page, context }) => {
    liveMeetingGuidanceActions = new LiveMeetingGuidanceActions(page);
    liveMeetingActions = new LiveMeetingActions(page);
    
    // Navigate to home page
    await page.goto(`${TestData.urls.base}/home`);
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Check if we're on login page - if so, perform login
    const currentUrl = page.url();
    if (currentUrl.includes('/Login') || currentUrl.includes('/onboarding/Login')) {
      console.log('Not logged in, performing login...');
      const loginActions = new LoginActions(page);
      await loginActions.navigateToLoginPage();
      
      // Click Continue with Google
      const continueButton = page.locator('p:has-text("Continue with Google")').locator('..');
      await continueButton.click();
      await page.waitForTimeout(2000);
      
      // Get active page (popup or main page)
      const pages = context.pages();
      const activePage = pages.length > 1 ? pages[pages.length - 1] : page;
      
      // Perform OAuth flow if needed
      const activeUrl = activePage.url();
      if (activeUrl.includes('accounts.google.com')) {
        const googleOAuthActions = new GoogleOAuthActions(activePage);
        
        // Enter email
        await googleOAuthActions.enterEmail(TestData.emails.testUser);
        await googleOAuthActions.clickNextAfterEmail();
        await activePage.waitForTimeout(1500);
        
        // Enter password
        await googleOAuthActions.enterPassword(TestData.passwords.testPassword);
        await googleOAuthActions.clickNextAfterPassword();
        await activePage.waitForTimeout(3000);
        
        // Click Continue and Allow
        try {
          await googleOAuthActions.clickContinueOnConsentPage();
          await activePage.waitForTimeout(2000);
        } catch (e) {
          // Continue button might not appear
        }
        
        try {
          await googleOAuthActions.clickAllowOnPermissionsPage();
          await activePage.waitForTimeout(3000);
        } catch (e) {
          // Allow button might not appear
        }
        
        // Wait for redirect to anyteam
        await page.waitForURL((url: URL) => url.href.includes('anyteam.com') && !url.href.includes('accounts.google.com'), { timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(5000);
      }
      
      // Navigate to home page after login
      await page.goto(`${TestData.urls.base}/home`);
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(3000);
    }
    
    // Wait for live meeting to load
    await liveMeetingActions.waitForMeetingLoad();
  });

  test('should verify guidance panel is visible', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Verifying guidance is visible...');
    const isGuidanceVisible = await liveMeetingGuidanceActions.verifyGuidanceVisible();
    expect(isGuidanceVisible).toBe(true);
    console.log('✓ Guidance panel is visible');
  });

  test('should verify guidance title is visible', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Verifying guidance title is visible...');
    const isTitleVisible = await liveMeetingGuidanceActions.verifyGuidanceTitleVisible();
    expect(isTitleVisible).toBe(true);
    console.log('✓ Guidance title is visible');
  });

  test('should verify guidance content is visible', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Verifying guidance content is visible...');
    const isContentVisible = await liveMeetingGuidanceActions.verifyGuidanceContentVisible();
    expect(isContentVisible).toBe(true);
    console.log('✓ Guidance content is visible');
  });

  test('should get guidance text', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Getting guidance text...');
    const guidanceText = await liveMeetingGuidanceActions.getGuidanceText();
    if (guidanceText) {
      console.log(`✓ Guidance text retrieved: ${guidanceText.substring(0, 50)}...`);
      expect(guidanceText.length).toBeGreaterThan(0);
    } else {
      console.log('⚠ Guidance text not available');
    }
  });

  test('should click next tip button', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Clicking next tip button...');
    await liveMeetingGuidanceActions.clickNextTip();
    await page.waitForTimeout(1000);
    console.log('✓ Next tip button clicked');
  });

  test('should click previous tip button', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Clicking previous tip button...');
    await liveMeetingGuidanceActions.clickPreviousTip();
    await page.waitForTimeout(1000);
    console.log('✓ Previous tip button clicked');
  });

  test('should click skip guidance button', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Clicking skip guidance button...');
    await liveMeetingGuidanceActions.clickSkipGuidance();
    await page.waitForTimeout(1000);
    console.log('✓ Skip guidance button clicked');
  });

  test('should close guidance panel', async ({ page }) => {
    console.log('Step 1: Waiting for guidance panel to appear...');
    await liveMeetingGuidanceActions.waitForGuidancePanel();
    
    console.log('Step 2: Closing guidance panel...');
    await liveMeetingGuidanceActions.closeGuidance();
    await page.waitForTimeout(1000);
    console.log('✓ Guidance panel closed');
  });
});

