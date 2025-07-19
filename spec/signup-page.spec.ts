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

  test('shows user alreay exists error message', async ({ page }) => {
    await page.fill('input[name="email"]', 'a@b.com');
    await page.fill('input[name="password"]', 'password');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=user already exists')).toBeVisible();
  });

  test('shows email is not valid error message', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=email must be an email')).toBeVisible();
  });

  test('shows password is too short error message', async ({ page }) => {
    await page.fill('input[name="email"]', 'a@b.com');
    await page.fill('input[name="password"]', 'pass');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=password must be longer than or equal to 5 characters')).toBeVisible();
  });
});
