import { test, expect } from '@playwright/test';

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('localhost:3000/auth/signup');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Sign Up/);
  });
});
