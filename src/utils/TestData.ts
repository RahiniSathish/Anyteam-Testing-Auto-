/**
 * Test data constants and utilities
 * Reads test email from environment variables
 */

export const TestData = {
  emails: {
    validBusiness: 'test@company.com',
    validPersonal: 'test@gmail.com',
    // Read from .env file
    testUser: process.env.TEST_EMAIL || 'satish@anyteam.com',
    satishAnyteam: process.env.TEST_EMAIL || 'satish@anyteam.com',
    invalid: 'invalid-email',
    empty: '',
  },
  passwords: {
    // Read from .env file - password is never displayed in logs or screenshots
    testPassword: process.env.TEST_PASSWORD || '',
  },
  names: {
    // Read from .env file
    testName: process.env.TEST_NAME || 'satisha',
  },
  socialLinks: {
    // Read from .env file
    linkedIn: process.env.LINKEDIN_URL || 'satishlinkedin.com',
  },
  profile: {
    // Read from .env file
    aboutYourself: process.env.ABOUT_YOURSELF || 'AI Automation Engineer',
  },
  meetings: {
    // Meeting details - can be read from .env or use defaults
    title: process.env.MEETING_TITLE || 'Team Standup Meeting',
    guestEmail: process.env.MEETING_GUEST_EMAIL || 'sathish@fourentech.ai',
    startTime: process.env.MEETING_START_TIME || '2:00pm',
    endTime: process.env.MEETING_END_TIME || '3:00pm',
    // Meeting date will be calculated (tomorrow by default)
  },
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
    veryLong: 30000,
  },
  urls: {
    login: '/onboarding/Login',
    base: process.env.BASE_URL || 'https://app.dev.anyteam.com',
  },
} as const;

