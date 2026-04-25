// cart.spec.js — Playwright tests for the Cart Module (Header component)
// Covers: Empty Cart, Cart with items, Removing items, and Checkout flow.

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper function to inject mock cart items
async function injectMockCartItems(page) {
    await page.evaluate(() => {
        sessionStorage.setItem('cartItems', JSON.stringify([
            {
                sessionId: 'session-123',
                sessionDisplayId: 'KUP-123',
                moduleId: 'IT1010',
                tutorName: 'John Doe',
                price: 1500
            },
            {
                sessionId: 'session-456',
                sessionDisplayId: 'KUP-456',
                moduleId: 'IT2020',
                tutorName: 'Jane Smith',
                price: 2500
            }
        ]));
    });
}

// Helper function to inject a logged-in user
async function loginAsUser(page) {
    await page.evaluate(() => {
        sessionStorage.setItem('loggedInUser', JSON.stringify({
            name: 'Test Student',
            email: 'student@test.com',
            id: 'IT12345678'
        }));
    });
}

test.describe('Cart Module Tests', () => {

    test('TC-CART01 | Cart > Icon is visible in the header', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        const cartButton = page.getByRole('button', { name: 'Cart' });
        await expect(cartButton).toBeVisible();
    });

    test('TC-CART02 | Cart > Clicking cart icon opens cart menu', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        await page.getByRole('button', { name: 'Cart' }).click();
        const cartTitle = page.getByText('Your Cart');
        await expect(cartTitle).toBeVisible();
    });

    test('TC-CART03 | Cart > Empty cart state displays correctly for guest', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        await page.getByRole('button', { name: 'Cart' }).click();
        await expect(page.getByText('No items added yet.')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Log in to add items' })).toBeVisible();
    });

    test('TC-CART04 | Cart > Empty cart state displays correctly for logged-in user', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        await loginAsUser(page);
        await page.reload();
        
        await page.getByRole('button', { name: 'Cart' }).click();
        await expect(page.getByText('No items added yet.')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Browse Sessions' })).toBeVisible();
    });

    test('TC-CART05 | Cart > Cart correctly displays items from storage', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        await injectMockCartItems(page);
        await page.reload();
        
        await page.getByRole('button', { name: 'Cart' }).click();
        
        await expect(page.getByText('IT1010')).toBeVisible();
        await expect(page.getByText('John Doe')).toBeVisible();
        await expect(page.getByText('IT2020')).toBeVisible();
        await expect(page.getByText('Total: LKR 4000.00')).toBeVisible();
    });

    test('TC-CART06 | Cart > Removing an item updates the cart and total', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        await loginAsUser(page); // Needed to see 'Remove' button inside cart
        await injectMockCartItems(page);
        await page.reload();
        
        await page.getByRole('button', { name: 'Cart' }).click();
        
        // Ensure both items are present
        await expect(page.getByText('IT1010')).toBeVisible();
        await expect(page.getByText('IT2020')).toBeVisible();
        
        // Remove first item
        const removeBtns = page.getByRole('button', { name: 'Remove' });
        await removeBtns.first().click();
        
        // First item should be gone
        await expect(page.getByText('IT1010')).not.toBeVisible();
        await expect(page.getByText('Total: LKR 2500.00')).toBeVisible();
    });

    test('TC-CART07 | Cart > "Pay" button navigates to payment page', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        await loginAsUser(page);
        await injectMockCartItems(page);
        await page.reload();
        
        await page.getByRole('button', { name: 'Cart' }).click();
        
        const payButton = page.getByRole('button', { name: 'Pay' });
        await expect(payButton).toBeVisible();
        
        await payButton.click();
        await page.waitForURL(/\/payments/i);
        expect(page.url()).toContain('/payments');
    });

    test('TC-CART08 | Cart > "Log in to add items" button navigates to login page for guests', async ({ page }) => {
        await page.goto(`${BASE_URL}/homepage`);
        await page.getByRole('button', { name: 'Cart' }).click();
        
        const loginBtn = page.getByRole('button', { name: 'Log in to add items' });
        await loginBtn.click();
        
        await page.waitForURL(/\/login/i);
        expect(page.url()).toContain('/login');
    });

});
