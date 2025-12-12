import { test as base } from '@playwright/test';
import { LoginActions } from '../actions/login/LoginActions';

/**
 * Custom test fixtures
 * Extends Playwright test with custom fixtures
 */
export const test = base.extend<{
  loginActions: LoginActions;
}>({
  loginActions: async ({ page }, use) => {
    const loginActions = new LoginActions(page);
    await use(loginActions);
  },
});

export { expect } from '@playwright/test';

