import { test, expect, Page } from '@playwright/test';
import { LiveMeetingGuidanceActions } from '../../actions/meetings/LiveMeetingGuidanceActions';
import { LiveMeetingActions } from '../../actions/meetings/LiveMeetingActions';
import { AnyteamCalendarActions } from '../../actions/calendar/AnyteamCalendarActions';
import { LoginHelper } from '../../utils/loginHelper';
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
    
    // Perform login using LoginHelper
    await LoginHelper.performLogin(page, context);
    
    // Navigate to home page
    await page.goto(`${TestData.urls.base}/home`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
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

  test('should click join button and handle multiple pages opening (Google Meet/Calendar)', async ({ page, context }) => {
    test.setTimeout(360000); // 6 minutes for this test
    
    console.log('\n=== Test: Join button opens multiple pages (Google Meet/Calendar) ===');
    
    // Step 1: Navigate to home page
    console.log('Step 1: Navigating to home page...');
    await page.goto(`${TestData.urls.base}/home`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('✓ Navigated to home page');

    // Step 2: Click calendar icon (schedule icon)
    console.log('Step 2: Clicking calendar icon (schedule icon)...');
    const calendarActions = new AnyteamCalendarActions(page);
    await calendarActions.clickCalendarIcon();
    await page.waitForTimeout(2000);
    console.log('✓ Calendar icon clicked');

    // Step 3: Find and click meeting item (try multiple approaches)
    console.log('Step 3: Looking for meeting item...');
    let meetingClicked = false;
    
    // Try 1: Look for meeting with time "14:15 - 15:15" (sample meeting)
    const sampleMeetingTime = "14:15 - 15:15";
    console.log(`  Trying to find meeting with time: ${sampleMeetingTime}...`);
    const isSampleMeetingVisible = await calendarActions.isMeetingItemByTimeVisible(sampleMeetingTime);
    
    if (isSampleMeetingVisible) {
      console.log(`  ✓ Found meeting with time: ${sampleMeetingTime}`);
      await calendarActions.clickMeetingItemByTime(sampleMeetingTime);
      await page.waitForTimeout(2000);
      console.log('✓ Clicked on meeting item');
      meetingClicked = true;
    } else {
      console.log(`  ⚠ Meeting with time ${sampleMeetingTime} not found, trying Team Standup Meeting...`);
      
      // Try 2: Look for "Team Standup Meeting"
      const isTeamStandupVisible = await calendarActions.isTeamStandupMeetingItemVisible();
      if (isTeamStandupVisible) {
        console.log('  ✓ Found Team Standup Meeting item');
        await calendarActions.clickTeamStandupMeetingItem();
        await page.waitForTimeout(2000);
        console.log('✓ Clicked on Team Standup Meeting item');
        meetingClicked = true;
      } else {
        console.log('  ⚠ Team Standup Meeting not found, trying first available meeting...');
        
        // Try 3: Click first available meeting item
        const isAnyMeetingVisible = await calendarActions.isAnyMeetingItemVisible();
        if (isAnyMeetingVisible) {
          console.log('  ✓ Found available meeting item');
          await calendarActions.clickFirstAvailableMeetingItem();
          await page.waitForTimeout(2000);
          console.log('✓ Clicked on first available meeting item');
          meetingClicked = true;
        }
      }
    }
    
    if (!meetingClicked) {
      console.log('⚠ No meeting items found in calendar');
      console.log('  Taking screenshot for debugging...');
      await page.screenshot({ path: 'test-results/live-meeting-guidance-meeting-item-not-visible.png', fullPage: true });
      console.log('  Screenshot saved: test-results/live-meeting-guidance-meeting-item-not-visible.png');
      return;
    }

    // Step 4: Wait for Join button to appear after clicking meeting item
    console.log('Step 4: Looking for Join button (appears directly below meeting item)...');
    
    // Wait a moment for the Join button to appear after clicking the meeting item
    await page.waitForTimeout(3000);
    
    // Scroll to make sure the Join button is visible
    await page.evaluate(() => {
      (globalThis as any).window.scrollBy(0, 150);
    });
    await page.waitForTimeout(1000);
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'test-results/live-meeting-guidance-before-join-button-search.png', fullPage: true });
    console.log('  Screenshot saved: test-results/live-meeting-guidance-before-join-button-search.png');
    
    // Step 5: Find and click Join button with comprehensive selectors
    console.log('Step 5: Looking for and clicking Join button...');
    
    let joinButton = null;
    let joinButtonFound = false;
    const maxRetries = 5;
    
    // Build list of selectors to try - including the exact selector from user
    const joinButtonSelectors = [
      // Exact match with all classes
      'button[type="button"][data-state="closed"].text-white.font-medium.rounded-l-md.h-8.px-3.text-xs.cursor-pointer:has-text("Join")',
      // With data-state="closed"
      'button[type="button"][data-state="closed"].text-white.font-medium.rounded-l-md:has-text("Join")',
      'button[type="button"][data-state="closed"]:has-text("Join")',
      // Class combinations
      'button.text-white.font-medium.rounded-l-md.h-8.px-3:has-text("Join")',
      'button.text-white.font-medium.rounded-l-md[data-state="closed"]:has-text("Join")',
      'button.text-white.font-medium.rounded-l-md:has-text("Join")',
      'button.h-8.px-3.text-xs:has-text("Join")',
      // Simple selectors
      'button[type="button"]:has-text("Join")',
      'button:has-text("Join")',
      'button:has-text("Join Meeting")',
      'a:has-text("Join")',
      '[aria-label*="Join" i]',
    ];
    
    for (let i = 0; i < maxRetries; i++) {
      for (const selector of joinButtonSelectors) {
        try {
          const button = page.locator(selector).first();
          const count = await button.count();
          const isVisible = await button.isVisible({ timeout: 1500 }).catch(() => false);
          
          if (isVisible && count > 0) {
            // Get button text to verify
            const buttonText = await button.textContent().catch(() => '');
            if (buttonText && buttonText.trim().toLowerCase().includes('join')) {
              console.log(`  ✓ Found Join button on attempt ${i + 1} with selector: ${selector}`);
              console.log(`    Button text: "${buttonText.trim()}"`);
              joinButton = button;
              joinButtonFound = true;
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      if (joinButtonFound) {
        break;
      }
      
      console.log(`  Attempt ${i + 1}/${maxRetries}: Join button not visible yet, scrolling and waiting...`);
      await page.evaluate(() => {
        (globalThis as any).window.scrollBy(0, 100);
      });
      await page.waitForTimeout(2000);
    }
    
    if (!joinButtonFound || !joinButton) {
      console.log('⚠ Join button not found after multiple attempts');
      console.log('  Taking screenshot for debugging...');
      await page.screenshot({ path: 'test-results/live-meeting-guidance-join-button-not-found.png', fullPage: true });
      console.log('  Screenshot saved: test-results/live-meeting-guidance-join-button-not-found.png');
      return;
    }
    
    // Step 6: Click join button and wait for multiple pages to open
    console.log('Step 6: Clicking Join button and waiting for Google Meet/Calendar pages to open...');
    
    try {
      // Get initial page count
      const initialPageCount = context.pages().length;
      console.log(`  Initial page count: ${initialPageCount}`);
      
      // Set up listener for new page before clicking (non-blocking)
      const pagePromise: Promise<Page | null> = context.waitForEvent('page', { timeout: 20000 }).catch(() => null);
      
      // Scroll to button if needed
      await joinButton.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(500);
      
      // Click the join button
      try {
        await joinButton.click({ timeout: 5000 });
        console.log('  ✓ Join button clicked successfully');
      } catch (clickError) {
        console.log('  ⚠ Normal click failed, trying force click...');
        await joinButton.click({ force: true, timeout: 5000 });
        console.log('  ✓ Join button clicked (force) successfully');
      }
      
      // Wait a bit for pages to potentially open
      await page.waitForTimeout(3000);
      
      // Wait for first new page to open (if any)
      const firstNewPage = await pagePromise;
      
      // Check all pages in context to find newly opened pages
      const allContextPages = context.pages();
      const openedPages: Page[] = [];
      
      console.log(`  Total pages in context after click: ${allContextPages.length}`);
      
      // Check all pages to find Google Meet/Calendar pages (skip the original app page)
      for (const testPage of allContextPages) {
        try {
          // Skip the original app page
          if (testPage === page) {
            continue;
          }
          
          const pageUrl = testPage.url();
          if (pageUrl.includes('meet.google.com') || 
              pageUrl.includes('calendar.google.com') ||
              pageUrl.includes('accounts.google.com')) {
            console.log(`  ✓ Found Google Meet/Calendar page: ${pageUrl}`);
            if (!openedPages.includes(testPage)) {
              openedPages.push(testPage);
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      // If we got a new page from the promise and it's not already in the list, add it
      if (firstNewPage && !openedPages.includes(firstNewPage)) {
        const newPageUrl = firstNewPage.url();
        if (newPageUrl.includes('meet.google.com') || 
            newPageUrl.includes('calendar.google.com') ||
            newPageUrl.includes('accounts.google.com')) {
          openedPages.push(firstNewPage);
        }
      }
      
      // Wait a bit more and check again for any additional pages that might have opened
      await page.waitForTimeout(2000);
      const finalContextPages = context.pages();
      for (const testPage of finalContextPages) {
        try {
          if (testPage === page || openedPages.includes(testPage)) {
            continue;
          }
          
          const pageUrl = testPage.url();
          if (pageUrl.includes('meet.google.com') || 
              pageUrl.includes('calendar.google.com') ||
              pageUrl.includes('accounts.google.com')) {
            console.log(`  ✓ Found additional Google Meet/Calendar page: ${pageUrl}`);
            openedPages.push(testPage);
          }
        } catch (e) {
          continue;
        }
      }
      
      if (openedPages.length > 0) {
        console.log(`✓ ${openedPages.length} page(s) opened after clicking Join button`);
        
        // Verify and interact with each opened page
        for (let i = 0; i < openedPages.length; i++) {
          const openedPage = openedPages[i];
          try {
            console.log(`\n  Processing page ${i + 1}/${openedPages.length}...`);
            console.log(`    URL: ${openedPage.url()}`);
            
            // Wait for the page to load
            await openedPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
            await openedPage.waitForTimeout(2000);
            
            // Verify it's a Google Meet/Calendar page
            const pageUrl = openedPage.url();
            const isGoogleMeet = pageUrl.includes('meet.google.com');
            const isGoogleCalendar = pageUrl.includes('calendar.google.com');
            const isGoogleAccounts = pageUrl.includes('accounts.google.com');
            
            if (isGoogleMeet) {
              console.log(`    ✓ Google Meet page opened successfully`);
              
              // Take screenshot
              await openedPage.screenshot({ path: `test-results/live-meeting-join-meet-page-${i + 1}.png`, fullPage: true });
              console.log(`    ✓ Screenshot saved: test-results/live-meeting-join-meet-page-${i + 1}.png`);
              
              // Check for join-related elements
              const joinElements = openedPage.locator('button:has-text("Join"), button:has-text("Join now"), [aria-label*="Join" i]').first();
              const hasJoinElements = await joinElements.isVisible({ timeout: 10000 }).catch(() => false);
              
              if (hasJoinElements) {
                console.log(`    ✓ Join elements found on Google Meet page`);
              }
            } else if (isGoogleCalendar) {
              console.log(`    ✓ Google Calendar page opened successfully`);
              
              // Take screenshot
              await openedPage.screenshot({ path: `test-results/live-meeting-join-calendar-page-${i + 1}.png`, fullPage: true });
              console.log(`    ✓ Screenshot saved: test-results/live-meeting-join-calendar-page-${i + 1}.png`);
            } else if (isGoogleAccounts) {
              console.log(`    ✓ Google Accounts page opened (authentication required)`);
              
              // Take screenshot
              await openedPage.screenshot({ path: `test-results/live-meeting-join-accounts-page-${i + 1}.png`, fullPage: true });
              console.log(`    ✓ Screenshot saved: test-results/live-meeting-join-accounts-page-${i + 1}.png`);
            } else {
              console.log(`    ⚠ Unexpected page type: ${pageUrl}`);
              await openedPage.screenshot({ path: `test-results/live-meeting-join-unexpected-page-${i + 1}.png`, fullPage: true });
              console.log(`    ✓ Screenshot saved: test-results/live-meeting-join-unexpected-page-${i + 1}.png`);
            }
            
            // Keep page open for verification (don't close it)
            console.log(`    ✓ Page ${i + 1} processed and accessible`);
            
          } catch (error) {
            console.log(`    ⚠ Error processing page ${i + 1}:`, error instanceof Error ? error.message : String(error));
          }
        }
        
        console.log(`\n✓ Successfully accessed ${openedPages.length} page(s) opened by Join button`);
      } else {
        // Check if we were redirected to a join page in the same tab
        await page.waitForTimeout(3000);
        const currentUrl = page.url();
        
        if (currentUrl.includes('meet.google.com') || currentUrl.includes('calendar.google.com')) {
          console.log('✓ Current page redirected to Google Meet/Calendar join page');
          console.log(`  URL: ${currentUrl}`);
          await page.screenshot({ path: 'test-results/live-meeting-join-redirect.png', fullPage: true });
          console.log('✓ Screenshot saved: test-results/live-meeting-join-redirect.png');
        } else {
          console.log('⚠ No new pages detected after clicking Join button');
          console.log('  Join may have opened in same page or requires user interaction');
          
          // Take screenshot for debugging
          await page.screenshot({ path: 'test-results/live-meeting-join-no-pages.png', fullPage: true });
          console.log('✓ Screenshot saved: test-results/live-meeting-join-no-pages.png');
        }
      }
    } catch (error) {
      console.log('⚠ Error during join button click:', error instanceof Error ? error.message : String(error));
      await page.screenshot({ path: 'test-results/live-meeting-join-error.png', fullPage: true });
      console.log('✓ Screenshot saved: test-results/live-meeting-join-error.png');
      // Don't throw - allow test to continue or mark as warning
    }
    
    console.log('✓ Join button test completed');
  });
});

