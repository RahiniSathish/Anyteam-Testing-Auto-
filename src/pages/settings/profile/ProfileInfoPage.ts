import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Profile Info Page
 * Represents the Profile Info tab within the Settings page
 */
export class ProfileInfoPage {
  readonly page: Page;

  // Profile Info tab
  readonly profileInfoTab: Locator;

  // Profile Info form elements
  readonly profileInfoContent: Locator;
  readonly aboutYourselfEditIcon: Locator; // Pencil/edit icon for "About yourself"
  readonly aboutYourselfField: Locator; // Textarea or input for "About yourself"
  readonly saveButton: Locator; // Save button for Profile Info
  readonly pencilButtons: Locator; // All pencil/edit icons on the profile page

  // All profile fields
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly linkedInField: Locator;
  readonly phoneField: Locator; // May or may not exist
  readonly aboutField: Locator;

  // Additional profile page components
  readonly profilePicture: Locator;
  readonly profilePictureFileInput: Locator; // Hidden file input for profile picture upload
  readonly nameEditIcon: Locator; // Edit icon for Name field
  readonly nameHeading: Locator; // Name heading <h3>Name</h3>
  readonly emailHeading: Locator; // Email heading <h3>Email</h3>
  readonly aboutYourselfHeading: Locator; // About Yourself heading <h3>About Yourself</h3>
  readonly tabsContainer: Locator; // Tab list with Profile Info, Linked Accounts, Notifications
  readonly profileInfoTabInTabs: Locator; // Profile Info tab in the tab list
  readonly linkedAccountsTab: Locator; // Linked Accounts tab
  readonly notificationsTab: Locator; // Notifications tab
  readonly companyField: Locator;
  readonly companyUrlField: Locator;
  readonly aboutCompanySection: Locator;
  readonly logoutButton: Locator;
  readonly deleteAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Profile Info tab: <button role="tab" id="radix-*-trigger-profile_info">Profile Info</button>
    this.profileInfoTab = page.locator('button[role="tab"][id*="trigger-profile_info"]:has-text("Profile Info")');

    // Profile Info content area
    this.profileInfoContent = page.locator('[id*="content-profile_info"]');

    // All pencil/edit icons on the profile page
    this.pencilButtons = page.locator('button:has(svg.lucide-pencil), button:has(svg[class*="lucide-pencil"])');

    // About yourself field - exact match: <textarea name="about">
    this.aboutYourselfField = page.locator('textarea[name="about"]');

    // Save button - exact match: <button class="text-sm flex items-center underline underline-offset-2">Save</button>
    this.saveButton = page.locator('button.text-sm.flex.items-center.underline.underline-offset-2:has-text("Save")').first();

    // All profile fields
    this.nameField = page.locator('input[name="name"]');
    this.emailField = page.locator('input[name="email"]');
    this.linkedInField = page.locator('input[name="linkedIn"]');
    this.phoneField = page.locator('input[name="phone"], input[name="phoneNumber"]');
    this.aboutField = page.locator('textarea[name="about"]');

    // Additional profile page components
    // Profile picture - <img alt="Profile" class="w-full h-full object-cover" src="...">
    this.profilePicture = page.locator('img[alt="Profile"].w-full.h-full.object-cover').first();
    
    // Profile picture file input - <input class="hidden" accept="image/*" type="file">
    // This is hidden, but can be triggered by clicking the profile picture
    // Try multiple selectors to find the hidden file input
    // Note: The accept attribute should be "image/jpeg,image/jpg,image/png" or similar
    this.profilePictureFileInput = page.locator('input[type="file"][accept*="image"], input.hidden[type="file"], input[type="file"].hidden').first();
    
    // Name heading - <div class="flex justify-between items-center"><h3 class="text-sm font-medium text-black">Name</h3></div>
    this.nameHeading = page.locator('div.flex.justify-between.items-center:has(h3.text-sm.font-medium.text-black:has-text("Name"))').first();
    
    // Email heading - <div class="flex justify-between items-center"><h3 class="text-sm font-medium text-black">Email</h3></div>
    this.emailHeading = page.locator('div.flex.justify-between.items-center:has(h3.text-sm.font-medium.text-black:has-text("Email"))').first();
    
    // About Yourself heading - <div class="flex justify-between items-center"><h3 class="text-sm font-medium text-black">About Yourself</h3></div>
    this.aboutYourselfHeading = page.locator('div.flex.justify-between.items-center:has(h3.text-sm.font-medium.text-black:has-text("About Yourself"))').first();
    
    // Name edit icon - <svg class="lucide lucide-pencil w-4 h-4"> inside a button
    // Find button with pencil icon that's in the same flex container as Name heading
    this.nameEditIcon = page.locator('div.flex.justify-between.items-center:has(h3:has-text("Name")) button:has(svg.lucide-pencil.w-4.h-4)').first();
    
    // About Yourself edit icon - <svg class="lucide lucide-pencil w-4 h-4"> inside a button
    // Find button with pencil icon that's near About Yourself heading
    this.aboutYourselfEditIcon = page.locator('div:has(h3:has-text("About Yourself")) button:has(svg.lucide-pencil.w-4.h-4)').first();
    
    // Tabs container - <div role="tablist" ...> containing Profile Info, Linked Accounts, Notifications
    this.tabsContainer = page.locator('div[role="tablist"]').first();
    
    // Profile Info tab in tabs - <button role="tab" ... id="radix-*-trigger-profile_info">Profile Info</button>
    this.profileInfoTabInTabs = page.locator('button[role="tab"][id*="trigger-profile_info"]:has-text("Profile Info")').first();
    
    // Linked Accounts tab - <button role="tab" ... id="radix-*-trigger-linked_accounts">Linked Accounts</button>
    this.linkedAccountsTab = page.locator('button[role="tab"][id*="trigger-linked_accounts"]:has-text("Linked Accounts")').first();
    
    // Notifications tab - <button role="tab" ... id="radix-*-trigger-notification_settings">Notifications</button>
    this.notificationsTab = page.locator('button[role="tab"][id*="trigger-notification_settings"]:has-text("Notifications")').first();
    
    // Company field - not in provided HTML, keeping generic selector
    this.companyField = page.locator('h3:has-text("Company"), text=/^Company$/i').first();
    
    // Company URL field - not in provided HTML, keeping generic selector
    this.companyUrlField = page.locator('h3:has-text("Company URL"), text=/Company URL/i').first();
    
    // About Company section - not in provided HTML, keeping generic selector
    this.aboutCompanySection = page.locator('text=/About Company/i, text=/AI-powered Sales Operating System/i').first();
    
    // Logout button - <button type="button" aria-haspopup="dialog" ... class="hover:bg-bgSecondary py-2 px-3 rounded-lg flex items-center">
    // with <svg class="lucide lucide-log-out text-secondary"> and <p class="text-[14px] leading-[17px] px-2 font-[600] text-secondary">Logout</p>
    // Using simpler selector: button with log-out icon and "Logout" text
    this.logoutButton = page.locator('button[type="button"][aria-haspopup="dialog"]:has(svg.lucide-log-out):has(p:has-text("Logout"))').first();
    
    // Delete Account button - <p class="text-[14px] leading-[17px] px-2 font-[600] text-secondary"> Delete Account</p>
    // This is inside a button, so we'll find the button containing this paragraph with "Delete Account" text
    this.deleteAccountButton = page.locator('button:has(p:has-text("Delete Account"))').first();
  }

  /**
   * Wait for Profile Info tab to be visible
   */
  async waitForProfileInfoTab(): Promise<void> {
    await this.profileInfoTab.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for Profile Info content to be loaded
   */
  async waitForContentLoad(): Promise<void> {
    await this.page.waitForTimeout(2000);
    // Add more specific waits as needed when form elements are identified
  }

  /**
   * Check if Profile Info tab is active
   */
  async isProfileInfoTabActive(): Promise<boolean> {
    try {
      const dataState = await this.profileInfoTab.getAttribute('data-state');
      return dataState === 'active';
    } catch {
      return false;
    }
  }

  /**
   * Check if Profile Info content is displayed
   */
  async isContentDisplayed(): Promise<boolean> {
    try {
      return await this.profileInfoContent.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Verify all profile fields are visible
   * Checks for input/textarea fields directly, with fallback to labels for read-only displays
   * Returns an object with visibility status for each field
   */
  async verifyAllFieldsVisible(): Promise<{
    name: boolean;
    email: boolean;
    linkedIn: boolean;
    phone: boolean;
    about: boolean;
    allVisible: boolean;
  }> {
    const results = {
      name: false,
      email: false,
      linkedIn: false,
      phone: false,
      about: false,
      allVisible: false,
    };

    // Check Name field - input field or label
    try {
      results.name = await this.nameField.isVisible({ timeout: 3000 }).catch(() => false);
      // Fallback: check for "Name" label/text if input not visible (read-only display)
      if (!results.name) {
        const nameLabel = this.page.locator('text=/^Name$/i, label:has-text("Name")');
        results.name = await nameLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
      }
    } catch {
      results.name = false;
    }

    // Check Email field
    try {
      results.email = await this.emailField.isVisible({ timeout: 3000 }).catch(() => false);
      if (!results.email) {
        const emailLabel = this.page.locator('text=/^Email$/i, label:has-text("Email")');
        results.email = await emailLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
      }
    } catch {
      results.email = false;
    }

    // Check LinkedIn field - try both camelCase and lowercase
    try {
      results.linkedIn = await this.linkedInField.isVisible({ timeout: 3000 }).catch(() => false);
      // Try lowercase version as fallback
      if (!results.linkedIn) {
        const linkedInLowercase = this.page.locator('input[name="linkedin"]');
        results.linkedIn = await linkedInLowercase.isVisible({ timeout: 2000 }).catch(() => false);
      }
      // Fallback: check for "LinkedIn" label/text
      if (!results.linkedIn) {
        const linkedInLabel = this.page.locator('text=/LinkedIn/i, label:has-text("LinkedIn")');
        results.linkedIn = await linkedInLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
      }
    } catch {
      results.linkedIn = false;
    }

    // Check Phone field (optional)
    try {
      results.phone = await this.phoneField.isVisible({ timeout: 3000 }).catch(() => false);
      if (!results.phone) {
        const phoneLabel = this.page.locator('text=/Phone/i, label:has-text("Phone")');
        results.phone = await phoneLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
      }
    } catch {
      results.phone = false; // Phone field is optional
    }

    // Check About field
    try {
      results.about = await this.aboutField.isVisible({ timeout: 3000 }).catch(() => false);
      // Fallback: check for "About" or "About yourself" label/text
      if (!results.about) {
        const aboutLabel = this.page.locator('text=/About/i, text=/About yourself/i, label:has-text("About")');
        results.about = await aboutLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
      }
    } catch {
      results.about = false;
    }

    // All required fields (excluding optional phone) must be visible
    results.allVisible = results.name && results.email && results.linkedIn && results.about;

    return results;
  }

  /**
   * Check if all required fields are visible (excluding optional fields like phone)
   */
  async areAllRequiredFieldsVisible(): Promise<boolean> {
    const visibility = await this.verifyAllFieldsVisible();
    return visibility.allVisible;
  }

  /**
   * Verify pencil button (edit icon) is displayed on profile page
   * Checks for pencil icons (lucide-pencil) on the page
   */
  async isPencilButtonVisible(): Promise<boolean> {
    try {
      // Check if any pencil button is visible
      const count = await this.pencilButtons.count();
      if (count > 0) {
        // Check if at least one pencil button is visible
        const firstPencil = this.pencilButtons.first();
        return await firstPencil.isVisible({ timeout: 5000 });
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Get count of visible pencil buttons
   */
  async getPencilButtonCount(): Promise<number> {
    try {
      const count = await this.pencilButtons.count();
      let visibleCount = 0;
      for (let i = 0; i < count; i++) {
        const isVisible = await this.pencilButtons.nth(i).isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          visibleCount++;
        }
      }
      return visibleCount;
    } catch {
      return 0;
    }
  }

  /**
   * Click on profile picture to trigger file input
   * The profile picture is clickable and triggers the hidden file input
   */
  async clickProfilePicture(): Promise<void> {
    await this.profilePicture.waitFor({ state: 'visible', timeout: 10000 });
    await this.profilePicture.scrollIntoViewIfNeeded().catch(() => {});
    await this.profilePicture.click({ timeout: 5000 });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verify profile picture file input accepts only jpeg, jpg, png images (not all images)
   * Checks that the accept attribute only allows jpeg, jpg, png formats
   */
  async verifyProfilePictureFileInputAcceptsImages(): Promise<{
    fileInputExists: boolean;
    acceptAttribute: string | null;
    acceptsJpeg: boolean;
    acceptsPng: boolean;
    acceptsJpg: boolean;
    acceptsOnlyJpegJpgPng: boolean;
  }> {
    const results = {
      fileInputExists: false,
      acceptAttribute: null as string | null,
      acceptsJpeg: false,
      acceptsPng: false,
      acceptsJpg: false,
      acceptsOnlyJpegJpgPng: false,
    };

    try {
      // Check if file input exists (even if hidden)
      const count = await this.profilePictureFileInput.count();
      results.fileInputExists = count > 0;

      if (results.fileInputExists) {
        // Get the accept attribute
        results.acceptAttribute = await this.profilePictureFileInput.getAttribute('accept');
        
        if (results.acceptAttribute) {
          const acceptLower = results.acceptAttribute.toLowerCase();
          
          // Check specific image formats - should only accept jpeg, jpg, png
          results.acceptsJpeg = acceptLower.includes('jpeg') || acceptLower.includes('image/jpeg');
          results.acceptsPng = acceptLower.includes('png') || acceptLower.includes('image/png');
          results.acceptsJpg = acceptLower.includes('jpg') || acceptLower.includes('image/jpg') || acceptLower.includes('jpeg');
          
          // Verify it accepts ONLY jpeg, jpg, png (not image/* which accepts all images)
          // Accept attribute should be something like: "image/jpeg,image/jpg,image/png" or ".jpeg,.jpg,.png"
          const hasJpeg = results.acceptsJpeg;
          const hasPng = results.acceptsPng;
          const hasJpg = results.acceptsJpg;
          const hasImageStar = acceptLower.includes('image/*');
          
          // It should accept jpeg, jpg, png AND NOT accept all images (image/*)
          results.acceptsOnlyJpegJpgPng = (hasJpeg || hasJpg) && hasPng && !hasImageStar;
        }
      }
    } catch (error) {
      console.log('Error verifying profile picture file input:', error);
    }

    return results;
  }

  /**
   * Upload/change profile picture by selecting a file
   * @param filePath - Path to the image file (jpeg, jpg, or png) to upload
   *                   Can be relative (e.g., './test-images/profile.jpg') or absolute
   */
  async uploadProfilePicture(filePath: string): Promise<void> {
    // First, make sure the file input is available
    // The file input should already be attached to the DOM (it's hidden)
    const fileInputCount = await this.profilePictureFileInput.count();
    
    if (fileInputCount === 0) {
      // If file input not found, try clicking the profile picture to trigger it
      console.log('File input not found, clicking profile picture to trigger it...');
      await this.clickProfilePicture();
      await this.page.waitForTimeout(1000);
    }

    // Wait for file input to be attached
    await this.profilePictureFileInput.waitFor({ state: 'attached', timeout: 10000 });

    // Set the file to the input
    await this.profilePictureFileInput.setInputFiles(filePath);
    
    // Wait for file to be processed and uploaded
    await this.page.waitForTimeout(3000);
    
    console.log(`✓ Profile picture uploaded: ${filePath}`);
  }

  /**
   * Verify all profile page components are visible
   * Checks for: profile picture, name field with edit icon, email, about yourself with edit icon,
   * tabs (Profile Info, Linked Accounts, Notifications), logout button, delete account button
   */
  async verifyAllComponentsVisible(): Promise<{
    profilePicture: boolean;
    nameHeading: boolean;
    nameEditIcon: boolean;
    emailHeading: boolean;
    aboutYourselfHeading: boolean;
    aboutYourselfEditIcon: boolean;
    tabsContainer: boolean;
    profileInfoTab: boolean;
    linkedAccountsTab: boolean;
    notificationsTab: boolean;
    logoutButton: boolean;
    deleteAccountButton: boolean;
    allComponentsVisible: boolean;
  }> {
    const results = {
      profilePicture: false,
      nameHeading: false,
      nameEditIcon: false,
      emailHeading: false,
      aboutYourselfHeading: false,
      aboutYourselfEditIcon: false,
      tabsContainer: false,
      profileInfoTab: false,
      linkedAccountsTab: false,
      notificationsTab: false,
      logoutButton: false,
      deleteAccountButton: false,
      allComponentsVisible: false,
    };

    // Check Profile Picture - <img alt="Profile">
    try {
      results.profilePicture = await this.profilePicture.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.profilePicture = false;
    }

    // Check Name heading - <h3>Name</h3>
    try {
      results.nameHeading = await this.nameHeading.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.nameHeading = false;
    }

    // Check Name edit icon (pencil) - button with pencil icon near Name
    try {
      results.nameEditIcon = await this.nameEditIcon.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.nameEditIcon = false;
    }

    // Check Email heading - <h3>Email</h3>
    try {
      results.emailHeading = await this.emailHeading.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.emailHeading = false;
    }

    // Check About Yourself heading - <h3>About Yourself</h3>
    try {
      results.aboutYourselfHeading = await this.aboutYourselfHeading.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.aboutYourselfHeading = false;
    }

    // Check About Yourself edit icon (pencil) - button with pencil icon near About Yourself
    try {
      results.aboutYourselfEditIcon = await this.aboutYourselfEditIcon.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.aboutYourselfEditIcon = false;
    }

    // Check Tabs container - <div role="tablist">
    try {
      results.tabsContainer = await this.tabsContainer.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.tabsContainer = false;
    }

    // Check Profile Info tab in tabs
    try {
      results.profileInfoTab = await this.profileInfoTabInTabs.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.profileInfoTab = false;
    }

    // Check Linked Accounts tab
    try {
      results.linkedAccountsTab = await this.linkedAccountsTab.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.linkedAccountsTab = false;
    }

    // Check Notifications tab
    try {
      results.notificationsTab = await this.notificationsTab.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.notificationsTab = false;
    }

    // Check Logout button - button with log-out icon and "Logout" text
    try {
      results.logoutButton = await this.logoutButton.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.logoutButton = false;
    }

    // Check Delete Account button - button with trash icon and "Delete Account" text
    try {
      results.deleteAccountButton = await this.deleteAccountButton.isVisible({ timeout: 3000 }).catch(() => false);
    } catch {
      results.deleteAccountButton = false;
    }

    // All required components must be visible
    results.allComponentsVisible = 
      results.profilePicture &&
      results.nameHeading &&
      results.nameEditIcon &&
      results.emailHeading &&
      results.aboutYourselfHeading &&
      results.aboutYourselfEditIcon &&
      results.tabsContainer &&
      results.profileInfoTab &&
      results.linkedAccountsTab &&
      results.notificationsTab &&
      results.logoutButton &&
      results.deleteAccountButton;

    return results;
  }
}

