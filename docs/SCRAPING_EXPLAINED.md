# Web Scraping Concepts Explained

## 1. Pagination

**What it is:** When websites have too many items to show on one page, they split them across multiple pages (like Google search results).

**How it works:**

- URLs often change like: `page=1`, `page=2`, `page=3`, etc.
- Or there's a "Next" button that links to the next page
- We need to loop through all pages to get all shows

**Simple example:**

```javascript
// Instead of just fetching one page:
fetch("https://example.com/shows?page=1");

// We loop through pages:
for (let page = 1; page <= 10; page++) {
  const html = await fetch(`https://example.com/shows?page=${page}`);
  // Extract shows from this page
}
```

**Challenges:**

- We need to know when to stop (no more pages)
- Some sites use infinite scroll (content loads as you scroll)
- Some sites use JavaScript to load more content

## 2. Headless Browsers

**What it is:** A browser that runs without a visible window - perfect for automation.

**Why needed:** Many modern websites use JavaScript to load content dynamically. Regular `fetch()` only gets the initial HTML, not content loaded by JavaScript.

**Tools:**

- **Puppeteer** (Chrome-based, popular)
- **Playwright** (multi-browser, newer)
- Both can:
  - Run JavaScript on the page
  - Wait for content to load
  - Scroll pages
  - Click buttons
  - Extract fully-rendered HTML

**Example:**

```javascript
// Regular fetch - might miss JavaScript-loaded content
const html = await fetch(url).then((r) => r.text());

// Headless browser - gets fully rendered page
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url);
await page.waitForSelector(".show-list"); // Wait for shows to load
const html = await page.content(); // Get full rendered HTML
await browser.close();
```

**Trade-offs:**

- ✅ Gets JavaScript-rendered content
- ✅ Can handle infinite scroll
- ✅ More reliable for modern websites
- ❌ Slower (browser needs to load/run)
- ❌ Uses more resources
- ❌ More complex to set up

**For Convex:** Headless browsers are harder in serverless environments. We'd need to:

- Use a service like Browserless.io
- Or run our own browser infrastructure
- Or find pages that don't require JavaScript

## 3. Following Links

**What it is:** Instead of scraping a list page, we:

1. Extract links to individual show pages
2. Visit each show page
3. Extract detailed information

**Example:**

```javascript
// Step 1: Get list page
const listHtml = await fetch("https://example.com/shows");

// Step 2: Extract all show links
const showLinks = extractLinks(listHtml); // ["/shows/hamilton", "/shows/wicked", ...]

// Step 3: Visit each show page
for (const link of showLinks) {
  const showHtml = await fetch(`https://example.com${link}`);
  const showData = extractShowDetails(showHtml);
}
```

**Trade-offs:**

- ✅ Get more detailed info per show
- ✅ More reliable (specific pages less likely to change)
- ✅ Can get images, cast, etc.
- ❌ Much slower (many HTTP requests)
- ❌ More API calls (costs more)
- ❌ More complex error handling

**For our use case:** This is actually a good middle ground! We could:

1. Use AI to extract show links from list pages
2. Fetch each show's detail page
3. Use AI to extract full details from each page

## Recommended Approach for Theatre App

### Phase 1: Simple Improvements (Do First)

1. **Try multiple URL variations** - Test actual URLs that exist
2. **Improve AI prompt** - Ask it to find ALL shows, not just some
3. **Better error handling** - Log what's actually happening

### Phase 2: Pagination (Medium Complexity)

1. **Detect pagination** - Check if URLs have page parameters
2. **Loop through pages** - Fetch page 1, 2, 3... until no more shows
3. **Stop condition** - Stop when we get 0 shows or hit a limit

### Phase 3: Following Links (Higher Value)

1. **Extract show links** from list pages
2. **Fetch detail pages** for each show
3. **Extract full details** from detail pages
4. **Benefits:** More reliable, more data, better quality

### Phase 4: Headless Browser (If Needed)

Only if Phase 1-3 don't work because sites require JavaScript.

## What We Should Do Now

1. ✅ **Improve AI prompt** - Make it extract ALL shows
2. ✅ **Add logging** - See exactly what's being extracted
3. ✅ **Test multiple URLs** - Verify they actually work
4. ⏭️ **Implement pagination** - If URLs support it
5. ⏭️ **Consider following links** - If pagination doesn't help enough
