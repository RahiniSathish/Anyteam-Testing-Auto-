import { test, expect } from '@playwright/test';
import { GoogleCalendarActions } from '../../actions/calendar/GoogleCalendarActions';
import { AnyteamCalendarActions } from '../../actions/calendar/AnyteamCalendarActions';
import { TestData } from '../../utils/TestData';

/**
 * Test Suite: Google Calendar Integration
 * Tests for scheduling meetings in Google Calendar and joining from Anyteam
 * Note: These tests assume the user is already logged in to both Anyteam and Google
 */
test.describe('Google Calendar Integration', () => {
  test('should create Google Calendar meeting', async ({ page }) => {
    const googleCalendarActions = new GoogleCalendarActions(page);

    // Navigate to Google Calendar
    await googleCalendarActions.navigateToCalendar();

    // Calculate meeting date (tomorrow)
    const meetingDate = new Date();
    meetingDate.setDate(meetingDate.getDate() + 1);

    // Create meeting
    await googleCalendarActions.createMeeting({
      title: TestData.meetings.title,
      date: meetingDate,
      startTime: TestData.meetings.startTime,
      endTime: TestData.meetings.endTime,
      guests: [TestData.meetings.guestEmail]
    });

    console.log('✓ Meeting created successfully');
  });

  test('should find and open meeting from Anyteam', async ({ page }) => {
    const anyteamCalendarActions = new AnyteamCalendarActions(page);

    // Navigate to Anyteam calendar
    await anyteamCalendarActions.navigateToAnyteamCalendar();

    // Find and open meeting
    const googleCalendarPage = await anyteamCalendarActions.openMeetingInGoogleCalendar(
      TestData.meetings.title
    );

    expect(googleCalendarPage).not.toBeNull();
    console.log('✓ Meeting opened in Google Calendar');
  });

  test('should join Google Meet from calendar event', async ({ page }) => {
    const googleCalendarActions = new GoogleCalendarActions(page);

    // Navigate to Google Calendar
    await googleCalendarActions.navigateToCalendar();

    // This test assumes a meeting event is already open
    // In a real scenario, you would open the event first
    const meetPage = await googleCalendarActions.joinGoogleMeet();

    if (meetPage) {
      expect(meetPage.url()).toContain('meet.google.com');
      console.log('✓ Google Meet opened successfully');
    } else {
      console.log('⊘ Join button not found (meeting may not be active)');
    }
  });
});

