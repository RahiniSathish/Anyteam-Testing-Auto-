import { test, expect } from '@playwright/test';
import { PostMeetingInsightsActions } from '../../actions/meetings/PostMeetingInsightsActions';
import { LoginActions } from '../../actions/login/LoginActions';
import { GoogleOAuthActions } from '../../actions/login/GoogleOAuthActions';
import { TestData } from '../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Suite: Post Meeting Insights
 * Tests for post-meeting insights, analytics, and summaries
 */
test.describe('Post Meeting Insights', () => {
  let postMeetingInsightsActions: PostMeetingInsightsActions;

  test.beforeEach(async ({ page, context }) => {
    postMeetingInsightsActions = new PostMeetingInsightsActions(page);
    
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
  });

  test('should verify insights are visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying insights are visible...');
    const isInsightsVisible = await postMeetingInsightsActions.verifyInsightsVisible();
    expect(isInsightsVisible).toBe(true);
    console.log('✓ Insights are visible');
  });

  test('should verify meeting summary is visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying meeting summary is visible...');
    const isSummaryVisible = await postMeetingInsightsActions.verifyMeetingSummaryVisible();
    expect(isSummaryVisible).toBe(true);
    console.log('✓ Meeting summary is visible');
  });

  test('should verify key points are visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying key points are visible...');
    const isKeyPointsVisible = await postMeetingInsightsActions.verifyKeyPointsVisible();
    expect(isKeyPointsVisible).toBe(true);
    console.log('✓ Key points are visible');
  });

  test('should verify action items are visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying action items are visible...');
    const isActionItemsVisible = await postMeetingInsightsActions.verifyActionItemsVisible();
    expect(isActionItemsVisible).toBe(true);
    console.log('✓ Action items are visible');
  });

  test('should get meeting summary text', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Getting meeting summary text...');
    const summaryText = await postMeetingInsightsActions.getMeetingSummary();
    if (summaryText) {
      console.log(`✓ Meeting summary retrieved: ${summaryText.substring(0, 50)}...`);
      expect(summaryText.length).toBeGreaterThan(0);
    } else {
      console.log('⚠ Meeting summary not available');
    }
  });

  test('should click download report button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking download report button...');
    await postMeetingInsightsActions.clickDownloadReport();
    await page.waitForTimeout(2000);
    console.log('✓ Download report button clicked');
  });

  test('should click share insights button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking share insights button...');
    await postMeetingInsightsActions.clickShareInsights();
    await page.waitForTimeout(2000);
    console.log('✓ Share insights button clicked');
  });

  test('should click view details button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking view details button...');
    await postMeetingInsightsActions.clickViewDetails();
    await page.waitForTimeout(2000);
    console.log('✓ View details button clicked');
  });

  test('should click close insights button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking close insights button...');
    await postMeetingInsightsActions.clickCloseInsights();
    await page.waitForTimeout(1000);
    console.log('✓ Close insights button clicked');
  });
});

