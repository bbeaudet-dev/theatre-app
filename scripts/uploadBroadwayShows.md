# Upload Shows to Production Database

This script uploads Broadway and Off-Broadway shows to the production Convex database.

## Available Actions

1. **`uploadAllBroadwayShows`** - Uploads 33 current Broadway shows
2. **`uploadAllOffBroadwayShows`** - Uploads 31 upcoming Off-Broadway shows
3. **`uploadAllShows`** - Uploads both Broadway and Off-Broadway shows (recommended)

## Usage

### Option 1: Via Convex Dashboard (Recommended)

1. Deploy your code to production:

   ```bash
   npm run convex:deploy
   ```

2. Go to your production Convex dashboard
3. Navigate to Functions → Choose one of:
   - `functions/uploadShows:uploadAllShows` (uploads everything - recommended)
   - `functions/uploadShows:uploadAllBroadwayShows` (Broadway only)
   - `functions/uploadShows:uploadAllOffBroadwayShows` (Off-Broadway only)
4. Click "Run" (no arguments needed)
5. The action will upload shows and return results showing how many were inserted/updated and any errors

### Option 2: Via CLI

```bash
# Upload all shows (recommended)
npx convex run functions/uploadShows:uploadAllShows --prod

# Or upload separately
npx convex run functions/uploadShows:uploadAllBroadwayShows --prod
npx convex run functions/uploadShows:uploadAllOffBroadwayShows --prod
```

## What it does

- Uses `upsertShow` which will:
  - Update existing shows if they match by title + theatre
  - Insert new shows if they don't exist
- Sets all shows as:
  - District: "broadway" or "off-broadway"
  - isOpenRun: true
  - isInPreviews: true/false based on whether opening date is in the future
- Marks source as "manual-upload"

## Shows included

**Broadway (33 shows):**

- & Juliet, Aladdin, Hamilton, Wicked, The Lion King, and 28 more...

**Off-Broadway (31 shows):**

- The Ark, The Disappear, Data, Ulysses, Blackout Songs, High Spirits, and 25 more...

## Adding more shows

To add more shows in the future, edit `convex/functions/uploadShows.ts` and add entries to the appropriate array (`BROADWAY_SHOWS_DATA` or `OFF_BROADWAY_SHOWS_DATA`), then run the action again.
