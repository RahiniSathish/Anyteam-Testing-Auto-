import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';

/**
 * Global Setup: Login once manually and save authentication state
 * This runs ONCE before all tests to authenticate and save the session
 * 
 * Instructions:
 * 1. Run this once: npx playwright test --global-setup
 * 2. Or it runs automatically before test suite
 * 3. When browser opens, login manually with Google
 * 4. Once on /home page, auth state is saved to auth.json
 */
async function globalSetup(config: FullConfig) {
  console.log('\n🔐 GLOBAL SETUP: Authentication');
  console.log('════════════════════════════════════════');
  console.log('👉 A browser will open - please login manually with Google');
  console.log('👉 Wait until you are on the /home page');
  console.log('👉 The browser will close automatically after saving auth state');
  console.log('════════════════════════════════════════\n');

  const baseURL = config.projects[0].use.baseURL || 'https://app.stage.anyteam.com';
  const browser = await chromium.launch({ 
    headless: false, // Must be visible for manual login
    channel: 'chrome' // Use Chrome for better compatibility
  });
  
  const context = await browser.newContext({
    baseURL: baseURL,
  });
  
  const page = await context.newPage();

  try {
    // Navigate to login page or home page
    console.log(`📡 Navigating to: ${baseURL}`);
    await page.goto('/onboarding/Login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('\n⏳ Waiting for you to login manually...');
    console.log('   → Click "Continue with Google"');
    console.log('   → Complete Google authentication');
    console.log('   → Wait until you reach the /home page\n');

    // Wait for navigation to /home page (indicates successful login)
    // Increased timeout to 2 minutes for manual login
    await page.waitForURL('**/home', { 
      timeout: 120000, // 2 minutes for manual login
      waitUntil: 'domcontentloaded'
    });

    console.log('✅ Login successful! Detected /home page');
    
    // Wait a bit more to ensure all auth cookies/tokens are set
    await page.waitForTimeout(3000);

    // Save authentication state to auth.json
    const authPath = path.join(process.cwd(), 'auth.json');
    await context.storageState({ path: authPath });
    
    console.log(`✅ Authentication state saved to: ${authPath}`);
    console.log('✅ All tests will now use this saved authentication\n');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;

