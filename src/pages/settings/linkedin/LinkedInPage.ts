import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for LinkedIn Page
 * Represents the LinkedIn tab within the Settings page
 */
export class LinkedInPage {
  readonly page: Page;

  // LinkedIn tab
  readonly linkedInTab: Locator;

  // LinkedIn form elements
  readonly linkedInContent: Locator;
  readonly linkedInEditIcon: Locator; // Edit pencil icon for LinkedIn
  readonly linkedInField: Locator; // Input field for LinkedIn URL or information
  readonly saveButton: Locator; // Save button for LinkedIn

  constructor(page: Page) {
    this.page = page;

    // LinkedIn tab: <button role="tab" id="radix-*-trigger-linkedin">LinkedIn</button>
    // Common variations: "Linked Accounts", "LinkedIn", etc.
    this.linkedInTab = page.locator('button[role="tab"][id*="trigger-linked"], button[role="tab"]:has-text("Linked"), button[role="tab"]:has-text("LinkedIn")').first();

    // LinkedIn content area
    this.linkedInContent = page.locator('[id*="content-linked"], [id*="content-linkedin"]');

    // LinkedIn edit icon - pencil icon (lucide-pencil class)
    this.linkedInEditIcon = page.locator('svg.lucide-pencil, button:has(svg.lucide-pencil)').first();

    // LinkedIn field - exact match: <input name="linkedIn" type="text">
    this.linkedInField = page.locator('input[name="linkedIn"]');

    // Save button - exact match: <button class="text-sm flex items-center underline underline-offset-2">Save</button>
    this.saveButton = page.locator('button.text-sm.flex.items-center.underline.underline-offset-2:has-text("Save")').first();
  }

  /**
   * Wait for LinkedIn tab to be visible
   */
  async waitForLinkedInTab(): Promise<void> {
    await this.linkedInTab.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for LinkedIn content to be loaded
   */
  async waitForContentLoad(): Promise<void> {
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if LinkedIn tab is active
   */
  async isLinkedInTabActive(): Promise<boolean> {
    try {
      const dataState = await this.linkedInTab.getAttribute('data-state');
      return dataState === 'active';
    } catch {
      return false;
    }
  }

  /**
   * Check if LinkedIn content is displayed
   */
  async isContentDisplayed(): Promise<boolean> {
    try {
      return await this.linkedInContent.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }
}

