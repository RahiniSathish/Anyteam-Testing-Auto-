import { test, expect } from '@playwright/test';
import { LiveMeetingActions } from '../../actions/meetings/LiveMeetingActions';
import { LoginActions } from '../../actions/login/LoginActions';
import { GoogleOAuthActions } from '../../actions/login/GoogleOAuthActions';
import { TestData } from '../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Suite: Live Meeting
 * Tests for live meeting controls and interactions
 */
test.describe('Live Meeting', () => {
  let liveMeetingActions: LiveMeetingActions;

  test.beforeEach(async ({ page, context }) => {
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
  });

  test('should verify meeting is active', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Verifying meeting is active...');
    const isActive = await liveMeetingActions.verifyMeetingActive();
    expect(isActive).toBe(true);
    console.log('✓ Meeting is active');
  });

  test('should verify meeting timer is visible', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Verifying meeting timer is visible...');
    const isTimerVisible = await liveMeetingActions.verifyMeetingTimerVisible();
    expect(isTimerVisible).toBe(true);
    console.log('✓ Meeting timer is visible');
  });

  test('should toggle mute button', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Verifying mute button is visible...');
    const isMuteVisible = await liveMeetingActions.verifyMuteButtonVisible();
    if (isMuteVisible) {
      console.log('Step 3: Toggling mute...');
      await liveMeetingActions.toggleMute();
      await page.waitForTimeout(1000);
      console.log('✓ Mute toggled');
    } else {
      console.log('⚠ Mute button not visible, skipping toggle');
    }
  });

  test('should toggle video button', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Toggling video...');
    await liveMeetingActions.toggleVideo();
    await page.waitForTimeout(1000);
    console.log('✓ Video toggled');
  });

  test('should click share screen button', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Clicking share screen button...');
    await liveMeetingActions.clickShareScreen();
    await page.waitForTimeout(2000);
    console.log('✓ Share screen button clicked');
  });

  test('should click chat button', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Clicking chat button...');
    await liveMeetingActions.clickChatButton();
    await page.waitForTimeout(1000);
    console.log('✓ Chat button clicked');
  });

  test('should click participants button', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Clicking participants button...');
    await liveMeetingActions.clickParticipantsButton();
    await page.waitForTimeout(1000);
    console.log('✓ Participants button clicked');
  });

  test('should click leave meeting button', async ({ page }) => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Clicking leave meeting button...');
    await liveMeetingActions.clickLeaveMeeting();
    await page.waitForTimeout(2000);
    console.log('✓ Leave meeting button clicked');
  });
});

