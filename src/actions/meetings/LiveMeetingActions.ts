import { Page } from '@playwright/test';
import { LiveMeetingPage } from '../../pages/meetings/liveMeetingPage';

/**
 * Actions for Live Meeting interactions
 * Contains all user actions for live meeting operations
 */
export class LiveMeetingActions {
  private liveMeetingPage: LiveMeetingPage;

  constructor(page: Page) {
    this.liveMeetingPage = new LiveMeetingPage(page);
  }

  /**
   * Wait for live meeting to load
   */
  async waitForMeetingLoad(): Promise<void> {
    await this.liveMeetingPage.waitForMeetingLoad();
  }

  /**
   * Toggle mute
   */
  async toggleMute(): Promise<void> {
    await this.liveMeetingPage.muteButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingPage.muteButton.click();
    await this.liveMeetingPage.page.waitForTimeout(500);
  }

  /**
   * Toggle video
   */
  async toggleVideo(): Promise<void> {
    await this.liveMeetingPage.videoButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingPage.videoButton.click();
    await this.liveMeetingPage.page.waitForTimeout(500);
  }

  /**
   * Click share screen button
   */
  async clickShareScreen(): Promise<void> {
    await this.liveMeetingPage.shareScreenButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingPage.shareScreenButton.click();
  }

  /**
   * Click chat button
   */
  async clickChatButton(): Promise<void> {
    await this.liveMeetingPage.chatButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingPage.chatButton.click();
  }

  /**
   * Click participants button
   */
  async clickParticipantsButton(): Promise<void> {
    await this.liveMeetingPage.participantsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingPage.participantsButton.click();
  }

  /**
   * Click leave meeting button
   */
  async clickLeaveMeeting(): Promise<void> {
    await this.liveMeetingPage.leaveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingPage.leaveButton.click();
  }

  /**
   * Click end meeting button
   */
  async clickEndMeeting(): Promise<void> {
    await this.liveMeetingPage.endMeetingButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveMeetingPage.endMeetingButton.click();
  }

  /**
   * Verify meeting is active
   */
  async verifyMeetingActive(): Promise<boolean> {
    return await this.liveMeetingPage.isMeetingActive();
  }

  /**
   * Verify meeting timer is visible
   */
  async verifyMeetingTimerVisible(): Promise<boolean> {
    return await this.liveMeetingPage.meetingTimer.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Verify mute button is visible
   */
  async verifyMuteButtonVisible(): Promise<boolean> {
    return await this.liveMeetingPage.muteButton.isVisible({ timeout: 5000 }).catch(() => false);
  }
}

