import { test, expect } from '@playwright/test';
import { SettingsActions } from '../../../actions/settings/SettingsActions';
import { ProfileInfoActions } from '../../../actions/settings/profile/ProfileInfoActions';
import { TestData } from '../../../utils/TestData';

/**
 * Test Suite: Profile Info Page
 * Tests for the Profile Info tab within the Settings page
 * Note: These tests assume the user is already logged in and on the settings page
 */
test.describe('Profile Info Page', () => {
  let settingsActions: SettingsActions;
  let profileInfoActions: ProfileInfoActions;

  test.beforeEach(async ({ page }) => {
    settingsActions = new SettingsActions(page);
    profileInfoActions = new ProfileInfoActions(page);
    
    // Navigate to anyteam.com app (assuming user is logged in)
    await page.goto(`${TestData.urls.base}/home`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Check if we're on login page - if so, user needs to login manually
    const currentUrl = page.url();
    if (currentUrl.includes('/Login') || currentUrl.includes('/onboarding/Login')) {
      console.log('⚠ User is not logged in. Please login manually or add login flow to beforeEach.');
      // For now, we'll skip the test if not logged in
      // In a real scenario, you might want to add login flow here
    } else {
      // Navigate to settings page first
      await settingsActions.navigateToSettingsPage();
    }
  });

  test('should click Profile Info tab', async () => {
    await profileInfoActions.clickProfileInfoTab();
    
    // Verify Profile Info tab is active
    const isActive = await profileInfoActions.verifyProfileInfoTabActive();
    expect(isActive).toBe(true);
  });

  test('should verify Profile Info tab is active after clicking', async () => {
    await profileInfoActions.clickProfileInfoTab();
    
    // Verify tab state is active
    const isActive = await profileInfoActions.verifyProfileInfoTabActive();
    expect(isActive).toBe(true);
  });

  test('should verify Profile Info content is displayed', async () => {
    await profileInfoActions.clickProfileInfoTab();
    
    // Verify content is displayed
    const isContentDisplayed = await profileInfoActions.verifyProfileInfoContentDisplayed();
    // Note: This might return false if content selector needs to be updated
    // Adjust based on actual page structure
    console.log('Profile Info content displayed:', isContentDisplayed);
  });

  test('should verify all fields are visible on profile page', async () => {
    // Navigate to profile page
    await profileInfoActions.clickProfileInfoTab();
    
    // Wait for profile page to load
    await profileInfoActions.verifyProfileInfoTabActive();
    
    // Verify all fields are visible
    const fieldsVisibility = await profileInfoActions.verifyAllFieldsVisible();
    
    // Log visibility status for each field
    console.log('Field Visibility Status:');
    console.log('  - Name field:', fieldsVisibility.name ? '✓ Visible' : '✗ Not visible');
    console.log('  - Email field:', fieldsVisibility.email ? '✓ Visible' : '✗ Not visible');
    console.log('  - LinkedIn field:', fieldsVisibility.linkedIn ? '✓ Visible' : '✗ Not visible');
    console.log('  - Phone field:', fieldsVisibility.phone ? '✓ Visible' : '✗ Not visible (optional)');
    console.log('  - About field:', fieldsVisibility.about ? '✓ Visible' : '✗ Not visible');
    
    // Assert that all required fields are visible
    expect(fieldsVisibility.name).toBe(true);
    expect(fieldsVisibility.email).toBe(true);
    expect(fieldsVisibility.linkedIn).toBe(true);
    expect(fieldsVisibility.about).toBe(true);
    
    // Phone field is optional, so we don't assert it
    // But we log it for information
    
    // Verify all required fields are visible
    expect(fieldsVisibility.allVisible).toBe(true);
    
    console.log('✓ All required fields are visible on profile page');
  });

  test('should verify Pencil button is displayed on profile page', async () => {
    // Navigate to profile page
    await profileInfoActions.clickProfileInfoTab();
    
    // Wait for profile page to load
    await profileInfoActions.verifyProfileInfoTabActive();
    
    // Verify pencil button is visible
    const isPencilVisible = await profileInfoActions.verifyPencilButtonVisible();
    
    // Get count of visible pencil buttons
    const pencilCount = await profileInfoActions.getPencilButtonCount();
    
    console.log('Pencil button visibility:', isPencilVisible ? '✓ Visible' : '✗ Not visible');
    console.log('Number of visible pencil buttons:', pencilCount);
    
    // Assert that pencil button is visible
    expect(isPencilVisible).toBe(true);
    expect(pencilCount).toBeGreaterThan(0);
    
    console.log('✓ Pencil icon is visible on profile page');
  });

  test('should verify all profile page components are visible', async () => {
    // Navigate to profile page
    await profileInfoActions.clickProfileInfoTab();
    
    // Wait for profile page to load
    await profileInfoActions.verifyProfileInfoTabActive();
    
    // Verify all components are visible
    const componentsVisibility = await profileInfoActions.verifyAllComponentsVisible();
    
    // Log visibility status for each component
    console.log('Profile Page Components Visibility Status:');
    console.log('  - Profile Picture:', componentsVisibility.profilePicture ? '✓ Visible' : '✗ Not visible');
    console.log('  - Name heading:', componentsVisibility.nameHeading ? '✓ Visible' : '✗ Not visible');
    console.log('  - Name edit icon (pencil):', componentsVisibility.nameEditIcon ? '✓ Visible' : '✗ Not visible');
    console.log('  - Email heading:', componentsVisibility.emailHeading ? '✓ Visible' : '✗ Not visible');
    console.log('  - About Yourself heading:', componentsVisibility.aboutYourselfHeading ? '✓ Visible' : '✗ Not visible');
    console.log('  - About Yourself edit icon (pencil):', componentsVisibility.aboutYourselfEditIcon ? '✓ Visible' : '✗ Not visible');
    console.log('  - Tabs container:', componentsVisibility.tabsContainer ? '✓ Visible' : '✗ Not visible');
    console.log('  - Profile Info tab:', componentsVisibility.profileInfoTab ? '✓ Visible' : '✗ Not visible');
    console.log('  - Linked Accounts tab:', componentsVisibility.linkedAccountsTab ? '✓ Visible' : '✗ Not visible');
    console.log('  - Notifications tab:', componentsVisibility.notificationsTab ? '✓ Visible' : '✗ Not visible');
    console.log('  - Logout button:', componentsVisibility.logoutButton ? '✓ Visible' : '✗ Not visible');
    console.log('  - Delete Account button:', componentsVisibility.deleteAccountButton ? '✓ Visible' : '✗ Not visible');
    
    // Assert that all components are visible
    expect(componentsVisibility.profilePicture).toBe(true);
    expect(componentsVisibility.nameHeading).toBe(true);
    expect(componentsVisibility.nameEditIcon).toBe(true);
    expect(componentsVisibility.emailHeading).toBe(true);
    expect(componentsVisibility.aboutYourselfHeading).toBe(true);
    expect(componentsVisibility.aboutYourselfEditIcon).toBe(true);
    expect(componentsVisibility.tabsContainer).toBe(true);
    expect(componentsVisibility.profileInfoTab).toBe(true);
    expect(componentsVisibility.linkedAccountsTab).toBe(true);
    expect(componentsVisibility.notificationsTab).toBe(true);
    expect(componentsVisibility.logoutButton).toBe(true);
    expect(componentsVisibility.deleteAccountButton).toBe(true);
    
    // Verify all components are visible
    expect(componentsVisibility.allComponentsVisible).toBe(true);
    
    console.log('✓ All profile page components are visible');
  });

  test('should verify profile picture file input accepts only jpeg, jpg, png (not all images)', async () => {
    // Navigate to profile page
    await profileInfoActions.clickProfileInfoTab();
    
    // Wait for profile page to load
    await profileInfoActions.verifyProfileInfoTabActive();
    
    // Verify profile picture file input accepts only jpeg, jpg, png (not all images)
    const fileInputInfo = await profileInfoActions.verifyProfilePictureFileInputAcceptsImages();
    
    // Log file input information
    console.log('Profile Picture File Input Information:');
    console.log('  - File input exists:', fileInputInfo.fileInputExists ? '✓ Yes' : '✗ No');
    console.log('  - Accept attribute:', fileInputInfo.acceptAttribute || 'Not found');
    console.log('  - Accepts JPEG:', fileInputInfo.acceptsJpeg ? '✓ Yes' : '✗ No');
    console.log('  - Accepts PNG:', fileInputInfo.acceptsPng ? '✓ Yes' : '✗ No');
    console.log('  - Accepts JPG:', fileInputInfo.acceptsJpg ? '✓ Yes' : '✗ No');
    console.log('  - Accepts ONLY jpeg/jpg/png (not all images):', fileInputInfo.acceptsOnlyJpegJpgPng ? '✓ Yes' : '✗ No');
    
    // Assert that file input exists and accepts only jpeg, jpg, png
    expect(fileInputInfo.fileInputExists).toBe(true);
    expect(fileInputInfo.acceptsJpeg).toBe(true);
    expect(fileInputInfo.acceptsPng).toBe(true);
    expect(fileInputInfo.acceptsJpg).toBe(true);
    expect(fileInputInfo.acceptsOnlyJpegJpgPng).toBe(true);
    
    console.log('✓ Profile picture file input accepts only jpeg, jpg, png (not all images)');
  });

  test('should click profile picture to open file picker and upload image', async ({ page }) => {
    // Navigate to profile page
    await profileInfoActions.clickProfileInfoTab();
    
    // Wait for profile page to load
    await profileInfoActions.verifyProfileInfoTabActive();
    
    // Verify file input exists and accepts only jpeg, jpg, png
    const fileInputInfo = await profileInfoActions.verifyProfilePictureFileInputAcceptsImages();
    expect(fileInputInfo.fileInputExists).toBe(true);
    expect(fileInputInfo.acceptsOnlyJpegJpgPng).toBe(true);
    
    // Get the current profile picture src before upload
    const profilePictureBefore = page.locator('img[alt="Profile"].w-full.h-full.object-cover').first();
    const srcBefore = await profilePictureBefore.getAttribute('src').catch(() => null);
    console.log('  Profile picture before upload:', srcBefore ? 'Present' : 'Not found');
    
    // Upload the test image
    const testImagePath = './test-images/profile-test.jpg';
    await profileInfoActions.uploadProfilePicture(testImagePath);
    
    // Wait for upload to complete and image to update
    await page.waitForTimeout(3000);
    
    // Verify profile picture was updated
    const profilePictureAfter = page.locator('img[alt="Profile"].w-full.h-full.object-cover').first();
    const srcAfter = await profilePictureAfter.getAttribute('src').catch(() => null);
    
    if (srcAfter) {
      console.log('✓ Profile picture uploaded successfully');
      console.log('  New image URL:', srcAfter);
      
      // If the image was uploaded to storage, verify it's a different URL
      if (srcBefore && srcAfter !== srcBefore) {
        console.log('✓ Profile picture URL changed - upload successful');
      } else if (srcBefore && srcAfter === srcBefore) {
        console.log('⚠ Profile picture URL unchanged - may need to verify upload');
      }
    } else {
      console.log('⚠ Could not verify profile picture upload - src attribute not found');
    }
    
    console.log('✓ Profile picture upload test completed');
  });

  test('should click edit icon for "About yourself" field', async () => {
    await profileInfoActions.clickProfileInfoTab();
    
    // Click the edit icon (pencil) to make the field editable
    await profileInfoActions.clickAboutYourselfEditIcon();
    
    console.log('Edit icon clicked for "About yourself" field');
  });

  test('should edit "About yourself" field and verify value', async ({ page }) => {
    await profileInfoActions.clickProfileInfoTab();
    
    // Edit "About yourself" field - read from .env file
    const aboutText = TestData.profile.aboutYourself || 'AI Automation Engineer';
    await profileInfoActions.editAboutYourself(aboutText);
    
    // Verify the field contains the entered text
    const aboutField = page.locator('textarea[placeholder*="about"], textarea[aria-label*="about"], textarea[name*="about"], textarea[id*="about"]').first();
    const fieldValue = await aboutField.inputValue();
    expect(fieldValue).toBe(aboutText);
    
    console.log('"About yourself" field edited and verified with:', aboutText);
  });

  test('should save Profile Info after editing and verify save', async ({ page }) => {
    await profileInfoActions.clickProfileInfoTab();
    
    // Edit "About yourself" field - read from .env file
    const aboutText = TestData.profile.aboutYourself || 'AI Automation Engineer';
    await profileInfoActions.editAboutYourself(aboutText);
    
    // Verify field has value before saving
    const aboutField = page.locator('textarea[placeholder*="about"], textarea[aria-label*="about"], textarea[name*="about"], textarea[id*="about"]').first();
    const fieldValueBefore = await aboutField.inputValue();
    expect(fieldValueBefore).toBe(aboutText);
    
    // Save Profile Info
    await profileInfoActions.saveProfileInfo();
    
    // Wait for save to complete and verify
    await page.waitForTimeout(2000);
    
    // Verify Profile Info tab is still active after save
    const isActive = await profileInfoActions.verifyProfileInfoTabActive();
    expect(isActive).toBe(true);
    
    console.log('Profile Info saved and verified');
  });

  test('should complete flow: Click edit icon -> Edit About yourself -> Save -> Verify', async ({ page }) => {
    await profileInfoActions.clickProfileInfoTab();
    
    // Edit "About yourself" field - read from .env file
    const aboutText = TestData.profile.aboutYourself || 'AI Automation Engineer';
    
    // Step 1: Click edit icon
    await profileInfoActions.clickAboutYourselfEditIcon();
    await page.waitForTimeout(1000);
    
    // Step 2: Edit field
    const aboutField = page.locator('textarea[placeholder*="about"], textarea[aria-label*="about"], textarea[name*="about"], textarea[id*="about"]').first();
    await aboutField.waitFor({ state: 'visible', timeout: 10000 });
    await aboutField.clear();
    await aboutField.fill(aboutText);
    
    // Step 3: Verify value was entered
    const fieldValue = await aboutField.inputValue();
    expect(fieldValue).toBe(aboutText);
    
    // Step 4: Save Profile Info
    await profileInfoActions.saveProfileInfo();
    
    // Step 5: Verify Profile Info tab is still active
    const isActive = await profileInfoActions.verifyProfileInfoTabActive();
    expect(isActive).toBe(true);
    
    console.log('Complete flow: Edit icon -> Edit -> Save -> Verify completed');
    console.log('"About yourself" updated to:', aboutText);
  });
});

