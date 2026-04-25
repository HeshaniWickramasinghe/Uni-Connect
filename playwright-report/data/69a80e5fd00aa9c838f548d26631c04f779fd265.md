# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lostAndFound.spec.js >> 2. Hero Section >> TC-LF08 | Hero Section > "I Found Something" card is visible
- Location: tests\lostAndFound.spec.js:79:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/lost-and-found", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - generic [ref=e6]:
      - button "Uni-Connect Student Hub of SLIIT" [ref=e7] [cursor=pointer]:
        - img [ref=e9]
        - generic [ref=e13]:
          - heading "Uni-Connect" [level=2] [ref=e14]
          - paragraph [ref=e15]: Student Hub of SLIIT
      - generic [ref=e16]:
        - button "Ghost-Lec" [ref=e17] [cursor=pointer]
        - button "Lost and Found" [ref=e18] [cursor=pointer]
        - button "Cart" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - button "Log In" [ref=e25] [cursor=pointer]
  - banner [ref=e26]:
    - generic [ref=e27]:
      - heading "Find what was lost." [level=1] [ref=e28]
      - paragraph [ref=e29]: The most trusted community platform for recovering lost belongings and returning found treasures.
      - generic [ref=e30]:
        - generic [ref=e31] [cursor=pointer]:
          - img [ref=e33]
          - heading "I Lost Something" [level=3] [ref=e36]
          - paragraph [ref=e37]: Post a detailed report of your missing item.
        - generic [ref=e38] [cursor=pointer]:
          - img [ref=e40]
          - heading "I Found Something" [level=3] [ref=e42]
          - paragraph [ref=e43]: Report a found item to the community.
  - main [ref=e44]:
    - generic [ref=e46]:
      - generic [ref=e47]:
        - img [ref=e49]
        - textbox "Search for items (e.g. Blue Wallet, iPhone 13)..." [ref=e52]
      - generic [ref=e53]:
        - generic [ref=e54]:
          - combobox [ref=e55] [cursor=pointer]:
            - option "All Categories" [selected]
            - option "My Posts"
            - option "Lost"
            - option "Found"
            - option "Electronics"
            - option "Essentials"
            - option "Books"
            - option "Keys"
          - generic:
            - img
        - generic [ref=e56]:
          - combobox [ref=e57] [cursor=pointer]:
            - option "Latest First" [selected]
            - option "Oldest First"
          - generic:
            - img
    - generic [ref=e58]:
      - button "My Posts" [ref=e59] [cursor=pointer]:
        - img [ref=e60]
        - text: My Posts
      - button "Date Range Filter" [ref=e65] [cursor=pointer]:
        - img [ref=e66]
        - text: Date Range Filter
      - button "Reset All" [ref=e71] [cursor=pointer]
    - generic [ref=e72]:
      - generic [ref=e73]:
        - generic [ref=e74]:
          - img "Laptop" [ref=e75]
          - generic [ref=e77]: Found
          - generic [ref=e78]: ACTIVE
        - generic [ref=e79]:
          - generic [ref=e80]:
            - heading "Laptop" [level=3] [ref=e82]
            - generic [ref=e84]: Electronics
            - generic [ref=e85]:
              - generic [ref=e86]:
                - img [ref=e87]
                - text: Auditorium
              - generic [ref=e90]:
                - img [ref=e91]
                - text: 4/25/2026 (3h ago)
          - generic [ref=e94]:
            - button "Details" [ref=e95] [cursor=pointer]
            - button "Chat" [ref=e96] [cursor=pointer]:
              - img [ref=e97]
              - text: Chat
      - generic [ref=e99]:
        - generic [ref=e100]:
          - img "phone" [ref=e101]
          - generic [ref=e103]: Found
          - generic [ref=e104]: ACTIVE
        - generic [ref=e105]:
          - generic [ref=e106]:
            - heading "phone" [level=3] [ref=e108]
            - generic [ref=e110]: Electronics
            - generic [ref=e111]:
              - generic [ref=e112]:
                - img [ref=e113]
                - text: Main Entrance
              - generic [ref=e116]:
                - img [ref=e117]
                - text: 4/25/2026 (6h ago)
          - generic [ref=e120]:
            - button "Details" [ref=e121] [cursor=pointer]
            - button "Chat" [ref=e122] [cursor=pointer]:
              - img [ref=e123]
              - text: Chat
      - generic [ref=e125]:
        - generic [ref=e126]:
          - img "NIC" [ref=e127]
          - generic [ref=e129]: Found
          - generic [ref=e130]: RESOLVED
        - generic [ref=e131]:
          - generic [ref=e132]:
            - heading "NIC" [level=3] [ref=e134]
            - generic [ref=e136]: Essentials
            - generic [ref=e137]:
              - generic [ref=e138]:
                - img [ref=e139]
                - text: Main Entrance
              - generic [ref=e142]:
                - img [ref=e143]
                - text: 4/2/2026 (23d ago)
          - generic [ref=e146]:
            - button "Details" [ref=e147] [cursor=pointer]
            - button "Chat" [ref=e148] [cursor=pointer]:
              - img [ref=e149]
              - text: Chat
      - generic [ref=e151]:
        - generic [ref=e152]:
          - img "Lap Charger" [ref=e153]
          - generic [ref=e155]: Found
          - generic [ref=e156]: RESOLVED
        - generic [ref=e157]:
          - generic [ref=e158]:
            - heading "Lap Charger" [level=3] [ref=e160]
            - generic [ref=e162]: Electronics
            - generic [ref=e163]:
              - generic [ref=e164]:
                - img [ref=e165]
                - text: Faculty of Computing
              - generic [ref=e168]:
                - img [ref=e169]
                - text: 4/1/2026 (24d ago)
          - generic [ref=e172]:
            - button "Details" [ref=e173] [cursor=pointer]
            - button "Chat" [ref=e174] [cursor=pointer]:
              - img [ref=e175]
              - text: Chat
      - generic [ref=e177]:
        - generic [ref=e178]:
          - img "Wallet" [ref=e179]
          - generic [ref=e181]: Lost
          - generic [ref=e182]: ACTIVE
        - generic [ref=e183]:
          - generic [ref=e184]:
            - heading "Wallet" [level=3] [ref=e186]
            - generic [ref=e188]: Essentials
            - generic [ref=e189]:
              - generic [ref=e190]:
                - img [ref=e191]
                - text: Play Ground
              - generic [ref=e194]:
                - img [ref=e195]
                - text: 3/30/2026 (25d ago)
          - generic [ref=e198]:
            - button "Details" [ref=e199] [cursor=pointer]
            - button "Chat" [ref=e200] [cursor=pointer]:
              - img [ref=e201]
              - text: Chat
      - generic [ref=e203]:
        - generic [ref=e204]:
          - img "Laptop" [ref=e205]
          - generic [ref=e207]: Lost
          - generic [ref=e208]: ACTIVE
        - generic [ref=e209]:
          - generic [ref=e210]:
            - heading "Laptop" [level=3] [ref=e212]
            - generic [ref=e214]: Electronics
            - generic [ref=e215]:
              - generic [ref=e216]:
                - img [ref=e217]
                - text: Library
              - generic [ref=e220]:
                - img [ref=e221]
                - text: 3/25/2026 (1m ago)
          - generic [ref=e224]:
            - button "Details" [ref=e225] [cursor=pointer]
            - button "Chat" [ref=e226] [cursor=pointer]:
              - img [ref=e227]
              - text: Chat
      - generic [ref=e229]:
        - generic [ref=e230]:
          - img "Pencil case" [ref=e231]
          - generic [ref=e233]: Lost
          - generic [ref=e234]: ACTIVE
        - generic [ref=e235]:
          - generic [ref=e236]:
            - heading "Pencil case" [level=3] [ref=e238]
            - generic [ref=e240]: Other
            - generic [ref=e241]:
              - generic [ref=e242]:
                - img [ref=e243]
                - text: Auditorium
              - generic [ref=e246]:
                - img [ref=e247]
                - text: 3/19/2026 (1m ago)
          - generic [ref=e250]:
            - button "Details" [ref=e251] [cursor=pointer]
            - button "Chat" [ref=e252] [cursor=pointer]:
              - img [ref=e253]
              - text: Chat
      - generic [ref=e255]:
        - generic [ref=e256]:
          - img "Phone" [ref=e257]
          - generic [ref=e259]: Lost
          - generic [ref=e260]: ACTIVE
        - generic [ref=e261]:
          - generic [ref=e262]:
            - heading "Phone" [level=3] [ref=e264]
            - generic [ref=e266]: Electronics
            - generic [ref=e267]:
              - generic [ref=e268]:
                - img [ref=e269]
                - text: Greenhouse
              - generic [ref=e272]:
                - img [ref=e273]
                - text: 3/19/2026 (1m ago)
          - generic [ref=e276]:
            - button "Details" [ref=e277] [cursor=pointer]
            - button "Chat" [ref=e278] [cursor=pointer]:
              - img [ref=e279]
              - text: Chat
      - generic [ref=e281]:
        - generic [ref=e282]:
          - img "Lap Bag" [ref=e283]
          - generic [ref=e285]: Lost
          - generic [ref=e286]: ACTIVE
        - generic [ref=e287]:
          - generic [ref=e288]:
            - heading "Lap Bag" [level=3] [ref=e290]
            - generic [ref=e292]: Essentials
            - generic [ref=e293]:
              - generic [ref=e294]:
                - img [ref=e295]
                - text: SLIIT Business School
              - generic [ref=e298]:
                - img [ref=e299]
                - text: 3/15/2026 (1m ago)
          - generic [ref=e302]:
            - button "Details" [ref=e303] [cursor=pointer]
            - button "Chat" [ref=e304] [cursor=pointer]:
              - img [ref=e305]
              - text: Chat
  - contentinfo [ref=e307]:
    - generic [ref=e308]:
      - generic [ref=e310]:
        - img [ref=e312]
        - generic [ref=e316]:
          - heading "Uni-Connect" [level=3] [ref=e317]
          - paragraph [ref=e318]: Empowering student life at SLIIT
      - generic [ref=e319]:
        - paragraph [ref=e320]: © 2026 UniConnect Portal
        - generic [ref=e321]:
          - link "Facebook" [ref=e322] [cursor=pointer]:
            - /url: https://www.facebook.com/
          - link "LinkedIn" [ref=e323] [cursor=pointer]:
            - /url: https://www.linkedin.com/
          - link "Instagram" [ref=e324] [cursor=pointer]:
            - /url: https://www.instagram.com/
```

# Test source

```ts
  1   | // lostAndFound.spec.js — Playwright tests for the Lost & Found module
  2   | // Uni-Connect ITPM Project | Heshani Wickramasinghe
  3   | // Covers: Dashboard, Hero Section, Search & Filter, Item Cards,
  4   | //         Report Modal, Login Prompt, Date Filter, Item Details, Handover Modal
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  9   | 
  10  | // ── Helper: inject a logged-in user into sessionStorage ──────────────────
  11  | async function loginAsUser(page) {
  12  |     await page.goto(`${BASE_URL}/lost-and-found`);
  13  |     await page.waitForLoadState('domcontentloaded');
  14  |     await page.waitForTimeout(800);
  15  |     await page.evaluate(() => {
  16  |         sessionStorage.setItem('loggedInUser', JSON.stringify({
  17  |             name: 'Heshani Wickramasinghe',
  18  |             email: 'heshani@test.com',
  19  |             registrationNo: 'IT22XXXXXX'
  20  |         }));
  21  |     });
  22  |     await page.reload();
  23  |     await page.waitForLoadState('domcontentloaded');
  24  |     await page.waitForTimeout(1500);
  25  | }
  26  | 
  27  | // ────────────────────────────────────────────────────────────────────────────
  28  | // 1. Lost & Found Dashboard — Page Load
  29  | // ────────────────────────────────────────────────────────────────────────────
  30  | test.describe('1. Lost & Found Dashboard', () => {
  31  | 
  32  |     test('TC-LF01 | Dashboard > Lost & Found page loads at correct URL', async ({ page }) => {
  33  |         await page.goto(`${BASE_URL}/lost-and-found`);
  34  |         await page.waitForLoadState('domcontentloaded');
  35  |         expect(page.url()).toContain('/lost-and-found');
  36  |     });
  37  | 
  38  |     test('TC-LF02 | Dashboard > Page body is visible', async ({ page }) => {
  39  |         await page.goto(`${BASE_URL}/lost-and-found`);
  40  |         await expect(page.locator('body')).toBeVisible();
  41  |     });
  42  | 
  43  |     test('TC-LF03 | Dashboard > Header is present on the page', async ({ page }) => {
  44  |         await page.goto(`${BASE_URL}/lost-and-found`);
  45  |         const header = page.locator('header').first();
  46  |         await expect(header).toBeVisible();
  47  |     });
  48  | 
  49  |     test('TC-LF04 | Dashboard > Footer is present on the page', async ({ page }) => {
  50  |         await page.goto(`${BASE_URL}/lost-and-found`);
  51  |         const footer = page.locator('footer').first();
  52  |         await expect(footer).toBeVisible();
  53  |     });
  54  | 
  55  | });
  56  | 
  57  | // ────────────────────────────────────────────────────────────────────────────
  58  | // 2. Hero Section
  59  | // ────────────────────────────────────────────────────────────────────────────
  60  | test.describe('2. Hero Section', () => {
  61  | 
  62  |     test('TC-LF05 | Hero Section > Hero heading is visible', async ({ page }) => {
  63  |         await page.goto(`${BASE_URL}/lost-and-found`);
  64  |         await page.waitForLoadState('domcontentloaded');
  65  |         const heading = page.getByRole('heading', { name: /find what was lost/i });
  66  |         await expect(heading).toBeVisible();
  67  |     });
  68  | 
  69  |     test('TC-LF06 | Hero Section > Hero subtitle text is visible', async ({ page }) => {
  70  |         await page.goto(`${BASE_URL}/lost-and-found`);
  71  |         await expect(page.getByText(/most trusted community platform/i)).toBeVisible();
  72  |     });
  73  | 
  74  |     test('TC-LF07 | Hero Section > "I Lost Something" card is visible', async ({ page }) => {
  75  |         await page.goto(`${BASE_URL}/lost-and-found`);
  76  |         await expect(page.getByText('I Lost Something')).toBeVisible();
  77  |     });
  78  | 
  79  |     test('TC-LF08 | Hero Section > "I Found Something" card is visible', async ({ page }) => {
> 80  |         await page.goto(`${BASE_URL}/lost-and-found`);
      |                    ^ Error: page.goto: Test timeout of 30000ms exceeded.
  81  |         await expect(page.getByText('I Found Something')).toBeVisible();
  82  |     });
  83  | 
  84  |     test('TC-LF09 | Hero Section > Hero background has blue styling', async ({ page }) => {
  85  |         await page.goto(`${BASE_URL}/lost-and-found`);
  86  |         const hero = page.locator('header.bg-\\[\\#023E8A\\]').first();
  87  |         await expect(hero).toBeVisible();
  88  |     });
  89  | 
  90  | });
  91  | 
  92  | // ────────────────────────────────────────────────────────────────────────────
  93  | // 3. Search & Filter Bar
  94  | // ────────────────────────────────────────────────────────────────────────────
  95  | test.describe('3. Search & Filter Bar', () => {
  96  | 
  97  |     test('TC-LF10 | Search & Filter > Search input field is present', async ({ page }) => {
  98  |         await page.goto(`${BASE_URL}/lost-and-found`);
  99  |         const searchInput = page.getByPlaceholder(/search for items/i);
  100 |         await expect(searchInput).toBeVisible();
  101 |     });
  102 | 
  103 |     test('TC-LF11 | Search & Filter > Category dropdown is present', async ({ page }) => {
  104 |         await page.goto(`${BASE_URL}/lost-and-found`);
  105 |         const categorySelect = page.locator('select').first();
  106 |         await expect(categorySelect).toBeVisible();
  107 |     });
  108 | 
  109 |     test('TC-LF12 | Search & Filter > Sort dropdown is present', async ({ page }) => {
  110 |         await page.goto(`${BASE_URL}/lost-and-found`);
  111 |         const sortSelect = page.locator('select').nth(1);
  112 |         await expect(sortSelect).toBeVisible();
  113 |     });
  114 | 
  115 |     test('TC-LF13 | Search & Filter > Typing in search input updates value', async ({ page }) => {
  116 |         await page.goto(`${BASE_URL}/lost-and-found`);
  117 |         await page.waitForLoadState('domcontentloaded');
  118 |         await page.waitForTimeout(800);
  119 |         const searchInput = page.getByPlaceholder(/search for items/i);
  120 |         await searchInput.fill('wallet');
  121 |         await expect(searchInput).toHaveValue('wallet');
  122 |     });
  123 | 
  124 |     test('TC-LF14 | Search & Filter > Category dropdown has "All Categories" option', async ({ page }) => {
  125 |         await page.goto(`${BASE_URL}/lost-and-found`);
  126 |         const option = page.locator('option', { hasText: 'All Categories' });
  127 |         await expect(option).toBeAttached();
  128 |     });
  129 | 
  130 |     test('TC-LF15 | Search & Filter > Category dropdown has "Lost" option', async ({ page }) => {
  131 |         await page.goto(`${BASE_URL}/lost-and-found`);
  132 |         const option = page.locator('option', { hasText: 'Lost' });
  133 |         await expect(option).toBeAttached();
  134 |     });
  135 | 
  136 |     test('TC-LF16 | Search & Filter > Category dropdown has "Found" option', async ({ page }) => {
  137 |         await page.goto(`${BASE_URL}/lost-and-found`);
  138 |         const option = page.locator('option', { hasText: 'Found' });
  139 |         await expect(option).toBeAttached();
  140 |     });
  141 | 
  142 |     test('TC-LF17 | Search & Filter > Category dropdown has "Electronics" option', async ({ page }) => {
  143 |         await page.goto(`${BASE_URL}/lost-and-found`);
  144 |         const option = page.locator('option', { hasText: 'Electronics' });
  145 |         await expect(option).toBeAttached();
  146 |     });
  147 | 
  148 |     test('TC-LF18 | Search & Filter > Sort dropdown has "Latest First" option', async ({ page }) => {
  149 |         await page.goto(`${BASE_URL}/lost-and-found`);
  150 |         const option = page.locator('option', { hasText: 'Latest First' });
  151 |         await expect(option).toBeAttached();
  152 |     });
  153 | 
  154 |     test('TC-LF19 | Search & Filter > Sort dropdown has "Oldest First" option', async ({ page }) => {
  155 |         await page.goto(`${BASE_URL}/lost-and-found`);
  156 |         const option = page.locator('option', { hasText: 'Oldest First' });
  157 |         await expect(option).toBeAttached();
  158 |     });
  159 | 
  160 | });
  161 | 
  162 | // ────────────────────────────────────────────────────────────────────────────
  163 | // 4. Filter Buttons
  164 | // ────────────────────────────────────────────────────────────────────────────
  165 | test.describe('4. Filter Buttons', () => {
  166 | 
  167 |     test('TC-LF20 | Filter Buttons > "My Posts" button is visible', async ({ page }) => {
  168 |         await page.goto(`${BASE_URL}/lost-and-found`);
  169 |         const btn = page.getByRole('button', { name: /my posts/i });
  170 |         await expect(btn).toBeVisible();
  171 |     });
  172 | 
  173 |     test('TC-LF21 | Filter Buttons > "Date Range Filter" button is visible', async ({ page }) => {
  174 |         await page.goto(`${BASE_URL}/lost-and-found`);
  175 |         const btn = page.getByRole('button', { name: /date range filter/i });
  176 |         await expect(btn).toBeVisible();
  177 |     });
  178 | 
  179 |     test('TC-LF22 | Filter Buttons > "Reset All" button is visible', async ({ page }) => {
  180 |         await page.goto(`${BASE_URL}/lost-and-found`);
```