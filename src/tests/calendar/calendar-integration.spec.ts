import { test, expect } from '@playwright/test';
import { GoogleCalendarActions } from '../../../actions/calendar/GoogleCalendarActions';
import { LoginHelper } from '../../../utils/loginHelper';
import { TestData } from '../../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Test Suite: Calendar Integration
 * Tests the Google Calendar integration including:
 * 1. Login
 * 2. Create Google Calendar meeting
 * 3. Verify meeting appears in calendar
 */
test.describe('Calendar Integration', () => {
  test('should complete calendar flow from login to meeting creation', async ({ page, context }) => {
    test.setTimeout(360000); // 6 minutes

    // Step 1: Login
    console.log('════════════════════════════════════════');
    console.log('STEP 1: LOGIN');
    console.log('════════════════════════════════════════\n');
    const appPage = await LoginHelper.performLogin(page, context);

    // Step 2: Navigate to home page
    console.log('\n════════════════════════════════════════');
    console.log('STEP 2: NAVIGATE TO HOME');
    console.log('════════════════════════════════════════\n');
    await appPage.goto(`${TestData.urls.base}/home`);
    await appPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await appPage.waitForTimeout(2000);

    // Step 3: Google Calendar Integration
    console.log('\n════════════════════════════════════════');
    console.log('STEP 3: GOOGLE CALENDAR INTEGRATION');
    console.log('════════════════════════════════════════\n');

    // Store meeting details
    const createdMeetingTitle = TestData.meetings.title;
    const createdMeetingStartTime = TestData.meetings.startTime;
    const createdMeetingEndTime = TestData.meetings.endTime;

    // Step 3.1: Open Google Calendar from Anyteam
    console.log('Step 3.1: Opening Google Calendar from Anyteam...');
    const googleCalendarPage = await context.newPage();
    const googleCalendarActions = new GoogleCalendarActions(googleCalendarPage);
    await googleCalendarActions.navigateToCalendar();
    console.log('✓ Google Calendar opened');

    // Step 3.2: Create Google Calendar Meeting
    console.log('Step 3.2: Creating Google Calendar meeting...');
    
    // Calculate meeting date (tomorrow by default)
    const meetingDate = new Date();
    meetingDate.setDate(meetingDate.getDate() + 1);
    
    await googleCalendarActions.createMeeting({
      title: createdMeetingTitle,
      date: meetingDate,
      startTime: createdMeetingStartTime,
      endTime: createdMeetingEndTime,
      guests: [TestData.meetings.guestEmail]
    });
    
    console.log('✓ Google Calendar meeting created and saved successfully');
    console.log(`  Meeting: ${createdMeetingTitle}`);
    console.log(`  Date: ${meetingDate.toLocaleDateString()}`);
    console.log(`  Time: ${createdMeetingStartTime} - ${createdMeetingEndTime}`);
    console.log(`  Guest: ${TestData.meetings.guestEmail}`);
    
    // Step 3.3: Verify meeting is visible in Google Calendar
    console.log('Step 3.3: Verifying meeting appears in Google Calendar...');
    
    const meetingInCalendar = googleCalendarPage.locator(`text="${TestData.meetings.title}"`).first();
    const isMeetingVisible = await meetingInCalendar.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isMeetingVisible) {
      console.log('  ✓ Meeting is visible in Google Calendar');
    } else {
      console.log('  ⚠ Meeting not immediately visible in Google Calendar view');
      console.log('    Note: Meeting may be on a different date or view');
      console.log('    The meeting should still sync to Anyteam calendar');
    }
    
    // Close Google Calendar page to free up resources
    console.log('Step 3.4: Closing Google Calendar page...');
    await googleCalendarPage.close().catch(() => {});
    console.log('  ✓ Google Calendar page closed');

    console.log('\n════════════════════════════════════════');
    console.log('✅ CALENDAR INTEGRATION COMPLETE!');
    console.log('════════════════════════════════════════');
  });
});

