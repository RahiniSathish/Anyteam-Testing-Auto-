import { Page, BrowserContext } from '@playwright/test';
import { LoginActions } from '../actions/login/LoginActions';
import { GoogleOAuthActions } from '../actions/login/GoogleOAuthActions';
import { TestData } from './TestData';

/**
 * Shared login helper utility
 * Provides reusable login functionality for all test files
 * Uses automated Google OAuth login flow
 */
export class LoginHelper {
  /**
   * Complete login flow - handles automated OAuth and navigation to home page
   * Returns the authenticated page after successful login
   */
  static async performLogin(page: Page, context: BrowserContext, timeout: number = 360000): Promise<Page> {
    console.log('🔐 Starting automated login flow...');

    const loginActions = new LoginActions(page);
    let activePage: any = page;

    // Step 1: Clear only Anyteam app storage (keep Google session if available)
    console.log('Step 1: Clearing Anyteam app session...');
    const baseUrl = new URL(TestData.urls.base);
    const domain = baseUrl.hostname;
    const authDomain = domain.replace('app.', 'auth.');
    await context.clearCookies({ domain });
    await context.clearCookies({ domain: authDomain });

    // Step 2: Navigate to login page
    console.log('Step 2: Navigating to login page...');
    await loginActions.navigateToLoginPage();
    await page.waitForTimeout(2000);

    // Step 3: Check if Continue with Google button is visible
    console.log('Step 3: Verifying Continue with Google button...');
    const continueButton = page.locator('p:has-text("Continue with Google")');
    const isContinueVisible = await continueButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (isContinueVisible) {
      // Step 4: Click Continue with Google
      console.log('Step 4: Clicking Continue with Google...');
      const continueButtonElement = continueButton.locator('..');
      const navigationPromise = page.waitForURL('**/*', { timeout: 15000 }).catch(() => null);
      const popupPromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);

      await continueButtonElement.click();
      const [popup] = await Promise.all([popupPromise, navigationPromise]);

      if (popup) {
        console.log('Popup opened');
        activePage = popup;
        await activePage.waitForLoadState('domcontentloaded').catch(() => {});
      }

      console.log('Active page URL:', activePage.url());

      // Step 5: Check if we need to continue with OAuth or if already logged in
      console.log('Step 5: Checking if OAuth flow is needed...');
      await page.waitForTimeout(1000);

      const currentPageUrl = activePage.isClosed() ? page.url() : activePage.url();
      const currentUrl = new URL(currentPageUrl);
      const isAlreadyLoggedIn = currentUrl.hostname.includes('anyteam.com');

      if (!isAlreadyLoggedIn) {
        // Handle automated OAuth login
        console.log('On Google OAuth page, proceeding with automated OAuth flow...');
        
        if (activePage.isClosed()) {
          throw new Error('OAuth page was closed unexpectedly');
        }

        const googleOAuthActions = new GoogleOAuthActions(activePage);

        // Handle "Use another account" if visible
        const isUseAnotherVisible = await googleOAuthActions.isUseAnotherAccountVisible();
        if (isUseAnotherVisible) {
          console.log('"Use another account" link found, clicking...');
          await googleOAuthActions.clickUseAnotherAccount();
        }

        // Enter email
        console.log('Step 6: Entering email...');
        await googleOAuthActions.enterEmail(TestData.emails.testUser);
        await googleOAuthActions.clickNextAfterEmail();
        await activePage.waitForTimeout(1500);

        // Enter password
        console.log('Step 7: Entering password...');
        await googleOAuthActions.enterPassword(TestData.passwords.testPassword);
        await googleOAuthActions.clickNextAfterPassword();
        await activePage.waitForTimeout(3000);

        // Handle Continue/Allow buttons
        console.log('Step 8: Looking for Continue or Allow buttons...');
        try {
          await googleOAuthActions.clickContinueOnConsentPage();
          console.log('✓ Clicked Continue button');
          await activePage.waitForTimeout(2000);

          await googleOAuthActions.clickAllowOnPermissionsPage();
          console.log('✓ Clicked Allow button');
        } catch (e) {
          console.log('Continue/Allow buttons not found or already processed');
        }

        await activePage.waitForTimeout(3000);
      } else {
        console.log('✓ Already logged in, skipping OAuth flow');
        activePage = page;
      }
    }

    // Step 6: Wait for redirect to anyteam.com and find the correct page
    console.log('Step 9: Waiting for redirect to anyteam.com...');
    let appPage = page;

    try {
      // Wait for navigation to anyteam.com - check all pages in context
      await Promise.race([
        page.waitForURL('**/anyteam.com/**', { timeout: 30000 }),
        activePage.waitForURL('**/anyteam.com/**', { timeout: 30000 }),
      ]).catch(() => {
        console.log('Timeout waiting for anyteam.com URL, checking all pages...');
      });

      // Check all pages in the context to find the one that redirected to anyteam.com
      const allPages = context.pages();
      let foundAnyteamPage = false;
      
      for (const testPage of allPages) {
        try {
          const url = testPage.url();
          if (url.includes('anyteam.com') && !url.includes('accounts.google.com')) {
            appPage = testPage;
            foundAnyteamPage = true;
            console.log('Found anyteam.com page:', url);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      // If not found in pages, check the current pages
      if (!foundAnyteamPage) {
        try {
          const pageUrl = page.url();
          const activePageUrl = activePage.url();
          
          if (pageUrl.includes('anyteam.com') && !pageUrl.includes('accounts.google.com')) {
            appPage = page;
            foundAnyteamPage = true;
            console.log('Main page redirected to anyteam.com');
          } else if (activePageUrl.includes('anyteam.com') && !activePageUrl.includes('accounts.google.com')) {
            appPage = activePage;
            foundAnyteamPage = true;
            console.log('Active page redirected to anyteam.com');
          }
        } catch (e) {
          console.log('Error checking page URLs:', e);
        }
      }

      // Verify we're on anyteam.com
      const appPageUrl = appPage.url();
      if (!foundAnyteamPage || !appPageUrl.includes('anyteam.com')) {
        throw new Error(`Failed to redirect to anyteam.com. Current URL: ${appPageUrl}`);
      }

      await appPage.waitForLoadState('load', { timeout: 20000 });
      await appPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
        console.log('Network idle timeout, but continuing...');
      });

      console.log('Final app URL:', appPage.url());
      console.log('✓ Successfully redirected to anyteam.com');
    } catch (error) {
      console.log('Error during redirect:', error);
      throw error;
    }

    // Step 7: Handle onboarding page
    console.log('Step 10: Handling onboarding page if present...');
    let appPageUrlCheck = appPage.url();
    console.log('Current URL before handling onboarding:', appPageUrlCheck);
    
    if (!appPageUrlCheck.includes('anyteam.com')) {
      throw new Error(`Not on anyteam.com page. Current URL: ${appPageUrlCheck}`);
    }
    
    // Handle onboarding page - wait for loading to complete, then navigate to home
    if (appPageUrlCheck.includes('/onboarding')) {
      console.log('On onboarding page, waiting for loading to complete...');

      // Extract JWT token from URL if present
      const url = new URL(appPageUrlCheck);
      const jwt = url.searchParams.get('jwt');
      const userId = url.searchParams.get('userId');
      
      if (jwt && userId) {
        console.log('JWT token found in URL, storing in localStorage...');
        await appPage.evaluate((args: { token: string; uid: string }) => {
          try {
            const win = globalThis as any;
            win.localStorage?.setItem('jwt', args.token);
            win.localStorage?.setItem('userId', args.uid);
            win.localStorage?.setItem('auth_status', 'SUCCESS');
          } catch (e) {
            console.log('Could not store JWT in localStorage:', e);
          }
        }, { token: jwt, uid: userId });
        console.log('JWT stored in localStorage');
      }

      // Wait for loading spinner to disappear
      console.log('Waiting for loading spinner to disappear...');
      try {
        await appPage.waitForFunction(() => {
          const win = globalThis as any;
          const body = win.document.body;
          const loadingElements = body.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="loader"], [data-testid*="loading"]');
          const hasVisibleLoading = Array.from(loadingElements).some((el: any) => {
            const style = win.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          });
          return !hasVisibleLoading;
        }, { timeout: 30000 }).catch(() => {
          console.log('Loading check timeout, but continuing...');
        });
        console.log('✓ Loading spinner disappeared');
      } catch (e) {
        console.log('Could not detect loading state, waiting fixed time...');
        await appPage.waitForTimeout(10000);
      }

      await appPage.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {
        console.log('Network idle timeout, but continuing...');
      });
      await appPage.waitForTimeout(5000);

      // Wait for automatic navigation away from onboarding
      console.log('Waiting for automatic navigation to home page...');
      try {
        await appPage.waitForURL((url: URL) => 
          url.href.includes('anyteam.com') && !url.href.includes('/onboarding') && !url.href.includes('/Login'),
          { timeout: 30000 }
        );
        appPageUrlCheck = appPage.url();
        console.log('✓ Auto-navigated away from onboarding to:', appPageUrlCheck);
      } catch (e) {
        console.log('No auto-navigation detected after 30s, checking page state...');
        appPageUrlCheck = appPage.url();
        
        // Check if home page content is already visible
        const hasHomeContent = await appPage.locator('text=/Good (Morning|Afternoon|Evening)/i').isVisible({ timeout: 5000 }).catch(() => false);
        const hasAskAI = await appPage.locator('text=/Ask AI/i').isVisible({ timeout: 5000 }).catch(() => false);
        const hasSidebar = await appPage.locator('[data-sidebar], button[data-sidebar="menu-button"]').first().isVisible({ timeout: 5000 }).catch(() => false);
        
        if (hasHomeContent || hasAskAI || hasSidebar) {
          console.log('✓ Home page content is visible on onboarding page - app has loaded!');
          await appPage.waitForTimeout(5000);
          appPageUrlCheck = appPage.url();
        } else {
          console.log('Home page content not visible - navigating manually to /home...');
          await appPage.evaluate(() => {
            const win = globalThis as any;
            win.location.href = '/home';
          });
          await appPage.waitForTimeout(3000);
          await appPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
          appPageUrlCheck = appPage.url();
          console.log('✓ Manually navigated to:', appPageUrlCheck);
        }
      }
    }
    
    // Step 8: Final URL check and session recovery
    appPageUrlCheck = appPage.url();
    console.log('Final URL before looking for sidebar:', appPageUrlCheck);

    // Check if we're back on login page (session lost)
    if (appPageUrlCheck.includes('/Login') || appPageUrlCheck.includes('/onboarding/Login')) {
      console.log('⚠ Session lost - redirected back to login page');
      console.log('Attempting to navigate to /home...');
      await appPage.goto(`${TestData.urls.base}/home`, { timeout: 15000, waitUntil: 'domcontentloaded' }).catch(() => {});
      await appPage.waitForTimeout(3000);
      const newUrl = appPage.url();
      if (newUrl.includes('/Login')) {
        throw new Error('Session was lost and could not be recovered. The app redirected back to login.');
      }
      appPageUrlCheck = newUrl;
      console.log('✓ Navigated to:', appPageUrlCheck);
    }

    // Step 9: Verify we're logged in and on home page
    await appPage.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {
      console.log('Page load state check timeout, but continuing...');
    });
    await appPage.waitForTimeout(3000);

    // Check if home page content is visible
    console.log('Checking if home page content is visible...');
    const homePageIndicators = [
      appPage.locator('text=/Good (Morning|Afternoon|Evening)/i'),
      appPage.locator('[data-sidebar]'),
      appPage.locator('button[data-sidebar="menu-button"]'),
      appPage.locator('text=/Ask AI/i'),
    ];
    
    let homePageVisible = false;
    for (const indicator of homePageIndicators) {
      try {
        const isVisible = await indicator.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
          homePageVisible = true;
          console.log('✓ Home page content detected');
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!homePageVisible) {
      // Try navigating to /home if not already there
      const currentUrl = appPage.url();
      if (!currentUrl.includes('/home')) {
        console.log('Home page content not visible, navigating to /home...');
        await appPage.goto(`${TestData.urls.base}/home`, { timeout: 15000, waitUntil: 'networkidle' }).catch(() => {});
        await appPage.waitForTimeout(3000);
      }
    }

    const finalUrl = appPage.url();
    const isOnHomePage = await appPage.locator('button[data-sidebar="menu-button"]').first().isVisible({ timeout: 10000 }).catch(() => false);

    console.log(`✅ Automated login complete! On home page: ${isOnHomePage}`);
    console.log(`Current URL: ${finalUrl}`);

    return appPage;
  }
}
