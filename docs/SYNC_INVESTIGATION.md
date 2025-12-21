# Data Sync Investigation: Why Only 19 Shows?

## Current Behavior

The sync is currently finding ~19 shows per run. This is likely due to several factors:

### Possible Reasons

1. **HTML Page Limitations**
   - Playbill.com and Broadway.com might only display a limited number of shows on the initial page load
   - Pages may be paginated or require JavaScript to load all shows
   - We're only scraping the HTML from a single page URL

2. **AI Extraction Limitations**
   - The AI might only be extracting shows that are clearly structured in the HTML
   - Complex layouts or JavaScript-rendered content might not be captured
   - The HTML might be truncated or cleaned before AI processing

3. **Source-Specific Issues**
   - Playbill.com error suggests that source might be failing or blocking requests
   - Rate limiting might be affecting how much content we can fetch
   - Anti-bot measures might be limiting access

## How to Investigate

### 1. Check Extraction Logs

Look at the logs to see how many shows are extracted per source:

```bash
npx convex logs | grep "Extracted.*shows from"
```

This will show you if the issue is:

- One source failing entirely (Playbill error)
- Both sources only finding a few shows
- Extraction working but validation removing shows

### 2. Test Individual Source Fetching

You can test fetching HTML from a source directly to see what's available:

```typescript
// In Convex dashboard, run:
npx convex run functions/dataSync:fetchSourceContent --args '{"sourceUrl": "https://www.playbill.com/productions"}'
```

### 3. Check AI Extraction Directly

Test the AI extraction with sample HTML to see how many shows it finds:

```typescript
// Would need to create a test function that:
// 1. Fetches HTML from a source
// 2. Passes it to extractShowDataWithAI
// 3. Returns the raw extracted data
```

### 4. Review Source URLs

The current URLs might not be the best pages to scrape:

- `https://www.playbill.com/productions` - might be a directory page
- `https://www.broadway.com/shows` - might have pagination

Consider:

- Checking if there are API endpoints (unlikely but worth checking)
- Finding pages that list ALL shows (not just featured ones)
- Using multiple URLs per source (e.g., Broadway current, upcoming, recent closures)

## Potential Solutions

### Option 1: Multiple URLs Per Source

Update `DATA_SOURCES` to include multiple URLs:

```typescript
const DATA_SOURCES = [
  {
    name: "playbill-current",
    url: "https://www.playbill.com/productions/current",
    enabled: true,
  },
  {
    name: "playbill-upcoming",
    url: "https://www.playbill.com/productions/upcoming",
    enabled: true,
  },
  {
    name: "broadway-current",
    url: "https://www.broadway.com/shows/current",
    enabled: true,
  },
  // etc.
];
```

### Option 2: Improve HTML Fetching

- Add pagination support
- Use headless browser for JavaScript-rendered content (more complex)
- Follow links to individual show pages

### Option 3: Adjust AI Prompt

The extraction prompt might be too restrictive. Consider:

- Asking AI to extract ALL shows it can find
- Providing more examples in the prompt
- Breaking extraction into chunks if HTML is large

### Option 4: Use Multiple Extraction Passes

- First pass: Extract show titles and basic info
- Second pass: For each show, fetch its detail page for full information

### Option 5: Manual Data Entry + Sync

- Start with a seed database of known shows
- Use sync to keep them updated
- Manually add new shows as they're announced

## Next Steps

1. **Immediate**: Check the error logs to understand the Playbill.com error
2. **Short-term**: Investigate what pages actually contain all shows
3. **Medium-term**: Consider if we need to scrape multiple pages per source
4. **Long-term**: Evaluate if we need a headless browser for JavaScript content

## Checking Current Extraction

To see what the AI is actually extracting, you can:

1. Check the sync report in the database (`syncReports` table)
2. Look at the `shows` table to see what's been added
3. Check logs for extraction counts per source
4. Review error messages for clues about what's failing
