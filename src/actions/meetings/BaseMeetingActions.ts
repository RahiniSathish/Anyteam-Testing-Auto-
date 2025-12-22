import { Page } from '@playwright/test';
import { BaseMeetingPage } from '../../pages/meetings/baseMeetingPage';

/**
 * Actions for Base Meeting interactions
 * Contains all user actions for basic meeting operations
 */
export class BaseMeetingActions {
  private baseMeetingPage: BaseMeetingPage;

  constructor(page: Page) {
    this.baseMeetingPage = new BaseMeetingPage(page);
  }

  /**
   * Navigate to base meeting page
   */
  async navigateToBaseMeeting(): Promise<void> {
    await this.baseMeetingPage.goto();
  }

  /**
   * Fill meeting title
   */
  async fillMeetingTitle(title: string): Promise<void> {
    await this.baseMeetingPage.meetingTitle.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.meetingTitle.fill(title);
  }

  /**
   * Fill meeting date
   */
  async fillMeetingDate(date: string): Promise<void> {
    await this.baseMeetingPage.meetingDate.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.meetingDate.fill(date);
  }

  /**
   * Fill meeting time
   */
  async fillMeetingTime(time: string): Promise<void> {
    await this.baseMeetingPage.meetingTime.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.meetingTime.fill(time);
  }

  /**
   * Fill meeting participants
   */
  async fillMeetingParticipants(participants: string): Promise<void> {
    await this.baseMeetingPage.meetingParticipants.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.meetingParticipants.fill(participants);
  }

  /**
   * Fill meeting description
   */
  async fillMeetingDescription(description: string): Promise<void> {
    await this.baseMeetingPage.meetingDescription.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.meetingDescription.fill(description);
  }

  /**
   * Click join button
   */
  async clickJoinButton(): Promise<void> {
    await this.baseMeetingPage.joinButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.joinButton.click();
  }

  /**
   * Click cancel button
   */
  async clickCancelButton(): Promise<void> {
    await this.baseMeetingPage.cancelButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.cancelButton.click();
  }

  /**
   * Click save button
   */
  async clickSaveButton(): Promise<void> {
    await this.baseMeetingPage.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.baseMeetingPage.saveButton.click();
  }

  /**
   * Verify meeting title is visible
   */
  async verifyMeetingTitleVisible(): Promise<boolean> {
    return await this.baseMeetingPage.meetingTitle.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Verify join button is visible
   */
  async verifyJoinButtonVisible(): Promise<boolean> {
    return await this.baseMeetingPage.joinButton.isVisible({ timeout: 5000 }).catch(() => false);
  }
}

