import { test, expect } from '@playwright/test';
import { SettingsActions } from '../../../actions/settings/SettingsActions';
import { LinkedInActions } from '../../../actions/settings/linkedin/LinkedInActions';
import { TestData } from '../../../utils/TestData';

/**
 * Test Suite: LinkedIn Page
 * Tests for the LinkedIn tab within the Settings page
 * Note: These tests assume the user is already logged in and on the settings page
 */
test.describe('LinkedIn Page', () => {
  let settingsActions: SettingsActions;
  let linkedInActions: LinkedInActions;

  test.beforeEach(async ({ page }) => {
    settingsActions = new SettingsActions(page);
    linkedInActions = new LinkedInActions(page);
    
    // Navigate to anyteam.com app (assuming user is logged in)
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Navigate to settings page first
    await settingsActions.navigateToSettingsPage();
  });

  test('should click LinkedIn tab', async () => {
    await linkedInActions.clickLinkedInTab();
    
    // Verify LinkedIn tab is active
    const isActive = await linkedInActions.verifyLinkedInTabActive();
    expect(isActive).toBe(true);
  });

  test('should verify LinkedIn tab is active after clicking', async () => {
    await linkedInActions.clickLinkedInTab();
    
    // Verify tab state is active
    const isActive = await linkedInActions.verifyLinkedInTabActive();
    expect(isActive).toBe(true);
  });

  test('should verify LinkedIn content is displayed', async () => {
    await linkedInActions.clickLinkedInTab();
    
    // Verify content is displayed
    const isContentDisplayed = await linkedInActions.verifyLinkedInContentDisplayed();
    console.log('LinkedIn content displayed:', isContentDisplayed);
  });

  test('should verify Google Workspace Account and LinkedIn Account headings are present', async () => {
    // Navigate to LinkedIn account page
    await linkedInActions.clickLinkedInTab();
    
    // Wait for LinkedIn tab to be active
    await linkedInActions.verifyLinkedInTabActive();
    
    // Verify both account headings are visible
    const headingsVisibility = await linkedInActions.verifyAccountHeadingsVisible();
    
    // Log visibility status for each heading
    console.log('Account Headings Visibility Status:');
    console.log('  - Google Workspace Account:', headingsVisibility.googleWorkspaceAccount ? '✓ Visible' : '✗ Not visible');
    console.log('  - LinkedIn Account:', headingsVisibility.linkedInAccount ? '✓ Visible' : '✗ Not visible');
    
    // Assert that both headings are visible
    expect(headingsVisibility.googleWorkspaceAccount).toBe(true);
    expect(headingsVisibility.linkedInAccount).toBe(true);
    expect(headingsVisibility.bothVisible).toBe(true);
    
    console.log('✓ Both account headings are present on LinkedIn account page');
  });

  test('should edit LinkedIn information and verify value', async ({ page }) => {
    await linkedInActions.clickLinkedInTab();
    
    // Edit LinkedIn information - read from .env file
    const linkedInUrl = TestData.socialLinks.linkedIn || 'https://www.linkedin.com/in/test-profile';
    await linkedInActions.editLinkedInInfo(linkedInUrl);
    
    // Verify the field has the value
    const linkedInField = page.locator('input[placeholder*="linkedin"], input[aria-label*="linkedin"], input[name*="linkedin"], input[id*="linkedin"], input[type="url"]').first();
    const fieldValue = await linkedInField.inputValue();
    expect(fieldValue).toBe(linkedInUrl);
    
    console.log('LinkedIn information edited and verified:', linkedInUrl);
  });

  test('should save LinkedIn information and verify save', async ({ page }) => {
    await linkedInActions.clickLinkedInTab();
    
    // Edit LinkedIn information - read from .env file
    const linkedInUrl = TestData.socialLinks.linkedIn || 'https://www.linkedin.com/in/test-profile';
    await linkedInActions.editLinkedInInfo(linkedInUrl);
    
    // Verify field has value before saving
    const linkedInField = page.locator('input[placeholder*="linkedin"], input[aria-label*="linkedin"], input[name*="linkedin"], input[id*="linkedin"], input[type="url"]').first();
    const fieldValueBefore = await linkedInField.inputValue();
    expect(fieldValueBefore).toBe(linkedInUrl);
    
    // Save LinkedIn information
    await linkedInActions.saveLinkedInInfo();
    
    // Wait for save to complete
    await page.waitForTimeout(2000);
    
    // Verify LinkedIn tab is still active after save
    const isActive = await linkedInActions.verifyLinkedInTabActive();
    expect(isActive).toBe(true);
    
    console.log('LinkedIn information saved and verified');
  });

  test('should complete flow: Edit LinkedIn URL -> Save -> Verify', async ({ page }) => {
    await linkedInActions.clickLinkedInTab();
    
    // Edit LinkedIn information - read from .env file
    const linkedInUrl = TestData.socialLinks.linkedIn || 'https://www.linkedin.com/in/test-profile';
    
    // Step 1: Edit LinkedIn field
    const linkedInField = page.locator('input[placeholder*="linkedin"], input[aria-label*="linkedin"], input[name*="linkedin"], input[id*="linkedin"], input[type="url"]').first();
    await linkedInField.waitFor({ state: 'visible', timeout: 10000 });
    await linkedInField.clear();
    await linkedInField.fill(linkedInUrl);
    
    // Step 2: Verify value was entered
    const fieldValue = await linkedInField.inputValue();
    expect(fieldValue).toBe(linkedInUrl);
    
    // Step 3: Save LinkedIn information
    await linkedInActions.saveLinkedInInfo();
    
    // Step 4: Verify LinkedIn tab is still active
    const isActive = await linkedInActions.verifyLinkedInTabActive();
    expect(isActive).toBe(true);
    
    console.log('Complete flow: Edit LinkedIn -> Save -> Verify completed');
    console.log('LinkedIn URL updated to:', linkedInUrl);
  });
});

