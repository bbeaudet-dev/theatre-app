// AI prompt templates for extracting show data from HTML

export const EXTRACTION_PROMPT = `Extract ALL Broadway, Off-Broadway, touring, and local theatre show information from the following HTML content. 

IMPORTANT: Extract EVERY show you can find in the content. Do not limit yourself - look through the entire HTML carefully for all show listings, even if they're in different sections or formats.

Return a JSON array of show objects, where each object has these fields:
- title (string, required) - The show title
- theatre (string, optional) - The theatre name
- district (string, optional, one of: "broadway", "off-broadway", "touring", "local") - The show district
- openingDate (string, optional, format: YYYY-MM-DD or null) - Official opening date
- previewDate (string, optional, format: YYYY-MM-DD or null) - Preview date
- closingDate (string, optional, format: YYYY-MM-DD or null, null if open run) - Closing date
- isOpenRun (boolean, optional) - Whether the show is an open run
- isInPreviews (boolean, optional) - Whether the show is currently in previews
- description (string, optional) - Brief synopsis or description
- imageUrl (string, optional) - URL to show poster/image
- showtimes (object, optional) - Weekly schedule with days as keys. Each day can be:
  - A string with times in "HH:MM" format, comma-separated for multiple times (e.g., "14:00,20:00")
  - null if the show doesn't perform on that day
  - Keys: "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  - Example: { "monday": "19:00", "tuesday": "19:00", "friday": "14:00,20:00", "sunday": null }

For each field, include a confidence score (0-1) indicating how confident you are in the extraction.
If a field cannot be determined from the content, use null and set confidence to 0.

Return ONLY valid JSON, no markdown formatting or code blocks.

Remember: Extract ALL shows found in the content, not just the first few. Look for:
- Show listings in tables or lists
- Show cards or tiles
- Any repeated patterns that indicate show information
- Shows in different sections (current, upcoming, recently closed, etc.)

Example response format:
[
  {
    "title": "Hamilton",
    "theatre": "Richard Rodgers Theatre",
    "district": "broadway",
    "openingDate": "2015-08-06",
    "closingDate": null,
    "isOpenRun": true,
    "isInPreviews": false,
    "description": "The revolutionary musical about Alexander Hamilton",
    "confidence": 0.95
  }
]`;

export const VALIDATION_PROMPT = `Compare these show data entries from different sources. They should represent the same show (same title and similar theatre/district).

Return a single consolidated show object with the most accurate data, and include:
1. A "confidence" field (0-1) indicating overall confidence
2. A "conflicts" array listing any fields where sources disagreed
3. A "sources" array listing which source(s) provided each field

If the shows are clearly different (different titles), return null.

Example response:
{
  "title": "Hamilton",
  "theatre": "Richard Rodgers Theatre",
  "district": "broadway",
  "openingDate": "2015-08-06",
  "closingDate": null,
  "isOpenRun": true,
  "confidence": 0.92,
  "conflicts": [],
  "sources": {
    "title": ["source1", "source2"],
    "theatre": ["source1"]
  }
}`;

