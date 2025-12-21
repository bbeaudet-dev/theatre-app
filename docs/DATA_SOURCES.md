# Data Sources Configuration

## Current Sources

### Playbill.com (Primary Source)

Playbill.com is our primary source - it's well-structured and provides clean, comprehensive listings.

**Current/Active Shows:**

- `playbill-broadway`: https://playbill.com/shows/broadway
  - Lists all current Broadway shows
  - No pagination, renders all shows on one page
  - Includes theatre, status, preview/opening dates
- `playbill-offbroadway`: https://playbill.com/shows/offbroadway
  - Lists all current Off-Broadway shows
  - Similar structure to Broadway page

**Upcoming Shows:**

- `playbill-upcoming-broadway`: https://playbill.com/article/schedule-of-upcoming-and-announced-broadway-shows
  - Article format with upcoming show announcements
  - Includes preview and opening dates

**Additional Resources (Not Yet Integrated):**

- Weekly Schedule: https://playbill.com/article/weekly-schedule-of-current-broadway-shows
  - Could be used for showtimes data
- News Section: https://playbill.com/news
  - For future news scanning feature
- Upcoming Off-Broadway: https://playbill.com/article/schedule-of-upcoming-off-broadway-shows-2
  - Similar to upcoming Broadway
- Vault: https://playbill.com/vault
  - Historical shows database
  - Perfect for rankings feature (allows users to add shows they've seen)
  - Could be enabled later for historical data

### Broadway.com (Secondary Source)

Used for validation and cross-referencing.

**Current Shows:**

- `broadway-com-all`: https://www.broadway.com/shows/tickets/
  - All shows (Broadway + Off-Broadway)
- `broadway-com-broadway`: https://www.broadway.com/shows/tickets/?category=broadway
  - Broadway shows only
- `broadway-com-offbroadway`: https://www.broadway.com/shows/tickets/?category=off-broadway
  - Off-Broadway shows only

**Additional Resources (Not Yet Integrated):**

- Classics: https://www.broadway.com/shows/tickets/?category=classics
  - Historical shows (similar to Playbill Vault)
  - Could be enabled for rankings feature
- Show Guides: https://www.broadway.com/broadway-guide/
  - Articles and guides about shows
  - Home: https://www.broadway.com/broadway-guide/broadway-show-guides/

## Source Configuration

Sources are configured in `convex/functions/dataSync.ts` in the `DATA_SOURCES` array.

Each source has:

- `name`: Unique identifier
- `url`: The URL to fetch from
- `enabled`: Whether this source is currently active
- `type`: "current", "upcoming", or "historical" (optional, for organization)

## Enabling/Disabling Sources

To disable a source (e.g., if it's causing errors):

```typescript
{ name: "playbill-broadway", url: "...", enabled: false, type: "current" }
```

To add a new source:

```typescript
{
  name: "playbill-upcoming-offbroadway",
  url: "https://playbill.com/article/schedule-of-upcoming-off-broadway-shows-2",
  enabled: true,
  type: "upcoming",
}
```

## Future Enhancements

### For Trip Planner (Current/Upcoming Only)

- Focus on current and upcoming sources
- Weekly schedule integration for showtimes
- Real-time availability updates

### For Rankings Feature (Historical Data)

- Enable Playbill Vault source
- Enable Broadway.com Classics
- Allow users to search and add any show they've seen, even if it's closed
- Historical data doesn't need to sync regularly, could be a one-time import or on-demand search

### For News Features

- Integrate Playbill News section
- Scan for show announcements, closings, cast changes
- Link articles to relevant shows in database
