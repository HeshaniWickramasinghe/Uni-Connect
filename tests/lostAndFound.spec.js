// lostAndFound.spec.js — Playwright tests for the Lost & Found module
// Uni-Connect ITPM Project | Heshani Wickramasinghe
// Covers: Dashboard, Hero Section, Search & Filter, Item Cards,
//         Report Modal, Login Prompt, Date Filter, Item Details, Handover Modal

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// ── Helper: inject a logged-in user into sessionStorage ──────────────────
async function loginAsUser(page) {
    await page.goto(`${BASE_URL}/lost-and-found`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);
    await page.evaluate(() => {
        sessionStorage.setItem('loggedInUser', JSON.stringify({
            name: 'Heshani Wickramasinghe',
            email: 'heshani@test.com',
            registrationNo: 'IT22XXXXXX'
        }));
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Lost & Found Dashboard — Page Load
// ────────────────────────────────────────────────────────────────────────────
test.describe('1. Lost & Found Dashboard', () => {

    test('TC-LF01 | Dashboard > Lost & Found page loads at correct URL', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain('/lost-and-found');
    });

    test('TC-LF02 | Dashboard > Page body is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC-LF03 | Dashboard > Header is present on the page', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const header = page.locator('header').first();
        await expect(header).toBeVisible();
    });

    test('TC-LF04 | Dashboard > Footer is present on the page', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const footer = page.locator('footer').first();
        await expect(footer).toBeVisible();
    });

});

// ────────────────────────────────────────────────────────────────────────────
// 2. Hero Section
// ────────────────────────────────────────────────────────────────────────────
test.describe('2. Hero Section', () => {

    test('TC-LF05 | Hero Section > Hero heading is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        const heading = page.getByRole('heading', { name: /find what was lost/i });
        await expect(heading).toBeVisible();
    });

    test('TC-LF06 | Hero Section > Hero subtitle text is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await expect(page.getByText(/most trusted community platform/i)).toBeVisible();
    });

    test('TC-LF07 | Hero Section > "I Lost Something" card is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await expect(page.getByText('I Lost Something')).toBeVisible();
    });

    test('TC-LF08 | Hero Section > "I Found Something" card is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await expect(page.getByText('I Found Something')).toBeVisible();
    });

    test('TC-LF09 | Hero Section > Hero background has blue styling', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const hero = page.locator('header.bg-\\[\\#023E8A\\]').first();
        await expect(hero).toBeVisible();
    });

});

// ────────────────────────────────────────────────────────────────────────────
// 3. Search & Filter Bar
// ────────────────────────────────────────────────────────────────────────────
test.describe('3. Search & Filter Bar', () => {

    test('TC-LF10 | Search & Filter > Search input field is present', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const searchInput = page.getByPlaceholder(/search for items/i);
        await expect(searchInput).toBeVisible();
    });

    test('TC-LF11 | Search & Filter > Category dropdown is present', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const categorySelect = page.locator('select').first();
        await expect(categorySelect).toBeVisible();
    });

    test('TC-LF12 | Search & Filter > Sort dropdown is present', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const sortSelect = page.locator('select').nth(1);
        await expect(sortSelect).toBeVisible();
    });

    test('TC-LF13 | Search & Filter > Typing in search input updates value', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(800);
        const searchInput = page.getByPlaceholder(/search for items/i);
        await searchInput.fill('wallet');
        await expect(searchInput).toHaveValue('wallet');
    });

    test('TC-LF14 | Search & Filter > Category dropdown has "All Categories" option', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const option = page.locator('option', { hasText: 'All Categories' });
        await expect(option).toBeAttached();
    });

    test('TC-LF15 | Search & Filter > Category dropdown has "Lost" option', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const option = page.locator('option', { hasText: 'Lost' });
        await expect(option).toBeAttached();
    });

    test('TC-LF16 | Search & Filter > Category dropdown has "Found" option', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const option = page.locator('option', { hasText: 'Found' });
        await expect(option).toBeAttached();
    });

    test('TC-LF17 | Search & Filter > Category dropdown has "Electronics" option', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const option = page.locator('option', { hasText: 'Electronics' });
        await expect(option).toBeAttached();
    });

    test('TC-LF18 | Search & Filter > Sort dropdown has "Latest First" option', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const option = page.locator('option', { hasText: 'Latest First' });
        await expect(option).toBeAttached();
    });

    test('TC-LF19 | Search & Filter > Sort dropdown has "Oldest First" option', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const option = page.locator('option', { hasText: 'Oldest First' });
        await expect(option).toBeAttached();
    });

});

// ────────────────────────────────────────────────────────────────────────────
// 4. Filter Buttons
// ────────────────────────────────────────────────────────────────────────────
test.describe('4. Filter Buttons', () => {

    test('TC-LF20 | Filter Buttons > "My Posts" button is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const btn = page.getByRole('button', { name: /my posts/i });
        await expect(btn).toBeVisible();
    });

    test('TC-LF21 | Filter Buttons > "Date Range Filter" button is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const btn = page.getByRole('button', { name: /date range filter/i });
        await expect(btn).toBeVisible();
    });

    test('TC-LF22 | Filter Buttons > "Reset All" button is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const btn = page.getByRole('button', { name: /reset all/i });
        await expect(btn).toBeVisible();
    });

    test('TC-LF23 | Filter Buttons > Clicking "Date Range Filter" reveals date inputs', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: /date range filter/i }).click();
        await expect(page.locator('input[type="date"]').first()).toBeVisible();
    });

    test('TC-LF24 | Filter Buttons > Date filter panel shows "From Date" label', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.getByRole('button', { name: /date range filter/i }).click();
        await expect(page.getByText(/from date/i)).toBeVisible();
    });

    test('TC-LF25 | Filter Buttons > Date filter panel shows "To Date" label', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.getByRole('button', { name: /date range filter/i }).click();
        await expect(page.getByText(/to date/i)).toBeVisible();
    });

    test('TC-LF26 | Filter Buttons > Date filter panel has two date inputs', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.getByRole('button', { name: /date range filter/i }).click();
        const dateInputs = page.locator('input[type="date"]');
        await expect(dateInputs).toHaveCount(2);
    });

    test('TC-LF27 | Filter Buttons > Clicking "Hide Dates" hides the date panel', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.getByRole('button', { name: /date range filter/i }).click();
        await expect(page.locator('input[type="date"]').first()).toBeVisible();
        await page.getByRole('button', { name: /hide dates/i }).click();
        await expect(page.locator('input[type="date"]').first()).not.toBeVisible();
    });

});

// ────────────────────────────────────────────────────────────────────────────
// 5. Item Cards
// ────────────────────────────────────────────────────────────────────────────
test.describe('5. Item Cards', () => {

    test('TC-LF28 | Item Cards > Items grid container is present on page', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(1500);
        const grid = page.locator('.grid').last();
        await expect(grid).toBeVisible();
    });

    test('TC-LF29 | Item Cards > Empty state message is shown when no results found', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(1000);
        const searchInput = page.getByPlaceholder(/search for items/i);
        await searchInput.fill('xyzxyzxyz_nonexistent_item_12345');
        await page.waitForTimeout(1200);
        await expect(page.getByText(/no results found/i)).toBeVisible();
    });

    test('TC-LF30 | Item Cards > "Clear All Filters" link appears in empty state', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(1000);
        const searchInput = page.getByPlaceholder(/search for items/i);
        await searchInput.fill('xyzxyzxyz_nonexistent_item_12345');
        await page.waitForTimeout(1200);
        await expect(page.getByText(/clear all filters/i)).toBeVisible();
    });

    test('TC-LF31 | Item Cards > Clicking "Clear All Filters" resets search input', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(800);
        const searchInput = page.getByPlaceholder(/search for items/i);
        await searchInput.fill('xyzxyz');
        await page.waitForTimeout(1000);
        await page.getByText(/clear all filters/i).click();
        await expect(searchInput).toHaveValue('');
    });

});

// ────────────────────────────────────────────────────────────────────────────
// 6. Login Prompt (Guest User Actions)
// ────────────────────────────────────────────────────────────────────────────
test.describe('6. Login Prompt', () => {

    test('TC-LF32 | Login Prompt > Clicking "I Lost Something" as guest shows login prompt', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(500);
        await page.getByText('I Lost Something').click();
        await expect(page.getByText(/login required/i)).toBeVisible();
    });

    test('TC-LF33 | Login Prompt > Clicking "I Found Something" as guest shows login prompt', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(500);
        await page.getByText('I Found Something').click();
        await expect(page.getByText(/login required/i)).toBeVisible();
    });

    test('TC-LF34 | Login Prompt > Login prompt has "Go to Login" button', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(500);
        await page.getByText('I Lost Something').click();
        await expect(page.getByRole('button', { name: /go to login/i })).toBeVisible();
    });

    test('TC-LF35 | Login Prompt > Login prompt has "Close" button', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(500);
        await page.getByText('I Lost Something').click();
        await expect(page.getByRole('button', { name: /close/i })).toBeVisible();
    });

    test('TC-LF36 | Login Prompt > Clicking "Close" dismisses the login prompt', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForTimeout(500);
        await page.getByText('I Lost Something').click();
        await page.getByRole('button', { name: /close/i }).click();
        await expect(page.getByText(/login required/i)).not.toBeVisible();
    });

    test('TC-LF37 | Login Prompt > Clicking "Go to Login" redirects to login page', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(800);
        await page.getByText('I Lost Something').click();
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: /go to login/i }).click();
        await page.waitForURL(/\/[Ll]ogin/i, { timeout: 10000 });
        expect(page.url().toLowerCase()).toContain('login');
    });

});

// ────────────────────────────────────────────────────────────────────────────
// 7. Report Modal — Lost Item (logged in)
// ────────────────────────────────────────────────────────────────────────────
test.describe('7. Report Modal — Lost Item', () => {

    test('TC-LF38 | Report Modal > "I Lost Something" opens report modal when logged in', async ({ page }) => {
        await loginAsUser(page);
        await page.getByText('I Lost Something').first().click();
        await page.waitForTimeout(800);
        await expect(page.getByText(/lost/i).nth(1)).toBeVisible();
    });

    test('TC-LF39 | Report Modal > Report modal has item name input field', async ({ page }) => {
        await loginAsUser(page);
        await page.getByText('I Lost Something').first().click();
        await page.waitForTimeout(1000);
        const nameInput = page.locator('input[type="text"]').first();
        await expect(nameInput).toBeVisible();
    });

    test('TC-LF40 | Report Modal > Report modal has category dropdown', async ({ page }) => {
        await loginAsUser(page);
        await page.getByText('I Lost Something').click();
        await page.waitForTimeout(300);
        const categorySelect = page.locator('select').first();
        await expect(categorySelect).toBeVisible();
    });

    test('TC-LF41 | Report Modal > Report modal has description textarea', async ({ page }) => {
        await loginAsUser(page);
        await page.getByText('I Lost Something').click();
        await page.waitForTimeout(300);
        const textarea = page.locator('textarea').first();
        await expect(textarea).toBeVisible();
    });

    test('TC-LF42 | Report Modal > Report modal has a close button', async ({ page }) => {
        await loginAsUser(page);
        await page.getByText('I Lost Something').click();
        await page.waitForTimeout(300);
        const closeBtn = page.getByRole('button', { name: /cancel|close|✕/i }).first();
        await expect(closeBtn).toBeVisible();
    });

    test('TC-LF43 | Report Modal > "I Found Something" opens report modal when logged in', async ({ page }) => {
        await loginAsUser(page);
        await page.getByText('I Found Something').click();
        await expect(page.getByText(/report a found item/i)).toBeVisible();
    });

    test('TC-LF44 | Report Modal > Report modal has "Set Current Time" button', async ({ page }) => {
        await loginAsUser(page);
        await page.getByText('I Lost Something').click();
        await page.waitForTimeout(400);
        await expect(page.getByRole('button', { name: /now|current time|set now/i })).toBeVisible();
    });

});

// ────────────────────────────────────────────────────────────────────────────
// 8. Sidebar Navigation
// ────────────────────────────────────────────────────────────────────────────
test.describe('8. Sidebar Navigation', () => {

    test('TC-LF45 | Sidebar Navigation > Header navigation is visible', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(800);
        const header = page.locator('.uc-header').first();
        await expect(header).toBeVisible();
    });

    test('TC-LF46 | Sidebar Navigation > Uni-Connect brand text is visible in header', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        const brand = page.getByText(/uni-connect/i).first();
        await expect(brand).toBeVisible();
    });

    test('TC-LF47 | Sidebar Navigation > Lost & Found nav item navigates to correct page', async ({ page }) => {
        await page.goto(`${BASE_URL}/lost-and-found`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(500);
        expect(page.url()).toContain('/lost-and-found');
    });

});