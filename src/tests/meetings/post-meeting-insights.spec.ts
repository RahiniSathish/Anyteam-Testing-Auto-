import { test, expect } from '@playwright/test';
import { PostMeetingInsightsActions } from '../../actions/meetings/PostMeetingInsightsActions';
import { LoginHelper } from '../../utils/loginHelper';
import { TestData } from '../../utils/TestData';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test Suite: Post Meeting Insights
 * Tests for post-meeting insights, analytics, and summaries
 */
test.describe('Post Meeting Insights', () => {
  let postMeetingInsightsActions: PostMeetingInsightsActions;

  test.beforeEach(async ({ page, context }) => {
    postMeetingInsightsActions = new PostMeetingInsightsActions(page);
    
    // Perform login using LoginHelper
    await LoginHelper.performLogin(page, context);
    
    // Navigate to home page
    await page.goto(`${TestData.urls.base}/home`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
  });

  test('should verify insights are visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying insights are visible...');
    const isInsightsVisible = await postMeetingInsightsActions.verifyInsightsVisible();
    expect(isInsightsVisible).toBe(true);
    console.log('✓ Insights are visible');
  });

  test('should verify meeting summary is visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying meeting summary is visible...');
    const isSummaryVisible = await postMeetingInsightsActions.verifyMeetingSummaryVisible();
    expect(isSummaryVisible).toBe(true);
    console.log('✓ Meeting summary is visible');
  });

  test('should verify key points are visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying key points are visible...');
    const isKeyPointsVisible = await postMeetingInsightsActions.verifyKeyPointsVisible();
    expect(isKeyPointsVisible).toBe(true);
    console.log('✓ Key points are visible');
  });

  test('should verify action items are visible', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Verifying action items are visible...');
    const isActionItemsVisible = await postMeetingInsightsActions.verifyActionItemsVisible();
    expect(isActionItemsVisible).toBe(true);
    console.log('✓ Action items are visible');
  });

  test('should get meeting summary text', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Getting meeting summary text...');
    const summaryText = await postMeetingInsightsActions.getMeetingSummary();
    if (summaryText) {
      console.log(`✓ Meeting summary retrieved: ${summaryText.substring(0, 50)}...`);
      expect(summaryText.length).toBeGreaterThan(0);
    } else {
      console.log('⚠ Meeting summary not available');
    }
  });

  test('should click download report button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking download report button...');
    await postMeetingInsightsActions.clickDownloadReport();
    await page.waitForTimeout(2000);
    console.log('✓ Download report button clicked');
  });

  test('should click share insights button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking share insights button...');
    await postMeetingInsightsActions.clickShareInsights();
    await page.waitForTimeout(2000);
    console.log('✓ Share insights button clicked');
  });

  test('should click view details button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking view details button...');
    await postMeetingInsightsActions.clickViewDetails();
    await page.waitForTimeout(2000);
    console.log('✓ View details button clicked');
  });

  test('should click close insights button', async ({ page }) => {
    console.log('Step 1: Waiting for insights page to load...');
    await postMeetingInsightsActions.waitForInsightsLoad();
    
    console.log('Step 2: Clicking close insights button...');
    await postMeetingInsightsActions.clickCloseInsights();
    await page.waitForTimeout(1000);
    console.log('✓ Close insights button clicked');
  });
});

