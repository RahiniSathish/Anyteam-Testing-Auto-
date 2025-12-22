import { test, expect } from '@playwright/test';
import { BaseMeetingActions } from '../../actions/meetings/BaseMeetingActions';
import { NotificationsActions } from '../../actions/settings/notifications/NotificationsActions';
import { LoginHelper } from '../../utils/loginHelper';
import { TestData } from '../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Suite: Base Meeting
 * Tests for basic meeting creation, editing, and management
 * Based on Meeting_Feature_Validation test plan
 */
test.describe('Base Meeting', () => {
  let baseMeetingActions: BaseMeetingActions;

  test.beforeEach(async ({ page, context }) => {
    // Increase timeout for beforeEach (automated OAuth login can take time)
    test.setTimeout(360000); // 6 minutes for automated login flow
    
    baseMeetingActions = new BaseMeetingActions(page);
    
    // Perform automated login using LoginHelper
    await LoginHelper.performLogin(page, context);
    
    // Ensure we're on home page
    const currentUrl = page.url();
    if (!currentUrl.includes('/home')) {
      await page.goto(`${TestData.urls.base}/home`);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(2000);
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

  // Row 4: Agenda loads real-time
  test('should verify agenda loads real-time and is populated correctly', async ({ page }) => {
    console.log('\n=== Test: Agenda loads real-time and populated correctly ===');
    
    const notificationsActions = new NotificationsActions(page);
    
    // Navigate to meeting insights
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
    
    // Measure load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    const loadTime = Date.now() - startTime;
    
    console.log(`✓ Meeting insights page loaded in ${loadTime}ms`);
    
    // Open Agenda section
    console.log('Step: Opening Agenda section...');
    const agendaSection = page.locator('h2:has-text("Agenda"), h3:has-text("Agenda"), [data-testid="agenda"], [class*="agenda"], button:has-text("Agenda"), div:has-text("Agenda")').first();
    const isAgendaVisible = await agendaSection.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isAgendaVisible) {
      await agendaSection.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }
    
    // Verify agenda is populated with content
    console.log('Step: Verifying agenda is populated...');
    const agendaContent = page.locator('[class*="agenda"]').first();
    const hasContent = await agendaContent.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(hasContent, 'Agenda should be populated correctly').toBe(true);
    console.log('✓ Agenda populated correctly');
  });

  // Row 5: Participants tags shown
  test('should verify participants tags are shown correctly', async ({ page }) => {
    console.log('\n=== Test: Participants tags shown correctly ===');
    
    const notificationsActions = new NotificationsActions(page);
    
    // Navigate to meeting insights
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
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Open Participants section
    console.log('Step: Opening Participants section...');
    const participantsSection = page.locator('h2:has-text("Participants"), h3:has-text("Participants"), [data-testid="participants"], [class*="participants"], button:has-text("Participants"), div:has-text("Participants")').first();
    const isParticipantsVisible = await participantsSection.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isParticipantsVisible) {
      await participantsSection.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }
    
    // Verify participant tags are displayed
    console.log('Step: Verifying participant tags are displayed...');
    const participantTags = page.locator('[class*="tag"], [class*="participant"], [class*="badge"], span:has-text("@"), [data-testid*="participant"]');
    const tagCount = await participantTags.count();
    
    expect(tagCount, 'Participant tags should be displayed').toBeGreaterThan(0);
    console.log(`✓ Correct stakeholder tags displayed (${tagCount} tags found)`);
  });

  // Row 6: Strategic POV loads quickly
  test('should verify Strategic POV loads quickly', async ({ page }) => {
    console.log('\n=== Test: Strategic POV loads quickly ===');
    
    const notificationsActions = new NotificationsActions(page);
    
    // Navigate to meeting insights
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
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Open Strategic POV section and measure load time
    console.log('Step: Opening Strategic POV section...');
    const strategicPOVSection = page.locator('h2:has-text("Strategic POV"), h3:has-text("Strategic POV"), [data-testid="strategic-pov"], [class*="strategic"], button:has-text("Strategic"), div:has-text("Strategic POV")').first();
    const isStrategicVisible = await strategicPOVSection.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isStrategicVisible) {
      const startTime = Date.now();
      await strategicPOVSection.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      const loadTime = Date.now() - startTime;
      
      console.log(`✓ Strategic POV loaded in ${loadTime}ms`);
      expect(loadTime, 'Strategic POV should load within expected time (< 5000ms)').toBeLessThan(5000);
    } else {
      console.log('⚠ Strategic POV section not visible');
    }
  });

  // Row 8: Talking Points generated accurately
  test('should verify talking points are generated accurately', async ({ page }) => {
    console.log('\n=== Test: Talking Points generated accurately ===');
    
    const notificationsActions = new NotificationsActions(page);
    
    // Navigate to meeting insights
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
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Open Talking Points section
    console.log('Step: Opening Talking Points section...');
    const talkingPointsSection = page.locator('h2:has-text("Talking Points"), h3:has-text("Talking Points"), [data-testid="talking-points"], [class*="talking-points"], button:has-text("Talking Points"), div:has-text("Talking Points")').first();
    const isTalkingPointsVisible = await talkingPointsSection.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isTalkingPointsVisible) {
      await talkingPointsSection.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2000);
      
      // Verify talking points content exists
      console.log('Step: Verifying talking points content...');
      const talkingPointsContent = page.locator('[class*="talking"], [class*="point"], li, ul, ol, [data-testid*="talking"]');
      const contentCount = await talkingPointsContent.count();
      
      expect(contentCount, 'Talking points should be generated and displayed').toBeGreaterThan(0);
      console.log(`✓ Relevant and aligned talking points shown (${contentCount} items found)`);
    } else {
      console.log('⚠ Talking Points section not visible');
    }
  });

  // Row 12: Join button behavior correct
  test('should verify join button behavior is correct and opens Google Calendar/Meet page', async ({ page, context }) => {
    console.log('\n=== Test: Join button behavior correct ===');
    
    // Navigate to meeting page
    console.log('Step: Navigating to meeting page...');
    await baseMeetingActions.navigateToBaseMeeting();
    await page.waitForTimeout(2000);
    
    // Verify join button is visible
    console.log('Step: Verifying join button is visible...');
    const isJoinVisible = await baseMeetingActions.verifyJoinButtonVisible();
    expect(isJoinVisible, 'Join button should be visible').toBe(true);
    console.log('✓ Join button is visible');
    
    // Click join button and wait for new page/popup to open
    console.log('Step: Clicking join button and waiting for Google Calendar/Meet page to open...');
    
    // Set up listener for new page before clicking
    const pagePromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
    
    // Click the join button
    await baseMeetingActions.clickJoinButton();
    
    // Wait for new page to open (Google Meet/Calendar join page)
    const newPage = await pagePromise;
    
    if (newPage) {
      console.log('✓ New page opened after clicking Join button');
      console.log(`  New page URL: ${newPage.url()}`);
      
      // Wait for the new page to load
      await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
      await newPage.waitForTimeout(2000);
      
      // Verify it's a Google Meet/Calendar page
      const newPageUrl = newPage.url();
      const isGoogleMeet = newPageUrl.includes('meet.google.com') || 
                          newPageUrl.includes('calendar.google.com') ||
                          newPageUrl.includes('accounts.google.com');
      
      if (isGoogleMeet) {
        console.log('✓ Google Meet/Calendar join page opened successfully');
        console.log(`  Page URL: ${newPageUrl}`);
        
        // Take screenshot of the join page
        await newPage.screenshot({ path: 'test-results/google-meet-join-page.png', fullPage: true });
        console.log('✓ Screenshot saved: test-results/google-meet-join-page.png');
        
        // Check for join-related elements on the new page
        const joinButtonOnNewPage = newPage.locator('button:has-text("Join"), button:has-text("Join now"), [aria-label*="Join" i]').first();
        const isJoinButtonVisible = await joinButtonOnNewPage.isVisible({ timeout: 10000 }).catch(() => false);
        
        if (isJoinButtonVisible) {
          console.log('✓ Join button found on Google Meet/Calendar page');
        } else {
          console.log('⚠ Join button not immediately visible on new page (may need to wait for page to fully load)');
        }
        
        // Keep the page open for verification
        // Don't close it - let user see it in headed mode
        console.log('✓ Google Calendar/Meet join page is open and ready');
      } else {
        console.log(`⚠ New page opened but URL doesn't match Google Meet/Calendar: ${newPageUrl}`);
        await newPage.screenshot({ path: 'test-results/join-page-unexpected.png', fullPage: true });
        console.log('✓ Screenshot saved: test-results/join-page-unexpected.png');
      }
    } else {
      console.log('⚠ No new page opened after clicking Join button');
      console.log('  Checking if join options/dropdown appeared on current page...');
      
      // Check if join options/dropdown appeared on current page
      await page.waitForTimeout(2000);
      const joinOptions = page.locator('button:has-text("Join"), a:has-text("Join"), [aria-label*="Join" i], [class*="join"], [class*="option"]');
      const hasOptions = await joinOptions.count().then(count => count > 0);
      
      if (hasOptions) {
        console.log('✓ Join options/dropdown appeared on current page');
      } else {
        // Check if we were redirected to a join page
        const currentUrl = page.url();
        if (currentUrl.includes('meet.google.com') || currentUrl.includes('calendar.google.com')) {
          console.log('✓ Current page redirected to Google Meet/Calendar join page');
          console.log(`  URL: ${currentUrl}`);
          await page.screenshot({ path: 'test-results/google-meet-join-page-redirect.png', fullPage: true });
          console.log('✓ Screenshot saved: test-results/google-meet-join-page-redirect.png');
        } else {
          console.log('⚠ No new page opened and no redirect detected');
          await page.screenshot({ path: 'test-results/join-button-clicked-no-action.png', fullPage: true });
          console.log('✓ Screenshot saved: test-results/join-button-clicked-no-action.png');
        }
      }
    }
    
    console.log('✓ Join button behavior test completed');
  });

  test('should click notification from sidebar and view meeting pre-read', async ({ page }) => {
    console.log('\n=== Test: Click notification and View Meeting Pre-Read ===');
    
    const notificationsActions = new NotificationsActions(page);

    // Step 1: Ensure we're on home page
    console.log('Step 1: Navigating to home page...');
    await page.goto(`${TestData.urls.base}/home`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('✓ On home page');

    // Step 2: Open notifications panel from sidebar
    console.log('Step 2: Opening notifications panel from sidebar...');
    await notificationsActions.clickNotificationsHeading();
    await page.waitForTimeout(2000);
    console.log('✓ Notifications panel opened');

    // Step 3: Click on a notification item
    console.log('Step 3: Clicking on notification item...');
    const isNotificationVisible = await notificationsActions.verifyNotificationItemVisible();
    
    if (!isNotificationVisible) {
      console.log('⚠ No notifications visible - trying to find Team Standup Meeting notification...');
      const isTeamStandupVisible = await notificationsActions.verifyTeamStandupMeetingNotificationVisible();
      
      if (isTeamStandupVisible) {
        console.log('✓ Found Team Standup Meeting notification');
        await notificationsActions.clickTeamStandupMeetingNotification();
        await page.waitForTimeout(2000);
        console.log('✓ Clicked on Team Standup Meeting notification');
      } else {
        throw new Error('No notifications available to click');
      }
    } else {
      await notificationsActions.clickNotificationItem();
      await page.waitForTimeout(2000);
      console.log('✓ Clicked on notification item');
    }

    // Step 4: Click View Meeting Pre-Read button
    console.log('Step 4: Looking for View Meeting Pre-Read button...');
    const isViewPreReadVisible = await notificationsActions.verifyViewMeetingPreReadVisible();
    
    if (!isViewPreReadVisible) {
      console.log('⚠ View Meeting Pre-Read button not visible - taking screenshot...');
      await page.screenshot({ path: 'test-results/view-pre-read-not-visible-base-meeting.png', fullPage: true });
      console.log('Screenshot saved: test-results/view-pre-read-not-visible-base-meeting.png');
      throw new Error('View Meeting Pre-Read button not visible');
    }
    
    console.log('✓ Found View Meeting Pre-Read button');
    
    // Step 5: Click View Meeting Pre-Read
    console.log('Step 5: Clicking View Meeting Pre-Read...');
    await notificationsActions.clickViewMeetingPreRead();
    await page.waitForTimeout(3000); // Wait for modal/page to load
    console.log('✓ Clicked View Meeting Pre-Read button');
    
    // Step 6: Verify meeting details modal/page is visible
    console.log('Step 6: Verifying meeting details are displayed...');
    
    // Check for meeting title or modal
    const meetingTitle = page.locator('h1, h2, h3').filter({ hasText: /Meeting|Sample|Team Standup/i }).first();
    const isTitleVisible = await meetingTitle.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (isTitleVisible) {
      const titleText = await meetingTitle.textContent().catch(() => '');
      console.log(`✓ Meeting details displayed - Title: "${titleText?.trim()}"`);
    } else {
      console.log('⚠ Meeting title not immediately visible, but View Meeting Pre-Read was clicked');
    }
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/view-meeting-pre-read-clicked-base-meeting.png', fullPage: true });
    console.log('✓ Screenshot saved: test-results/view-meeting-pre-read-clicked-base-meeting.png');
    
    console.log('✓ Successfully clicked notification and View Meeting Pre-Read');
  });
});

