// payment.spec.js — Playwright tests for the Payment Module
// Covers: Bank Transfer and Card Payment UI and basic validations.

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('1. Bank Transfer Payment', () => {

    test('TC-PAY01 | Bank Transfer > Page loads at correct URL', async ({ page }) => {
        await page.goto(`${BASE_URL}/bank-transfer`);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain('/bank-transfer');
    });

    test('TC-PAY02 | Bank Transfer > Bank Transfer Details title is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/bank-transfer`);
        const title = page.getByRole('heading', { name: /Bank Transfer Details/i });
        await expect(title).toBeVisible();
    });

    test('TC-PAY03 | Bank Transfer > Account Information is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/bank-transfer`);
        await expect(page.getByText(/Account Number/i)).toBeVisible();
        await expect(page.getByText(/Account Holder Name/i)).toBeVisible();
        await expect(page.getByText(/Bank Name/i)).toBeVisible();
        await expect(page.getByText('Branch', { exact: true })).toBeVisible();
    });

    test('TC-PAY04 | Bank Transfer > Upload section is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/bank-transfer`);
        await expect(page.getByRole('heading', { name: /Upload Payment Proof/i })).toBeVisible();
        const uploadLabel = page.getByText(/Click to select proof of receipt/i);
        await expect(uploadLabel).toBeVisible();
    });

    test('TC-PAY05 | Bank Transfer > Submit without file shows error popup', async ({ page }) => {
        await page.goto(`${BASE_URL}/bank-transfer`);
        await page.getByRole('button', { name: /Submit Payment Proof/i }).click();
        const errorMessage = page.getByText(/Please select a valid proof of receipt file before submitting/i);
        await expect(errorMessage).toBeVisible();
        await expect(page.getByRole('heading', { name: /Payment Unsuccessful/i })).toBeVisible();
    });

    test('TC-PAY06 | Bank Transfer > Close popup works', async ({ page }) => {
        await page.goto(`${BASE_URL}/bank-transfer`);
        await page.getByRole('button', { name: /Submit Payment Proof/i }).click();
        await page.getByRole('button', { name: 'Close', exact: true }).click();
        await expect(page.getByText(/Payment Unsuccessful/i)).not.toBeVisible();
    });
});

test.describe('2. Card Payment', () => {

    test('TC-PAY07 | Card Payment > Page loads at correct URL', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-payment`);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain('/card-payment');
    });

    test('TC-PAY08 | Card Payment > Title is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-payment`);
        const title = page.getByRole('heading', { name: /Card Payment/i });
        await expect(title).toBeVisible();
    });

    test('TC-PAY09 | Card Payment > Form fields are visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-payment`);
        await expect(page.getByPlaceholder(/Card Holder Name/i)).toBeVisible();
        await expect(page.getByPlaceholder(/Card Number/i)).toBeVisible();
        await expect(page.getByPlaceholder(/MM\/YY/i)).toBeVisible();
        await expect(page.getByPlaceholder(/CVV/i)).toBeVisible();
        await expect(page.getByPlaceholder(/Amount/i)).toBeVisible();
    });

    test('TC-PAY10 | Card Payment > Empty submission shows error', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-payment`);
        await page.getByRole('button', { name: /Pay Now/i }).click();
        const errorMessage = page.getByText(/Card holder name is required/i);
        await expect(errorMessage).toBeVisible();
        await expect(page.getByRole('heading', { name: /Payment Unsuccessful/i })).toBeVisible();
    });

    test('TC-PAY11 | Card Payment > Typing updates input fields', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-payment`);
        const nameInput = page.getByPlaceholder(/Card Holder Name/i);
        await nameInput.fill('John Doe');
        await expect(nameInput).toHaveValue('John Doe');

        const cardInput = page.getByPlaceholder(/Card Number/i);
        await cardInput.fill('1234567812345678');
        await expect(cardInput).toHaveValue('1234 5678 1234 5678');
    });

    test('TC-PAY12 | Card Payment > Invalid Card Number length shows error', async ({ page }) => {
        await page.goto(`${BASE_URL}/card-payment`);
        await page.getByPlaceholder(/Card Holder Name/i).fill('John Doe');
        await page.getByPlaceholder(/Card Number/i).fill('1234');
        await page.getByRole('button', { name: /Pay Now/i }).click();
        
        const errorMessage = page.getByText(/Card number must be 16 digits/i);
        await expect(errorMessage).toBeVisible();
    });

});
