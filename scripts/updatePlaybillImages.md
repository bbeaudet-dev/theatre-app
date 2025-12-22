# Playbill Image Updater

## Overview

Scripts to automatically fetch and update playbill images for shows in the database.

## Functions Available

### 1. `searchPlaybillImage`

Searches for a playbill image for a given show title.

**Usage:**

```typescript
const imageUrl = await ctx.runAction(
  "functions.shows.getPlaybillImage:searchPlaybillImage",
  {
    showTitle: "Hamilton",
  }
);
```

**Returns:** `string | null` - The image URL if found, null otherwise

### 2. `updateShowPlaybillImage`

Searches for and updates a show's imageUrl with the found playbill image.

**Usage:**

```typescript
const result = await ctx.runAction(
  "functions.shows.getPlaybillImage:updateShowPlaybillImage",
  {
    showId: showId,
    showTitle: "Hamilton",
  }
);
```

**Returns:** `{ success: boolean, imageUrl?: string, message?: string }`

## Setup

### Option 1: Google Custom Search API (Recommended)

You need **two separate values**:

1. **GOOGLE_API_KEY** (General Google Cloud API Key):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Custom Search API"
   - Go to APIs & Services → Credentials
   - Create credentials → API Key
   - This is your general authentication key for Google APIs

2. **GOOGLE_CSE_ID** (Custom Search Engine ID - NOT an API key):
   - Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/controlpanel/create)
   - Create a new search engine that searches the entire web
   - Enable "Image search" in the settings
   - After creating, you'll see your Search Engine ID (also called "cx" parameter)
   - This is a unique ID that identifies your specific search engine configuration

Add both to Convex environment variables:

- `GOOGLE_API_KEY` - Your Google Cloud API key (from step 1)
- `GOOGLE_CSE_ID` - Your Custom Search Engine ID (from step 2, NOT an API key)

### Option 2: DuckDuckGo (Fallback)

No setup required, but less reliable. The function will automatically fall back to DuckDuckGo if Google API is not configured.

## Batch Update Script

To update all shows without images, you can create a script in the Convex dashboard:

```typescript
// Run in Convex dashboard or via action
import { api } from "./_generated/api";

// Get all shows
const shows = await ctx.runQuery("functions.shows.getShows", {});

// Update shows without images
for (const show of shows) {
  if (!show.imageUrl) {
    try {
      const result = await ctx.runAction(
        "functions.shows.getPlaybillImage:updateShowPlaybillImage",
        {
          showId: show._id,
          showTitle: show.title,
        }
      );
      console.log(`${show.title}: ${result.success ? "Updated" : "Failed"}`);

      // Rate limiting - wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error updating ${show.title}:`, error);
    }
  }
}
```

## Notes

- The search prioritizes playbill.com images when available
- Google Custom Search API has rate limits (100 queries per day on free tier)
- DuckDuckGo fallback may be less reliable but has no rate limits
- Images are fetched as URLs - you may want to download and store them in Convex file storage for better reliability
