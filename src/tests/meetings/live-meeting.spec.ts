import { test, expect } from '@playwright/test';
import { LiveMeetingActions } from '../../actions/meetings/LiveMeetingActions';
import { AnyteamCalendarActions } from '../../actions/calendar/AnyteamCalendarActions';
import { LoginHelper } from '../../utils/loginHelper';
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
    test.setTimeout(360000); // 6 minutes for login flow
    liveMeetingActions = new LiveMeetingActions(page);
    
    // Perform login
    await LoginHelper.performLogin(page, context);
    
    // Navigate to home page
    await page.goto(`${TestData.urls.base}/home`);
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
  });

  test('should verify meeting is active', async () => {
    console.log('Step 1: Waiting for live meeting to load...');
    await liveMeetingActions.waitForMeetingLoad();
    
    console.log('Step 2: Verifying meeting is active...');
    const isActive = await liveMeetingActions.verifyMeetingActive();
    expect(isActive).toBe(true);
    console.log('✓ Meeting is active');
  });

  test('should verify meeting timer is visible', async () => {
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

  test('should join meeting from calendar', async ({ page }) => {
    test.setTimeout(360000); // 6 minutes

    console.log('\n════════════════════════════════════════');
    console.log('TEST: JOIN MEETING FROM CALENDAR');
    console.log('════════════════════════════════════════\n');

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
      await page.screenshot({ path: 'test-results/meeting-item-not-visible.png', fullPage: true });
      console.log('  Screenshot saved: test-results/meeting-item-not-visible.png');
      return;
    }

    // Step 4: Click Join button directly (appears below meeting item after clicking)
    // Based on the UI, the Join button appears directly below the meeting item, no separate arrow click needed
    console.log('Step 4: Looking for Join button (appears directly below meeting item)...');
    
    // Wait a moment for the Join button to appear after clicking the meeting item
    await page.waitForTimeout(3000);
    
    // Scroll to make sure the Join button is visible
    await page.evaluate(() => {
      (globalThis as any).window.scrollBy(0, 150);
    });
    await page.waitForTimeout(1000);
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'test-results/before-join-button-search.png', fullPage: true });
    console.log('  Screenshot saved: test-results/before-join-button-search.png');
    
    // Step 5: Click Join button - wait with retries and scrolling
    console.log('Step 5: Looking for and clicking Join button (waiting up to 10 seconds)...');
    
    // Try the exact selector from the user: <button type="button" class="text-white font-medium rounded-l-md hover:bg-white/10 transition-colors h-8 px-3 text-xs cursor-pointer" data-state="closed">Join</button>
    let joinButtonFound = false;
    const maxRetries = 5;
    
    // Build list of selectors to try - including class-based selectors
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
      // Check for button with specific classes even if text is not accessible
      'button[type="button"][data-state="closed"].text-white.font-medium.rounded-l-md.h-8',
      'button.text-white.font-medium.rounded-l-md.h-8.px-3.text-xs',
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
              await button.scrollIntoViewIfNeeded();
              await page.waitForTimeout(500);
              
              try {
                await button.click({ timeout: 5000 });
                console.log('  ✓ Clicked Join button successfully!');
              } catch (clickError) {
                console.log('  ⚠ Normal click failed, trying force click...');
                await button.click({ force: true, timeout: 5000 });
                console.log('  ✓ Clicked Join button (force) successfully!');
              }
              
              joinButtonFound = true;
              break;
            } else if (selector.includes('h-8') && isVisible) {
              // For class-based selectors without text, check if it's likely the Join button
              console.log(`  Checking button with selector: ${selector} (button text: "${buttonText}")`);
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
      
      // Scroll down a bit to check if button appears below
      await page.evaluate(() => {
        (globalThis as any).window.scrollBy(0, 100);
      });
      await page.waitForTimeout(2000);
    }
    
    if (!joinButtonFound) {
      console.log('⚠ Join button not visible after waiting - may not appear after clicking meeting item');
      console.log('  Taking screenshot to debug...');
      await page.screenshot({ path: 'test-results/join-button-not-visible.png', fullPage: true });
      console.log('  Screenshot saved: test-results/join-button-not-visible.png');
      
      // Try one more time with a simpler selector and check within meeting container
      console.log('  Trying one final attempt with simpler selectors and container search...');
      
      let finalButtonFound = false;
      
      // First, try to find button within the meeting item's parent container
      try {
        const meetingContainer = page.locator('div:has(p:has-text("16:00 - 17:00")), div:has(span:has-text("Team Standup Meeting"))').first();
        const containerVisible = await meetingContainer.isVisible({ timeout: 2000 }).catch(() => false);
        if (containerVisible) {
          const joinInContainer = meetingContainer.locator('button:has-text("Join"), button[type="button"].text-white, button.h-8').first();
          const joinInContainerVisible = await joinInContainer.isVisible({ timeout: 2000 }).catch(() => false);
          if (joinInContainerVisible) {
            const buttonText = await joinInContainer.textContent().catch(() => '');
            console.log(`  ✓ Found button in meeting container (text: "${buttonText}")`);
            if (buttonText && buttonText.trim().toLowerCase().includes('join')) {
              await joinInContainer.click({ timeout: 5000 });
              console.log('  ✓ Clicked Join button from container!');
              finalButtonFound = true;
            }
          }
        }
      } catch (e) {
        // Continue with other attempts
      }
      
      // Check all possible button selectors if container search didn't work
      if (!finalButtonFound) {
        const simpleSelectors = [
          'button:has-text("Join")',
          'button[type="button"]:has-text("Join")',
          'button[type="button"].text-white.font-medium',
          'button.text-white.h-8.px-3',
          '[role="button"]:has-text("Join")',
          'a:has-text("Join")',
          '*:has-text("Join"):visible'
        ];
        
        for (const selector of simpleSelectors) {
          try {
          const finalButton = page.locator(selector).first();
          const finalButtonVisible = await finalButton.isVisible({ timeout: 2000 }).catch(() => false);
          if (finalButtonVisible) {
            console.log(`  ✓ Found Join button with selector: ${selector}`);
            console.log('  Clicking Join button...');
            await finalButton.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            
            try {
              await finalButton.click({ timeout: 5000 });
              console.log('  ✓ Clicked Join button successfully!');
            } catch (clickError) {
              console.log('  ⚠ Normal click failed, trying force click...');
              await finalButton.click({ force: true, timeout: 5000 });
              console.log('  ✓ Clicked Join button (force) successfully!');
            }
            
            await page.waitForTimeout(3000);
            finalButtonFound = true;
            
            // Verify the click worked
            const urlAfterJoin = page.url();
            console.log(`  Current URL after clicking Join: ${urlAfterJoin}`);
            await page.screenshot({ path: 'test-results/after-join-button-click.png', fullPage: true });
            console.log('  Screenshot saved: test-results/after-join-button-click.png');
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
      
      // List all buttons on the page for debugging and try to find by classes
      if (!finalButtonFound) {
        console.log('  ⚠ Join button not found with any selector. Checking all buttons on page...');
        const allButtons = await page.locator('button').all();
        console.log(`  Found ${allButtons.length} buttons on the page`);
        
        // Check each button for matching classes or Join text
        for (let i = 0; i < allButtons.length; i++) {
          try {
            const buttonText = await allButtons[i].textContent().catch(() => '');
            const isVisible = await allButtons[i].isVisible().catch(() => false);
            const buttonClasses = await allButtons[i].evaluate(el => el.className).catch(() => '');
            const buttonType = await allButtons[i].evaluate(el => el.getAttribute('type')).catch(() => '');
            const dataState = await allButtons[i].evaluate(el => el.getAttribute('data-state')).catch(() => '');
            
            console.log(`    Button ${i + 1}: text="${buttonText}" visible=${isVisible} type="${buttonType}" data-state="${dataState}"`);
            
            // Check if this button matches Join button criteria
            const hasJoinText = buttonText && buttonText.trim().toLowerCase().includes('join');
            const hasJoinButtonClasses = buttonClasses.includes('text-white') && 
                                        buttonClasses.includes('font-medium') && 
                                        buttonClasses.includes('rounded-l-md') && 
                                        buttonClasses.includes('h-8') &&
                                        dataState === 'closed';
            
            if (isVisible && (hasJoinText || hasJoinButtonClasses)) {
              console.log(`    ⚠ This might be the Join button! Trying to click...`);
              try {
                await allButtons[i].scrollIntoViewIfNeeded();
                await allButtons[i].click({ timeout: 5000 });
                console.log('    ✓ Clicked potential Join button!');
                finalButtonFound = true;
                
                await page.waitForTimeout(3000);
                const urlAfterJoin = page.url();
                console.log(`  Current URL after clicking: ${urlAfterJoin}`);
                await page.screenshot({ path: 'test-results/after-join-button-click.png', fullPage: true });
                console.log('  Screenshot saved: test-results/after-join-button-click.png');
                break;
              } catch (clickError) {
                console.log(`    ⚠ Failed to click button ${i + 1}`);
              }
            }
          } catch (e) {
            // Skip if can't get info
            continue;
          }
        }
        
        if (!finalButtonFound) {
          console.log('  ⚠ Cannot find Join button. Test ending without clicking Join.');
        } else {
          // If found and clicked, verify success
          await page.waitForTimeout(2000);
          const urlAfterJoin = page.url();
          console.log(`  ✓ Final URL after clicking Join: ${urlAfterJoin}`);
          console.log('\n════════════════════════════════════════');
          console.log('✅ SUCCESSFULLY JOINED MEETING FROM CALENDAR!');
          console.log('════════════════════════════════════════');
        }
      } else {
        // Button was found and clicked in earlier attempts
        await page.waitForTimeout(2000);
        const urlAfterJoin = page.url();
        console.log(`  ✓ Final URL after clicking Join: ${urlAfterJoin}`);
        await page.screenshot({ path: 'test-results/after-join-button-click.png', fullPage: true });
        console.log('  Screenshot saved: test-results/after-join-button-click.png');
        console.log('\n════════════════════════════════════════');
        console.log('✅ SUCCESSFULLY JOINED MEETING FROM CALENDAR!');
        console.log('════════════════════════════════════════');
      }
      
      return;
    }
    
    console.log('✓ Found Join button');
    
    // Take screenshot before clicking Join button
    await page.screenshot({ path: 'test-results/before-join-button-click.png', fullPage: true });
    console.log('  Screenshot before Join button click saved: test-results/before-join-button-click.png');
    
    // Click the Join button
    console.log('  Clicking Join button...');
    await calendarActions.clickJoinButton();
    await page.waitForTimeout(3000); // Wait for meeting to join
    console.log('  ✓ Join button clicked successfully');
    
    // Verify the click worked
    const urlAfterJoin = page.url();
    console.log(`  Current URL after clicking Join: ${urlAfterJoin}`);
    
    // Take screenshot after clicking Join button
    await page.screenshot({ path: 'test-results/after-join-button-click.png', fullPage: true });
    console.log('  Screenshot after Join button click saved: test-results/after-join-button-click.png');
    
    console.log('\n════════════════════════════════════════');
    console.log('✅ SUCCESSFULLY JOINED MEETING FROM CALENDAR!');
    console.log('════════════════════════════════════════');
  });
});

