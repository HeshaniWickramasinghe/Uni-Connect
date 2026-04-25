// login.spec.js — Playwright tests for the Login Module
// Covers: Login UI, Form Validation, Links and API Error handling.

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('1. Login Page UI and Interactions', () => {

    test('TC-LOG01 | Login > Page loads at correct URL', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain('/login');
    });

    test('TC-LOG02 | Login > Welcome Back title and subtitle are visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        const title = page.getByRole('heading', { name: /Welcome Back/i });
        await expect(title).toBeVisible();

        const subtitle = page.getByText(/Login to continue to your campus network/i);
        await expect(subtitle).toBeVisible();
    });

    test('TC-LOG03 | Login > Form inputs (Email and Password) are visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        const emailInput = page.getByPlaceholder(/name@university.edu/i);
        await expect(emailInput).toBeVisible();

        const passwordInput = page.getByPlaceholder(/Enter your password/i);
        await expect(passwordInput).toBeVisible();
    });

    test('TC-LOG04 | Login > Login button is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        const loginBtn = page.getByRole('button', { name: 'Login', exact: true });
        await expect(loginBtn).toBeVisible();
    });

    test('TC-LOG05 | Login > "Create an account" link navigates to register page', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        const registerLink = page.getByRole('link', { name: /Create an account/i });
        await expect(registerLink).toBeVisible();
        await registerLink.click();
        await page.waitForURL(/\/register/i);
        expect(page.url()).toContain('/register');
    });

    test('TC-LOG06 | Login > "Forgot Password\?" link navigates to forgot password page', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        const forgotPasswordLink = page.getByRole('link', { name: /Forgot Password\?/i });
        await expect(forgotPasswordLink).toBeVisible();
        await forgotPasswordLink.click();
        await page.waitForURL(/\/forgot-password/i);
        expect(page.url()).toContain('/forgot-password');
    });

    test('TC-LOG07 | Login > Typing updates input fields correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        const emailInput = page.getByPlaceholder(/name@university.edu/i);
        await emailInput.fill('test@university.edu');
        await expect(emailInput).toHaveValue('test@university.edu');

        const passwordInput = page.getByPlaceholder(/Enter your password/i);
        await passwordInput.fill('secretpassword123');
        await expect(passwordInput).toHaveValue('secretpassword123');
    });

    test('TC-LOG08 | Login > Submitting invalid credentials shows error message', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.getByPlaceholder(/name@university.edu/i).fill('wronguser@test.com');
        await page.getByPlaceholder(/Enter your password/i).fill('wrongpassword');
        
        await page.getByRole('button', { name: 'Login', exact: true }).click();
        
        // Wait for error message (either API error or connection error)
        const statusMessage = page.locator('.status.error');
        await expect(statusMessage).toBeVisible({ timeout: 10000 });
    });

});
