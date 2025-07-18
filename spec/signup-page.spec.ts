import { test, expect } from '@playwright/test';

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('localhost:3000/auth/signup');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Create Account/);
  });

  test('can input email', async ({ page }) => {
    await page.fill('input[name="email"]', 'a@b.com');
    await expect(page.locator('input[name="email"]')).toHaveValue('a@b.com');
  });

  test('can input password', async ({ page }) => {
    await page.fill('input[name="password"]', 'password');
    await expect(page.locator('input[name="password"]')).toHaveValue('password');
  });

  test('password input is protected by default', async ({ page }) => {
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });

  test('can toggle password visibility', async ({ page }) => {
    await page.fill('input[name="password"]', 'password');
    await page.locator('[data-testid="toggle-password-visibility"]').click();
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'text');
    await page.locator('[data-testid="toggle-password-visibility"]').click();
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });

  test('validates that email is not empty', async ({ page }) => {
    await page.fill('input[name="email"]', '');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('validates that password is not empty', async ({ page }) => {
    await page.fill('input[name="password"]', '');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });
});
