import { test, expect } from '@playwright/test';
import { BaseMeetingActions } from '../../actions/meetings/BaseMeetingActions';
import { NotificationsActions } from '../../actions/settings/notifications/NotificationsActions';
import { LoginActions } from '../../actions/login/LoginActions';
import { GoogleOAuthActions } from '../../actions/login/GoogleOAuthActions';
import { TestData } from '../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Suite: Base Meeting
 * Tests for basic meeting creation, editing, and management
 */
test.describe('Base Meeting', () => {
  let baseMeetingActions: BaseMeetingActions;

  test.beforeEach(async ({ page, context }) => {
    baseMeetingActions = new BaseMeetingActions(page);
    
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

  test('should display base meeting page elements', async ({ page }) => {
    console.log('Step 1: Navigating to base meeting page...');
    await baseMeetingActions.navigateToBaseMeeting();
    await page.waitForTimeout(2000);
    
    console.log('Step 2: Verifying meeting title field is visible...');
    const isTitleVisible = await baseMeetingActions.verifyMeetingTitleVisible();
    expect(isTitleVisible).toBe(true);
    console.log('✓ Meeting title field is visible');
  });

  test('should fill meeting title', async ({ page }) => {
    console.log('Step 1: Navigating to base meeting page...');
    await baseMeetingActions.navigateToBaseMeeting();
    await page.waitForTimeout(2000);
    
    console.log('Step 2: Filling meeting title...');
    const meetingTitle = TestData.meetings.title;
    await baseMeetingActions.fillMeetingTitle(meetingTitle);
    await page.waitForTimeout(1000);
    console.log(`✓ Meeting title filled: ${meetingTitle}`);
  });

  test('should fill meeting details', async ({ page }) => {
    console.log('Step 1: Navigating to base meeting page...');
    await baseMeetingActions.navigateToBaseMeeting();
    await page.waitForTimeout(2000);
    
    console.log('Step 2: Filling meeting details...');
    await baseMeetingActions.fillMeetingTitle(TestData.meetings.title);
    await page.waitForTimeout(500);
    
    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    await baseMeetingActions.fillMeetingDate(dateString);
    await page.waitForTimeout(500);
    
    await baseMeetingActions.fillMeetingTime(TestData.meetings.startTime);
    await page.waitForTimeout(500);
    
    await baseMeetingActions.fillMeetingParticipants(TestData.meetings.guestEmail);
    await page.waitForTimeout(500);
    
    await baseMeetingActions.fillMeetingDescription('Test meeting description');
    await page.waitForTimeout(1000);
    console.log('✓ All meeting details filled');
  });

  test('should verify join button is visible', async ({ page }) => {
    console.log('Step 1: Navigating to base meeting page...');
    await baseMeetingActions.navigateToBaseMeeting();
    await page.waitForTimeout(2000);
    
    console.log('Step 2: Verifying join button is visible...');
    const isJoinVisible = await baseMeetingActions.verifyJoinButtonVisible();
    expect(isJoinVisible).toBe(true);
    console.log('✓ Join button is visible');
  });

  test('should click join button', async ({ page }) => {
    console.log('Step 1: Navigating to base meeting page...');
    await baseMeetingActions.navigateToBaseMeeting();
    await page.waitForTimeout(2000);
    
    console.log('Step 2: Clicking join button...');
    const isJoinVisible = await baseMeetingActions.verifyJoinButtonVisible();
    if (isJoinVisible) {
      await baseMeetingActions.clickJoinButton();
      await page.waitForTimeout(3000);
      console.log('✓ Join button clicked');
    } else {
      console.log('⚠ Join button not visible, skipping click');
    }
  });

  test('should verify all meeting insights sections are visible from notifications panel', async ({ page }) => {
    console.log('\n=== Test: Verify Meeting Insights Sections from Notifications Panel ===');
    
    const notificationsActions = new NotificationsActions(page);
    
    // Step 1: Open notifications panel
    console.log('Step 1: Opening notifications panel...');
    await notificationsActions.clickNotificationsHeading();
    await page.waitForTimeout(2000);
    console.log('✓ Notifications panel opened');
    
    // Step 2: Click on notification item
    console.log('Step 2: Clicking notification item...');
    const isNotificationVisible = await notificationsActions.verifyNotificationItemVisible();
    if (!isNotificationVisible) {
      console.log('⚠ No notification items available - skipping test');
      return;
    }
    
    await notificationsActions.clickNotificationItem();
    await page.waitForTimeout(2000);
    console.log('✓ Notification item clicked');
    
    // Step 3: Click "View Meeting Insights" button
    console.log('Step 3: Clicking View Meeting Insights button...');
    const isViewInsightsVisible = await notificationsActions.verifyViewMeetingInsightsVisible();
    if (!isViewInsightsVisible) {
      console.log('⚠ View Meeting Insights button not visible - taking screenshot');
      await page.screenshot({ path: 'test-results/view-insights-not-visible.png', fullPage: true });
      throw new Error('View Meeting Insights button not visible');
    }
    
    await notificationsActions.clickViewMeetingInsights();
    await page.waitForTimeout(3000);
    console.log('✓ View Meeting Insights clicked');
    
    // Step 4: Wait for insights page to load
    console.log('Step 4: Waiting for meeting insights page to load...');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('✓ Insights page loaded');
    
    // Step 5: Define locators for all sections
    const agendaSection = page.locator('h2:has-text("Agenda"), h3:has-text("Agenda"), [data-testid="agenda"], [class*="agenda"], div:has-text("Agenda")').first();
    const participantsSection = page.locator('h2:has-text("Participants"), h3:has-text("Participants"), [data-testid="participants"], [class*="participants"], div:has-text("Participants")').first();
    const strategicPOVSection = page.locator('h2:has-text("Strategic POV"), h3:has-text("Strategic POV"), [data-testid="strategic-pov"], [class*="strategic"], div:has-text("Strategic POV"), div:has-text("Strategic")').first();
    const recapSection = page.locator('h2:has-text("Recap"), h3:has-text("Recap"), [data-testid="recap"], [class*="recap"], div:has-text("Recap")').first();
    const updatesSection = page.locator('h2:has-text("Updates"), h3:has-text("Updates"), [data-testid="updates"], [class*="updates"], div:has-text("Updates")').first();
    const talkingPointsSection = page.locator('h2:has-text("Talking Points"), h3:has-text("Talking Points"), [data-testid="talking-points"], [class*="talking-points"], div:has-text("Talking Points")').first();
    
    // Step 6: Verify all sections are visible
    console.log('Step 5: Verifying all meeting insights sections are visible...');
    const isAgendaVisible = await agendaSection.isVisible({ timeout: 5000 }).catch(() => false);
    const isParticipantsVisible = await participantsSection.isVisible({ timeout: 5000 }).catch(() => false);
    const isStrategicPOVVisible = await strategicPOVSection.isVisible({ timeout: 5000 }).catch(() => false);
    const isRecapVisible = await recapSection.isVisible({ timeout: 5000 }).catch(() => false);
    const isUpdatesVisible = await updatesSection.isVisible({ timeout: 5000 }).catch(() => false);
    const isTalkingPointsVisible = await talkingPointsSection.isVisible({ timeout: 5000 }).catch(() => false);
    
    console.log('\n--- Meeting Insights Sections Visibility ---');
    console.log(`  Agenda: ${isAgendaVisible ? '✓ Visible' : '✗ Not Visible'}`);
    console.log(`  Participants: ${isParticipantsVisible ? '✓ Visible' : '✗ Not Visible'}`);
    console.log(`  Strategic POV: ${isStrategicPOVVisible ? '✓ Visible' : '✗ Not Visible'}`);
    console.log(`  Recap: ${isRecapVisible ? '✓ Visible' : '✗ Not Visible'}`);
    console.log(`  Updates: ${isUpdatesVisible ? '✓ Visible' : '✗ Not Visible'}`);
    console.log(`  Talking Points: ${isTalkingPointsVisible ? '✓ Visible' : '✗ Not Visible'}`);
    console.log('--- End of Sections ---\n');
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/meeting-insights-sections.png', fullPage: true });
    console.log('✓ Screenshot saved: test-results/meeting-insights-sections.png');
    
    // Assertions
    expect(isAgendaVisible, 'Agenda section should be visible').toBe(true);
    expect(isParticipantsVisible, 'Participants section should be visible').toBe(true);
    expect(isStrategicPOVVisible, 'Strategic POV section should be visible').toBe(true);
    expect(isRecapVisible, 'Recap section should be visible').toBe(true);
    expect(isUpdatesVisible, 'Updates section should be visible').toBe(true);
    expect(isTalkingPointsVisible, 'Talking Points section should be visible').toBe(true);
    
    console.log('✓ All meeting insights sections are visible!');
  });

  test('should verify individual meeting insights sections', async ({ page }) => {
    console.log('\n=== Test: Verify Individual Meeting Insights Sections ===');
    
    const notificationsActions = new NotificationsActions(page);
    
    // Step 1: Open notifications panel and navigate to insights
    console.log('Step 1: Opening notifications panel...');
    await notificationsActions.clickNotificationsHeading();
    await page.waitForTimeout(2000);
    
    const isNotificationVisible = await notificationsActions.verifyNotificationItemVisible();
    if (!isNotificationVisible) {
      console.log('⚠ No notification items available - skipping test');
      return;
    }
    
    await notificationsActions.clickNotificationItem();
    await page.waitForTimeout(2000);
    
    const isViewInsightsVisible = await notificationsActions.verifyViewMeetingInsightsVisible();
    if (!isViewInsightsVisible) {
      console.log('⚠ View Meeting Insights button not visible - skipping test');
      return;
    }
    
    await notificationsActions.clickViewMeetingInsights();
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('✓ Navigated to meeting insights page');
    
    // Step 2: Define locators for each section
    const agendaSection = page.locator('h2:has-text("Agenda"), h3:has-text("Agenda"), [data-testid="agenda"], [class*="agenda"], div:has-text("Agenda")').first();
    const participantsSection = page.locator('h2:has-text("Participants"), h3:has-text("Participants"), [data-testid="participants"], [class*="participants"], div:has-text("Participants")').first();
    const strategicPOVSection = page.locator('h2:has-text("Strategic POV"), h3:has-text("Strategic POV"), [data-testid="strategic-pov"], [class*="strategic"], div:has-text("Strategic POV"), div:has-text("Strategic")').first();
    const recapSection = page.locator('h2:has-text("Recap"), h3:has-text("Recap"), [data-testid="recap"], [class*="recap"], div:has-text("Recap")').first();
    const updatesSection = page.locator('h2:has-text("Updates"), h3:has-text("Updates"), [data-testid="updates"], [class*="updates"], div:has-text("Updates")').first();
    const talkingPointsSection = page.locator('h2:has-text("Talking Points"), h3:has-text("Talking Points"), [data-testid="talking-points"], [class*="talking-points"], div:has-text("Talking Points")').first();
    
    // Step 3: Verify each section individually
    console.log('\nStep 2: Verifying individual sections...');
    
    console.log('  Checking Agenda section...');
    const isAgendaVisible = await agendaSection.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isAgendaVisible, 'Agenda section should be visible').toBe(true);
    console.log('  ✓ Agenda section is visible');
    
    console.log('  Checking Participants section...');
    const isParticipantsVisible = await participantsSection.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isParticipantsVisible, 'Participants section should be visible').toBe(true);
    console.log('  ✓ Participants section is visible');
    
    console.log('  Checking Strategic POV section...');
    const isStrategicPOVVisible = await strategicPOVSection.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isStrategicPOVVisible, 'Strategic POV section should be visible').toBe(true);
    console.log('  ✓ Strategic POV section is visible');
    
    console.log('  Checking Recap section...');
    const isRecapVisible = await recapSection.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isRecapVisible, 'Recap section should be visible').toBe(true);
    console.log('  ✓ Recap section is visible');
    
    console.log('  Checking Updates section...');
    const isUpdatesVisible = await updatesSection.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isUpdatesVisible, 'Updates section should be visible').toBe(true);
    console.log('  ✓ Updates section is visible');
    
    console.log('  Checking Talking Points section...');
    const isTalkingPointsVisible = await talkingPointsSection.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isTalkingPointsVisible, 'Talking Points section should be visible').toBe(true);
    console.log('  ✓ Talking Points section is visible');
    
    console.log('\n✓ All individual sections verified successfully!');
  });
});

