# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lostAndFound.spec.js >> 3. Search & Filter Bar >> TC-LF17 | Search & Filter > Category dropdown has "Electronics" option
- Location: tests\lostAndFound.spec.js:142:9

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
        - generic [ref=e12]:
          - heading "Uni-Connect" [level=2] [ref=e13]
          - paragraph [ref=e14]: Student Hub of SLIIT
      - generic [ref=e15]:
        - button "Ghost-Lec" [ref=e16] [cursor=pointer]
        - button "Lost and Found" [ref=e17] [cursor=pointer]
        - button "Cart" [ref=e19] [cursor=pointer]:
          - img [ref=e20]
        - button "Log In" [ref=e24] [cursor=pointer]
  - banner [ref=e25]:
    - generic [ref=e26]:
      - heading "Find what was lost." [level=1] [ref=e27]
      - paragraph [ref=e28]: The most trusted community platform for recovering lost belongings and returning found treasures.
      - generic [ref=e29]:
        - generic [ref=e30] [cursor=pointer]:
          - img [ref=e32]
          - heading "I Lost Something" [level=3] [ref=e35]
          - paragraph [ref=e36]: Post a detailed report of your missing item.
        - generic [ref=e37] [cursor=pointer]:
          - img [ref=e39]
          - heading "I Found Something" [level=3] [ref=e41]
          - paragraph [ref=e42]: Report a found item to the community.
  - main [ref=e43]:
    - generic [ref=e45]:
      - generic [ref=e46]:
        - img [ref=e48]
        - textbox "Search for items (e.g. Blue Wallet, iPhone 13)..." [ref=e51]
      - generic [ref=e52]:
        - generic [ref=e53]:
          - combobox [ref=e54] [cursor=pointer]:
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
        - generic [ref=e55]:
          - combobox [ref=e56] [cursor=pointer]:
            - option "Latest First" [selected]
            - option "Oldest First"
          - generic:
            - img
    - generic [ref=e57]:
      - button "My Posts" [ref=e58] [cursor=pointer]:
        - img [ref=e59]
        - text: My Posts
      - button "Date Range Filter" [ref=e64] [cursor=pointer]:
        - img [ref=e65]
        - text: Date Range Filter
      - button "Reset All" [ref=e67] [cursor=pointer]
    - generic [ref=e68]:
      - generic [ref=e69]:
        - generic [ref=e70]:
          - img "NIC" [ref=e71]
          - generic [ref=e73]: Found
          - generic [ref=e74]: RESOLVED
        - generic [ref=e75]:
          - generic [ref=e76]:
            - heading "NIC" [level=3] [ref=e78]
            - generic [ref=e80]: Essentials
            - generic [ref=e81]:
              - generic [ref=e82]:
                - img [ref=e83]
                - text: Main Entrance
              - generic [ref=e86]:
                - img [ref=e87]
                - text: 4/2/2026 (22d ago)
          - generic [ref=e90]:
            - button "Details" [ref=e91] [cursor=pointer]
            - button "Chat" [ref=e92] [cursor=pointer]:
              - img [ref=e93]
              - text: Chat
      - generic [ref=e95]:
        - generic [ref=e96]:
          - img "Lap Charger" [ref=e97]
          - generic [ref=e99]: Found
          - generic [ref=e100]: RESOLVED
        - generic [ref=e101]:
          - generic [ref=e102]:
            - heading "Lap Charger" [level=3] [ref=e104]
            - generic [ref=e106]: Electronics
            - generic [ref=e107]:
              - generic [ref=e108]:
                - img [ref=e109]
                - text: Faculty of Computing
              - generic [ref=e112]:
                - img [ref=e113]
                - text: 4/1/2026 (22d ago)
          - generic [ref=e116]:
            - button "Details" [ref=e117] [cursor=pointer]
            - button "Chat" [ref=e118] [cursor=pointer]:
              - img [ref=e119]
              - text: Chat
      - generic [ref=e121]:
        - generic [ref=e122]:
          - img "Wallet" [ref=e123]
          - generic [ref=e125]: Lost
          - generic [ref=e126]: ACTIVE
        - generic [ref=e127]:
          - generic [ref=e128]:
            - heading "Wallet" [level=3] [ref=e130]
            - generic [ref=e132]: Essentials
            - generic [ref=e133]:
              - generic [ref=e134]:
                - img [ref=e135]
                - text: Play Ground
              - generic [ref=e138]:
                - img [ref=e139]
                - text: 3/30/2026 (24d ago)
          - generic [ref=e142]:
            - button "Details" [ref=e143] [cursor=pointer]
            - button "Chat" [ref=e144] [cursor=pointer]:
              - img [ref=e145]
              - text: Chat
      - generic [ref=e147]:
        - generic [ref=e148]:
          - img "Laptop" [ref=e149]
          - generic [ref=e151]: Lost
          - generic [ref=e152]: ACTIVE
        - generic [ref=e153]:
          - generic [ref=e154]:
            - heading "Laptop" [level=3] [ref=e156]
            - generic [ref=e158]: Electronics
            - generic [ref=e159]:
              - generic [ref=e160]:
                - img [ref=e161]
                - text: Library
              - generic [ref=e164]:
                - img [ref=e165]
                - text: 3/25/2026 (1m ago)
          - generic [ref=e168]:
            - button "Details" [ref=e169] [cursor=pointer]
            - button "Chat" [ref=e170] [cursor=pointer]:
              - img [ref=e171]
              - text: Chat
      - generic [ref=e173]:
        - generic [ref=e174]:
          - img "Pencil case" [ref=e175]
          - generic [ref=e177]: Lost
          - generic [ref=e178]: ACTIVE
        - generic [ref=e179]:
          - generic [ref=e180]:
            - heading "Pencil case" [level=3] [ref=e182]
            - generic [ref=e184]: Other
            - generic [ref=e185]:
              - generic [ref=e186]:
                - img [ref=e187]
                - text: Auditorium
              - generic [ref=e190]:
                - img [ref=e191]
                - text: 3/19/2026 (1m ago)
          - generic [ref=e194]:
            - button "Details" [ref=e195] [cursor=pointer]
            - button "Chat" [ref=e196] [cursor=pointer]:
              - img [ref=e197]
              - text: Chat
      - generic [ref=e199]:
        - generic [ref=e200]:
          - img "Phone" [ref=e201]
          - generic [ref=e203]: Lost
          - generic [ref=e204]: ACTIVE
        - generic [ref=e205]:
          - generic [ref=e206]:
            - heading "Phone" [level=3] [ref=e208]
            - generic [ref=e210]: Electronics
            - generic [ref=e211]:
              - generic [ref=e212]:
                - img [ref=e213]
                - text: Greenhouse
              - generic [ref=e216]:
                - img [ref=e217]
                - text: 3/19/2026 (1m ago)
          - generic [ref=e220]:
            - button "Details" [ref=e221] [cursor=pointer]
            - button "Chat" [ref=e222] [cursor=pointer]:
              - img [ref=e223]
              - text: Chat
      - generic [ref=e225]:
        - generic [ref=e226]:
          - img "Lap Bag" [ref=e227]
          - generic [ref=e229]: Lost
          - generic [ref=e230]: ACTIVE
        - generic [ref=e231]:
          - generic [ref=e232]:
            - heading "Lap Bag" [level=3] [ref=e234]
            - generic [ref=e236]: Essentials
            - generic [ref=e237]:
              - generic [ref=e238]:
                - img [ref=e239]
                - text: SLIIT Business School
              - generic [ref=e242]:
                - img [ref=e243]
                - text: 3/15/2026 (1m ago)
          - generic [ref=e246]:
            - button "Details" [ref=e247] [cursor=pointer]
            - button "Chat" [ref=e248] [cursor=pointer]:
              - img [ref=e249]
              - text: Chat
  - contentinfo [ref=e251]:
    - generic [ref=e252]:
      - generic [ref=e254]:
        - img [ref=e256]
        - generic [ref=e259]:
          - heading "Uni-Connect" [level=3] [ref=e260]
          - paragraph [ref=e261]: Empowering student life at SLIIT
      - generic [ref=e262]:
        - paragraph [ref=e263]: © 2026 UniConnect Portal
        - generic [ref=e264]:
          - link "Facebook" [ref=e265] [cursor=pointer]:
            - /url: https://www.facebook.com/
          - link "LinkedIn" [ref=e266] [cursor=pointer]:
            - /url: https://www.linkedin.com/
          - link "Instagram" [ref=e267] [cursor=pointer]:
            - /url: https://www.instagram.com/
```

# Test source

```ts
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
  80  |         await page.goto(`${BASE_URL}/lost-and-found`);
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
> 143 |         await page.goto(`${BASE_URL}/lost-and-found`);
      |                    ^ Error: page.goto: Test timeout of 30000ms exceeded.
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
  181 |         const btn = page.getByRole('button', { name: /reset all/i });
  182 |         await expect(btn).toBeVisible();
  183 |     });
  184 | 
  185 |     test('TC-LF23 | Filter Buttons > Clicking "Date Range Filter" reveals date inputs', async ({ page }) => {
  186 |         await page.goto(`${BASE_URL}/lost-and-found`);
  187 |         await page.waitForTimeout(500);
  188 |         await page.getByRole('button', { name: /date range filter/i }).click();
  189 |         await expect(page.locator('input[type="date"]').first()).toBeVisible();
  190 |     });
  191 | 
  192 |     test('TC-LF24 | Filter Buttons > Date filter panel shows "From Date" label', async ({ page }) => {
  193 |         await page.goto(`${BASE_URL}/lost-and-found`);
  194 |         await page.getByRole('button', { name: /date range filter/i }).click();
  195 |         await expect(page.getByText(/from date/i)).toBeVisible();
  196 |     });
  197 | 
  198 |     test('TC-LF25 | Filter Buttons > Date filter panel shows "To Date" label', async ({ page }) => {
  199 |         await page.goto(`${BASE_URL}/lost-and-found`);
  200 |         await page.getByRole('button', { name: /date range filter/i }).click();
  201 |         await expect(page.getByText(/to date/i)).toBeVisible();
  202 |     });
  203 | 
  204 |     test('TC-LF26 | Filter Buttons > Date filter panel has two date inputs', async ({ page }) => {
  205 |         await page.goto(`${BASE_URL}/lost-and-found`);
  206 |         await page.getByRole('button', { name: /date range filter/i }).click();
  207 |         const dateInputs = page.locator('input[type="date"]');
  208 |         await expect(dateInputs).toHaveCount(2);
  209 |     });
  210 | 
  211 |     test('TC-LF27 | Filter Buttons > Clicking "Hide Dates" hides the date panel', async ({ page }) => {
  212 |         await page.goto(`${BASE_URL}/lost-and-found`);
  213 |         await page.getByRole('button', { name: /date range filter/i }).click();
  214 |         await expect(page.locator('input[type="date"]').first()).toBeVisible();
  215 |         await page.getByRole('button', { name: /hide dates/i }).click();
  216 |         await expect(page.locator('input[type="date"]').first()).not.toBeVisible();
  217 |     });
  218 | 
  219 | });
  220 | 
  221 | // ────────────────────────────────────────────────────────────────────────────
  222 | // 5. Item Cards
  223 | // ────────────────────────────────────────────────────────────────────────────
  224 | test.describe('5. Item Cards', () => {
  225 | 
  226 |     test('TC-LF28 | Item Cards > Items grid container is present on page', async ({ page }) => {
  227 |         await page.goto(`${BASE_URL}/lost-and-found`);
  228 |         await page.waitForTimeout(1500);
  229 |         const grid = page.locator('.grid').last();
  230 |         await expect(grid).toBeVisible();
  231 |     });
  232 | 
  233 |     test('TC-LF29 | Item Cards > Empty state message is shown when no results found', async ({ page }) => {
  234 |         await page.goto(`${BASE_URL}/lost-and-found`);
  235 |         await page.waitForTimeout(1000);
  236 |         const searchInput = page.getByPlaceholder(/search for items/i);
  237 |         await searchInput.fill('xyzxyzxyz_nonexistent_item_12345');
  238 |         await page.waitForTimeout(1200);
  239 |         await expect(page.getByText(/no results found/i)).toBeVisible();
  240 |     });
  241 | 
  242 |     test('TC-LF30 | Item Cards > "Clear All Filters" link appears in empty state', async ({ page }) => {
  243 |         await page.goto(`${BASE_URL}/lost-and-found`);
```