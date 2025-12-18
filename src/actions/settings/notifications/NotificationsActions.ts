import { Page } from '@playwright/test';
import { NotificationsPage } from '../../../pages/settings/notifications/notificationsPage';

/**
 * Actions for Notifications interactions
 * Contains all user actions that can be performed on the Notifications page
 */
export class NotificationsActions {
  private notificationsPage: NotificationsPage;

  constructor(page: Page) {
    this.notificationsPage = new NotificationsPage(page);
  }

  /**
   * Click on the Notifications heading to open notifications panel
   */
  async clickNotificationsHeading(): Promise<void> {
    await this.notificationsPage.clickNotificationsHeading();
  }

  /**
   * Click on "View Meeting Insights" notification
   */
  async clickViewMeetingInsights(): Promise<void> {
    await this.notificationsPage.clickViewMeetingInsights();
  }

  /**
   * Wait for notifications panel to be visible
   */
  async waitForNotificationsPanel(): Promise<void> {
    await this.notificationsPage.waitForNotificationsPanel();
  }

  /**
   * Verify notifications panel is displayed
   */
  async verifyNotificationsPanelDisplayed(): Promise<boolean> {
    return await this.notificationsPage.isDisplayed();
  }

  /**
   * Verify View Meeting Insights is visible
   */
  async verifyViewMeetingInsightsVisible(): Promise<boolean> {
    return await this.notificationsPage.isViewMeetingInsightsVisible();
  }

  /**
   * Click on a notification item (meeting notification)
   */
  async clickNotificationItem(): Promise<void> {
    await this.notificationsPage.clickNotificationItem();
  }

  /**
   * Verify notification item is visible
   */
  async verifyNotificationItemVisible(): Promise<boolean> {
    return await this.notificationsPage.isNotificationItemVisible();
  }

  /**
   * Click the filter button to open filter options
   */
  async clickFilterButton(): Promise<void> {
    await this.notificationsPage.clickFilterButton();
  }

  /**
   * Check the Read checkbox
   */
  async checkReadCheckbox(): Promise<void> {
    await this.notificationsPage.checkReadCheckbox();
  }

  /**
   * Uncheck the Read checkbox
   */
  async uncheckReadCheckbox(): Promise<void> {
    await this.notificationsPage.uncheckReadCheckbox();
  }

  /**
   * Check if Read checkbox is checked
   */
  async isReadCheckboxChecked(): Promise<boolean> {
    return await this.notificationsPage.isReadCheckboxChecked();
  }

  /**
   * Check the Unread checkbox
   */
  async checkUnreadCheckbox(): Promise<void> {
    await this.notificationsPage.checkUnreadCheckbox();
  }

  /**
   * Uncheck the Unread checkbox
   */
  async uncheckUnreadCheckbox(): Promise<void> {
    await this.notificationsPage.uncheckUnreadCheckbox();
  }

  /**
   * Check if Unread checkbox is checked
   */
  async isUnreadCheckboxChecked(): Promise<boolean> {
    return await this.notificationsPage.isUnreadCheckboxChecked();
  }

  /**
   * Verify filter button is visible
   */
  async verifyFilterButtonVisible(): Promise<boolean> {
    return await this.notificationsPage.isFilterButtonVisible();
  }

  /**
   * Verify Read checkbox is visible
   */
  async verifyReadCheckboxVisible(): Promise<boolean> {
    return await this.notificationsPage.isReadCheckboxVisible();
  }

  /**
   * Verify Unread checkbox is visible
   */
  async verifyUnreadCheckboxVisible(): Promise<boolean> {
    return await this.notificationsPage.isUnreadCheckboxVisible();
  }

  /**
   * Click the three-dotted menu (ellipsis-vertical icon)
   */
  async clickThreeDottedMenu(): Promise<void> {
    await this.notificationsPage.clickThreeDottedMenu();
  }

  /**
   * Click "Mark all as read" button
   */
  async clickMarkAllAsRead(): Promise<void> {
    await this.notificationsPage.clickMarkAllAsRead();
  }

  /**
   * Verify three-dotted menu is visible
   */
  async verifyThreeDottedMenuVisible(): Promise<boolean> {
    return await this.notificationsPage.isThreeDottedMenuVisible();
  }

  /**
   * Verify "Mark all as read" button is visible
   */
  async verifyMarkAllAsReadButtonVisible(): Promise<boolean> {
    return await this.notificationsPage.isMarkAllAsReadButtonVisible();
  }

  /**
   * Verify all notifications are marked as read
   */
  async verifyAllNotificationsMarkedAsRead(): Promise<{
    allMarkedAsRead: boolean;
    notificationCount: number;
    readCount: number;
  }> {
    return await this.notificationsPage.verifyAllNotificationsMarkedAsRead();
  }
}

