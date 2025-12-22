import { action, internalAction, internalMutation } from "../../_generated/server";
import { v } from "convex/values";
import { Id } from "../../_generated/dataModel";
import { api, internal } from "../../_generated/api";
import { EXTRACTION_PROMPT, VALIDATION_PROMPT } from "../../lib/ai/extraction";
import { DATA_SOURCES, SYNC_CONFIG } from "../../config/dataSources";

// Helper to call OpenAI API
async function callOpenAI(prompt: string, content: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Use cheaper model for extraction
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: content.substring(0, 100000), // Limit content size
        },
      ],
      temperature: 0.1, // Low temperature for more consistent extraction
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Helper to call Anthropic API (fallback)
async function callAnthropic(prompt: string, content: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022", // Use cheaper model for extraction
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nContent:\n${content.substring(0, 100000)}`,
        },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "";
}

// Call AI API (tries OpenAI first, falls back to Anthropic)
async function callAI(prompt: string, content: string): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await callOpenAI(prompt, content);
    } catch (error) {
      console.error("OpenAI call failed, trying Anthropic:", error);
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return await callAnthropic(prompt, content);
  }

  throw new Error("No AI API key configured (OPENAI_API_KEY or ANTHROPIC_API_KEY)");
}

// Helper function for retrying with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (attempt < maxRetries) {
        const delayMs = baseDelayMs * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms delay`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

/**
 * Fetch HTML content from a data source URL with retry logic
 */
export const fetchSourceContent = internalAction({
  args: {
    sourceUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await retryWithBackoff(async () => {
        const res = await fetch(args.sourceUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
          },
          // Add timeout
          signal: AbortSignal.timeout(SYNC_CONFIG.fetchTimeout),
        });

        if (!res.ok) {
          // Retry on 5xx errors, fail immediately on 4xx
          if (res.status >= 500) {
            throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
          } else if (res.status === 429) {
            // Rate limited - throw to trigger retry with backoff
            throw new Error(`Rate limited: ${res.status} ${res.statusText}`);
          } else {
            // Client errors (4xx) shouldn't be retried
            return { ok: false, status: res.status, statusText: res.statusText };
          }
        }

        return { ok: true, text: await res.text() };
      }, SYNC_CONFIG.fetchRetries, SYNC_CONFIG.fetchRetryDelay);

      if (!response.ok) {
        return {
          html: "",
          success: false,
          error: `HTTP error: ${response.status} ${response.statusText}`,
        };
      }

      return { html: response.text, success: true };
    } catch (error: any) {
      console.error(`Failed to fetch ${args.sourceUrl} after retries:`, error);
      return {
        html: "",
        success: false,
        error: error.message || "Unknown error",
      };
    }
  },
});

/**
 * Extract show data from HTML using AI with retry logic
 */
export const extractShowDataWithAI = action({
  args: {
    htmlContent: v.string(),
    sourceName: v.string(),
    sourceUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Clean HTML - remove scripts, styles, etc. for better AI parsing
      const cleanHtml = args.htmlContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
        .substring(0, 100000); // Limit size

      const prompt = `${EXTRACTION_PROMPT}\n\nSource: ${args.sourceName}\nSource URL: ${args.sourceUrl}`;
      
      // Retry AI extraction on failure
      const aiResponse = await retryWithBackoff(
        () => callAI(prompt, cleanHtml),
        2, // 2 retries for AI calls
        1000 // 1 second base delay
      );

      // Parse JSON response
      let parsed;
      try {
        // Remove markdown code blocks if present
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
        parsed = JSON.parse(jsonString);
      } catch (parseError) {
        // Try parsing as array
        const arrayMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          parsed = JSON.parse(arrayMatch[0]);
        } else {
          throw new Error(`Failed to parse AI response: ${aiResponse}`);
        }
      }

      // Ensure it's an array
      const shows = Array.isArray(parsed) ? parsed : parsed.shows || parsed.data || [parsed];

      console.log(`AI extracted ${shows.length} shows from ${args.sourceName}. First few titles:`, 
        shows.slice(0, 5).map((s: any) => s.title || "No title"));

      // Add source information to each show
      return shows.map((show: any) => ({
        ...show,
        sourceName: args.sourceName,
        sourceUrl: args.sourceUrl,
      }));
    } catch (error: any) {
      console.error(`Error extracting show data from ${args.sourceName}:`, error);
      // Return empty array on failure - don't fail entire sync
      return [];
    }
  },
});

/**
 * Validate show data from multiple sources using AI
 */
export const validateShowDataWithAI = action({
  args: {
    showDataArray: v.array(v.any()), // Array of show data from different sources
  },
  handler: async (ctx, args) => {
    if (args.showDataArray.length === 0) {
      return null;
    }

    if (args.showDataArray.length === 1) {
      return args.showDataArray[0];
    }

    try {
      const prompt = VALIDATION_PROMPT;
      const content = JSON.stringify(args.showDataArray, null, 2);
      
      // Retry validation on failure
      const aiResponse = await retryWithBackoff(
        () => callAI(prompt, content),
        1, // 1 retry for validation
        1000
      );

      // Parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      const validated = JSON.parse(jsonString);

      return validated;
    } catch (error: any) {
      console.error("Error validating show data:", error);
      // Return first entry as fallback
      return args.showDataArray[0];
    }
  },
});

// Helper removed - comparison is done directly in syncAllShows

// Helper to normalize show title for matching
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper to match shows (fuzzy matching)
function matchesShow(show1: any, show2: any): boolean {
  const title1 = normalizeTitle(show1.title || "");
  const title2 = normalizeTitle(show2.title || "");
  
  // Exact title match
  if (title1 === title2) return true;
  
  // Check if one title contains the other (for variations)
  if (title1.includes(title2) || title2.includes(title1)) {
    // Also check theatre if available
    if (show1.theatre && show2.theatre) {
      const theatre1 = (show1.theatre || "").toLowerCase();
      const theatre2 = (show2.theatre || "").toLowerCase();
      return theatre1 === theatre2 || theatre1.includes(theatre2) || theatre2.includes(theatre1);
    }
    return true;
  }
  
  return false;
}

/**
 * Main sync orchestrator - fetches, extracts, validates, and syncs show data
 */
export const syncAllShows = internalAction({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    showsScanned: number;
    newShows: number;
    updatedShows: number;
    deletedShows: number;
    errors: number;
    reportId: Id<"syncReports"> | null;
    duration: number;
    errorDetails?: string[];
    extractionSummary?: {
      sourcesAttempted: string[];
      sourcesProcessed: string[];
      showsPerSource: Array<{ source: string; count: number }>;
    };
  }> => {
    const startTime = Date.now();
    const errors: string[] = [];
    const extractedShowsBySource: Record<string, any[]> = {};
    const allExtractedShows: any[] = [];
    let showsScanned = 0;

    // 1. Fetch content from all enabled sources
    const enabledSources = DATA_SOURCES.filter(s => s.enabled);
    console.log(`\n=== STARTING SYNC ===`);
    console.log(`Enabled sources (${enabledSources.length}): ${enabledSources.map(s => s.name).join(", ")}`);
    console.log(`Total sources configured: ${DATA_SOURCES.length}`);
    
    let enabledIndex = 0; // Track index within enabled sources for logging
    for (let i = 0; i < DATA_SOURCES.length; i++) {
      const source = DATA_SOURCES[i];
      if (!source.enabled) {
        console.log(`[${i + 1}/${DATA_SOURCES.length}] Skipping disabled source: ${source.name} (enabled: ${source.enabled})`);
        continue;
      }

      enabledIndex++;
      console.log(`\n[${enabledIndex}/${enabledSources.length}] Processing source: ${source.name}`);
      console.log(`  URL: ${source.url}`);
      console.log(`  Type: ${source.type}`);
      
      try {
        console.log(`  → Fetching content...`);
        const fetchStartTime = Date.now();
        const fetchResult = await ctx.runAction(internal.functions.sync.dataSync.fetchSourceContent, {
          sourceUrl: source.url,
        });
        const fetchDuration = Date.now() - fetchStartTime;

        if (!fetchResult.success || !fetchResult.html) {
          const errorMsg = `Failed to fetch from ${source.name}: ${fetchResult.error || "Unknown error"}`;
          errors.push(errorMsg);
          console.error(`  ✗ ${errorMsg}`);
          console.log(`  Duration: ${fetchDuration}ms`);
          continue;
        }

        console.log(`  ✓ Fetched ${fetchResult.html.length.toLocaleString()} characters in ${fetchDuration}ms`);

        // 2. Extract show data using AI (action, so use api)
        console.log(`  → Extracting shows with AI...`);
        const extractStartTime = Date.now();
        const extracted = await ctx.runAction(api.functions.sync.dataSync.extractShowDataWithAI, {
          htmlContent: fetchResult.html,
          sourceName: source.name,
          sourceUrl: source.url,
        });
        const extractDuration = Date.now() - extractStartTime;

        console.log(`  ✓ Extracted ${extracted.length} shows in ${extractDuration}ms`);
        if (extracted.length > 0) {
          console.log(`  → Sample shows: ${extracted.slice(0, 3).map((s: any) => s.title || "untitled").join(", ")}`);
        }
        
        extractedShowsBySource[source.name] = extracted;
        allExtractedShows.push(...extracted);
        showsScanned += extracted.length;
      } catch (error: any) {
        const errorMsg = `Error processing ${source.name}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`  ✗ ${errorMsg}`);
        console.error(`  Stack: ${error.stack || "No stack trace"}`);
      }
    }

    console.log(`\n=== EXTRACTION SUMMARY ===`);
    console.log(`Total shows scanned: ${showsScanned.toLocaleString()}`);
    console.log(`Total extracted shows: ${allExtractedShows.length.toLocaleString()}`);
    console.log(`Sources processed: ${Object.keys(extractedShowsBySource).length}/${enabledSources.length}`);
    console.log(`Shows per source:`, Object.entries(extractedShowsBySource).map(([name, shows]) => `  ${name}: ${shows.length}`).join("\n"));
    console.log(`Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log(`Error details:`, errors);
    }

    // 3. Get existing shows from database
    // If we didn't scan any shows, abort early to avoid marking everything as deleted
    if (showsScanned === 0 && allExtractedShows.length === 0) {
      console.error("CRITICAL: No shows were scanned from any source. Aborting sync to prevent data loss.");
      return {
        success: false,
        showsScanned: 0,
        newShows: 0,
        updatedShows: 0,
        deletedShows: 0,
        errors: errors.length,
        reportId: null,
        duration: Date.now() - startTime,
        errorDetails: errors, // Include errors in response so user can see them
        extractionSummary: {
          sourcesAttempted: DATA_SOURCES.filter(s => s.enabled).map(s => s.name),
          sourcesProcessed: Object.keys(extractedShowsBySource),
          showsPerSource: Object.entries(extractedShowsBySource).map(([name, shows]) => ({ source: name, count: shows.length })),
        },
      };
    }

    console.log(`\n=== FETCHING EXISTING SHOWS ===`);
    const existingShowsQueryStart = Date.now();
    const existingShows = await ctx.runQuery(api.functions.calendar.getShows, {});
    console.log(`Found ${existingShows.length.toLocaleString()} existing shows in database (${Date.now() - existingShowsQueryStart}ms)`);

    // 4. Normalize and group shows by title+theatre for matching
    console.log(`\n=== NORMALIZING AND GROUPING SHOWS ===`);
    const showMap = new Map<string, any>();
    const sourceGroups: Record<string, any[]> = {};

    for (const extracted of allExtractedShows) {
      const key = `${normalizeTitle(extracted.title || "")}-${(extracted.theatre || "").toLowerCase()}`;
      if (!sourceGroups[key]) {
        sourceGroups[key] = [];
      }
      sourceGroups[key].push(extracted);
    }

    console.log(`Grouped into ${Object.keys(sourceGroups).length.toLocaleString()} unique show groups`);
    const multiSourceGroups = Object.values(sourceGroups).filter(group => group.length > 1);
    if (multiSourceGroups.length > 0) {
      console.log(`  ${multiSourceGroups.length} shows found in multiple sources (will validate)`);
    }

    // 5. Validate shows from multiple sources
    console.log(`\n=== VALIDATING SHOWS ===`);
    const validatedShows: any[] = [];
    let validationCount = 0;
    for (const [key, sources] of Object.entries(sourceGroups)) {
      try {
        if (sources.length > 1) {
          validationCount++;
          if (validationCount % 10 === 0) {
            console.log(`  Validating... (${validationCount}/${multiSourceGroups.length} multi-source groups)`);
          }
          const validated = await ctx.runAction(api.functions.sync.dataSync.validateShowDataWithAI, {
            showDataArray: sources,
          });
          if (validated) validatedShows.push(validated);
        } else {
          validatedShows.push(sources[0]);
        }
      } catch (error: any) {
        // Use first source if validation fails
        validatedShows.push(sources[0]);
        errors.push(`Validation failed for ${key}: ${error.message}`);
      }
    }
    console.log(`✓ Validated ${validatedShows.length.toLocaleString()} shows`);

    // 6. Compare with existing shows and detect changes
    const newShows: any[] = [];
    const updatedShows: { show: any; existingId: Id<"shows"> }[] = [];
    const matchedExistingIds = new Set<Id<"shows">>();

    console.log(`Comparing ${validatedShows.length} validated shows against ${existingShows.length} existing shows`);

    for (const validated of validatedShows) {
      let matched = false;
      for (const existing of existingShows) {
        if (matchesShow(validated, existing)) {
          // Check if update is needed
          const needsUpdate =
            validated.theatre !== existing.theatre ||
            validated.district !== existing.district ||
            validated.openingDate !== existing.openingDate ||
            validated.closingDate !== existing.closingDate ||
            validated.isOpenRun !== existing.isOpenRun;

          if (needsUpdate) {
            updatedShows.push({ show: validated, existingId: existing._id });
            console.log(`Matched existing show "${validated.title}" - update needed`);
          } else {
            console.log(`Matched existing show "${validated.title}" - no update needed`);
          }
          matchedExistingIds.add(existing._id);
          matched = true;
          break;
        }
      }

      if (!matched) {
        newShows.push(validated);
        console.log(`New show detected: "${validated.title}" at ${validated.theatre || "unknown theatre"}`);
      }
    }

    console.log(`Found ${newShows.length} new shows, ${updatedShows.length} shows to update`);

    // 7. Find deleted shows (existing shows not found in any source)
    // CRITICAL: Only mark shows as deleted if we successfully extracted shows from sources
    const deletedShows = showsScanned > 0 
      ? existingShows.filter((existing: any) => !matchedExistingIds.has(existing._id))
      : []; // Don't mark anything as deleted if we didn't scan any shows

    // 8. Upsert changes to database
    const newShowIds: Id<"shows">[] = [];
    const updatedShowIds: Id<"shows">[] = [];
    const now = Date.now();

    // Insert new shows
    console.log(`\n=== INSERTING NEW SHOWS ===`);
    console.log(`Attempting to insert ${newShows.length.toLocaleString()} new shows`);
    for (let i = 0; i < newShows.length; i++) {
      const show = newShows[i];
      try {
        if (!show.title) {
          errors.push(`Skipping show with missing title: ${JSON.stringify(show)}`);
          console.error(`Skipping show with missing title:`, show);
          continue;
        }

        if ((i + 1) % 10 === 0 || i === 0) {
          console.log(`  Inserting... (${i + 1}/${newShows.length})`);
        }
        
        // Build insert object - all fields except title are optional
        const insertData: any = {
          title: show.title,
          theatre: show.theatre ?? undefined,
          district: show.district ?? undefined,
          openingDate: show.openingDate ? new Date(show.openingDate).getTime() : undefined,
          previewDate: show.previewDate ? new Date(show.previewDate).getTime() : undefined,
          closingDate: show.closingDate ? new Date(show.closingDate).getTime() : undefined,
          isOpenRun: show.isOpenRun ?? undefined,
          isInPreviews: show.isInPreviews ?? undefined,
          description: show.description ?? undefined,
          imageUrl: show.imageUrl ?? undefined,
          sourceId: show.sourceId ?? show.title, // Use title as fallback ID
          sourceUrl: show.sourceUrl ?? undefined,
          syncSource: show.sourceName ?? undefined,
          lastSyncedAt: now,
          confidenceScore: show.confidence ?? undefined,
        };
        
        // Only include showtimes if it's a valid object (null/undefined are handled by omitting the field)
        // The schema accepts showtimes as optional, so omitting it (undefined) is fine
        if (show.showtimes != null && typeof show.showtimes === 'object') {
          insertData.showtimes = show.showtimes;
        }
        
        const showId = await ctx.runMutation(internal.functions.calendar.insertShow, insertData);
        if (showId) newShowIds.push(showId as Id<"shows">);
      } catch (error: any) {
        const errorMsg = `Failed to insert show ${show.title}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`  ✗ [${i + 1}/${newShows.length}] ${errorMsg}`);
      }
    }
    console.log(`✓ Inserted ${newShowIds.length.toLocaleString()}/${newShows.length.toLocaleString()} new shows`);

    // Update existing shows (with error handling - continue on individual failures)
    console.log(`\n=== UPDATING EXISTING SHOWS ===`);
    console.log(`Attempting to update ${updatedShows.length.toLocaleString()} shows`);
    for (let i = 0; i < updatedShows.length; i++) {
      const { show, existingId } = updatedShows[i];
      try {
        if (!existingId) {
          errors.push(`Skipping update for show with missing ID: ${show.title}`);
          continue;
        }

        // Build update object - all fields except showId are optional
        // Convert null to undefined since schema uses v.optional() which expects undefined, not null
        const updateData: any = {
          showId: existingId,
          theatre: show.theatre ?? undefined,
          district: show.district ?? undefined,
          openingDate: show.openingDate ? new Date(show.openingDate).getTime() : undefined,
          previewDate: show.previewDate ? new Date(show.previewDate).getTime() : undefined,
          closingDate: show.closingDate ? new Date(show.closingDate).getTime() : undefined,
          isOpenRun: show.isOpenRun ?? undefined,
          isInPreviews: show.isInPreviews ?? undefined,
          description: show.description ?? undefined,
          imageUrl: show.imageUrl ?? undefined,
          sourceUrl: show.sourceUrl ?? undefined,
          syncSource: show.sourceName ?? undefined,
          lastSyncedAt: now,
          confidenceScore: show.confidence ?? undefined,
        };
        
        // Only include showtimes if it's not null/undefined (must be an object)
        if (show.showtimes != null) {
          updateData.showtimes = show.showtimes;
        }
        
        const showId = await ctx.runMutation(internal.functions.calendar.updateShow, updateData);
        if (showId) updatedShowIds.push(existingId);
      } catch (error: any) {
        const errorMsg = `Failed to update show ${show.title}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`  ✗ [${i + 1}/${updatedShows.length}] ${errorMsg}`);
      }
    }
    console.log(`✓ Updated ${updatedShowIds.length.toLocaleString()}/${updatedShows.length.toLocaleString()} shows`);

    // Mark deleted shows as closed (don't delete, just update)
    console.log(`\n=== MARKING DELETED SHOWS ===`);
    console.log(`Found ${deletedShows.length.toLocaleString()} shows not in any source`);
    const deletedShowIds: Id<"shows">[] = [];
    for (let i = 0; i < deletedShows.length; i++) {
      const deleted = deletedShows[i];
      // Only mark as deleted if it was previously an open run
      if (deleted.isOpenRun) {
        try {
          if ((i + 1) % 10 === 0 || i === 0) {
            console.log(`  Marking as closed... (${i + 1}/${deletedShows.length})`);
          }
          await ctx.runMutation(internal.functions.calendar.updateShow, {
            showId: deleted._id,
            isOpenRun: false,
            closingDate: now, // Mark as closed now
            lastSyncedAt: now,
          });
          deletedShowIds.push(deleted._id);
        } catch (error: any) {
          const errorMsg = `Failed to mark show ${deleted.title} as closed: ${error.message}`;
          errors.push(errorMsg);
          console.error(`  ✗ ${errorMsg}`);
        }
      }
    }
    console.log(`✓ Marked ${deletedShowIds.length.toLocaleString()} shows as closed`);

    // 9. Create sync report
    console.log(`\n=== CREATING SYNC REPORT ===`);
    console.log(`Summary: ${showsScanned.toLocaleString()} scanned, ${newShowIds.length.toLocaleString()} new, ${updatedShowIds.length.toLocaleString()} updated, ${deletedShowIds.length.toLocaleString()} deleted, ${errors.length} errors`);
    const reportId: Id<"syncReports"> | null = await ctx.runMutation(internal.functions.sync.dataSync.createSyncReport, {
      showsScanned,
      newShows: newShowIds,
      updatedShows: updatedShowIds,
      deletedShows: deletedShowIds,
      errors: errors.length > 0 ? errors : undefined,
    });
    console.log(`Sync report created with ID: ${reportId}`);

    // 10. Fetch existing show data for comparison (for updated shows)
    const updatedShowsWithOldData: any[] = [];
    for (const { show, existingId } of updatedShows) {
      try {
        const existingShow = await ctx.runQuery(api.functions.shows.getShow, { showId: existingId });
        if (existingShow) {
          updatedShowsWithOldData.push({
            new: show,
            old: existingShow,
            showId: existingId,
          });
        }
      } catch (error: any) {
        // If we can't fetch old data, just include new data
        updatedShowsWithOldData.push({
          new: show,
          old: null,
          showId: existingId,
        });
      }
    }

    // 11. Send email report (only if report was created successfully)
    if (reportId) {
      console.log(`Sending email report for reportId: ${reportId}`);
      try {
        const emailResult = await ctx.runAction(internal.functions.sync.email.sendSyncReportEmail, {
          reportId,
          showsScanned,
          newShowsCount: newShowIds.length,
          updatedShowsCount: updatedShowIds.length,
          deletedShowsCount: deletedShowIds.length,
          errors: errors.length > 0 ? errors : undefined,
          // Map new shows for email - only include fields that have values (schema uses v.optional())
          newShows: newShows.map((s: any) => {
            const mapped: any = { title: s.title };
            if (s.theatre) mapped.theatre = s.theatre;
            if (s.district) mapped.district = s.district;
            if (s.openingDate) mapped.openingDate = s.openingDate;
            if (s.closingDate) mapped.closingDate = s.closingDate;
            if (s.isOpenRun !== undefined && s.isOpenRun !== null) mapped.isOpenRun = s.isOpenRun;
            if (s.sourceName) mapped.syncSource = s.sourceName;
            if (s.sourceUrl) mapped.sourceUrl = s.sourceUrl;
            if (s.confidence !== undefined && s.confidence !== null) mapped.confidence = s.confidence;
            return mapped;
          }),
          updatedShows: updatedShowsWithOldData,
          deletedShows: deletedShows.map((s: any) => ({
            title: s.title,
            theatre: s.theatre,
            district: s.district,
            syncSource: s.syncSource,
          })),
          sourcesScanned: DATA_SOURCES.filter((s) => s.enabled).map((s) => s.name),
        });
        console.log(`Email sent successfully:`, emailResult);
      } catch (error: any) {
        console.error("Failed to send email report:", error);
        errors.push(`Email report failed: ${error.message}`);
      }
    } else {
      console.error("Cannot send email - reportId is null");
    }

    return {
      success: true,
      showsScanned,
      newShows: newShowIds.length,
      updatedShows: updatedShowIds.length,
      deletedShows: deletedShowIds.length,
      errors: errors.length,
      reportId,
      duration: Date.now() - startTime,
      errorDetails: errors.length > 0 ? errors : undefined,
      extractionSummary: {
        sourcesAttempted: DATA_SOURCES.filter(s => s.enabled).map(s => s.name),
        sourcesProcessed: Object.keys(extractedShowsBySource),
        showsPerSource: Object.entries(extractedShowsBySource).map(([name, shows]) => ({ source: name, count: shows.length })),
      },
    };
  },
});

/**
 * Create a sync report record (internal mutation)
 */
export const createSyncReport = internalMutation({
  args: {
    showsScanned: v.number(),
    newShows: v.array(v.id("shows")),
    updatedShows: v.array(v.id("shows")),
    deletedShows: v.array(v.id("shows")),
    errors: v.optional(v.array(v.string())),
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    const reportId = await ctx.db.insert("syncReports", {
      syncDate: now,
      showsScanned: args.showsScanned,
      newShows: args.newShows,
      updatedShows: args.updatedShows,
      deletedShows: args.deletedShows,
      errors: args.errors,
      createdAt: now,
    });
    return reportId;
  },
});

// Legacy functions (kept for backward compatibility, now deprecated)
export const syncShow = action({
  args: {
    showId: v.optional(v.id("shows")),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ extracted: any } | { message: string }> => {
    if (args.sourceUrl) {
      const fetchResult: { html?: string; success: boolean; error?: string } = await ctx.runAction(internal.functions.sync.dataSync.fetchSourceContent, {
        sourceUrl: args.sourceUrl,
      });
      if (fetchResult.success && fetchResult.html) {
        const extracted: any[] = await ctx.runAction(api.functions.sync.dataSync.extractShowDataWithAI, {
          htmlContent: fetchResult.html,
          sourceName: "manual",
          sourceUrl: args.sourceUrl,
        });
        return { extracted: extracted[0] || null };
      }
    }
    return { message: "Single show sync - provide sourceUrl" };
  },
});

export const detectNewShows = internalAction({
  args: {},
  handler: async (ctx): Promise<{ newShows: number; message: string }> => {
    // This is now part of syncAllShows
    const result = await ctx.runAction(internal.functions.sync.dataSync.syncAllShows, {});
    return {
      newShows: result.newShows,
      message: `Found ${result.newShows} new shows`,
    };
  },
});

export const detectClosings = internalAction({
  args: {},
  handler: async (ctx): Promise<{ deletedShows: number; message: string }> => {
    // This is now part of syncAllShows
    const result = await ctx.runAction(internal.functions.sync.dataSync.syncAllShows, {});
    return {
      deletedShows: result.deletedShows,
      message: `Found ${result.deletedShows} closed shows`,
    };
  },
});

export const updateShowtimes = internalAction({
  args: {},
  handler: async (ctx): Promise<{ updatedShows: number; message: string }> => {
    // This is now part of syncAllShows
    const result = await ctx.runAction(internal.functions.sync.dataSync.syncAllShows, {});
    return {
      updatedShows: result.updatedShows,
      message: `Updated ${result.updatedShows} shows`,
    };
  },
});

/**
 * Manual trigger for testing sync (can be called from client/admin panel)
 * This is a public action for manual testing - consider making it internalMutation in production
 */
export const manualSync = action({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    showsScanned: number;
    newShows: number;
    updatedShows: number;
    deletedShows: number;
    errors: number;
    reportId: Id<"syncReports"> | null;
    duration: number;
    errorDetails?: string[];
    extractionSummary?: any;
  }> => {
    console.log("Manual sync triggered");
    const result = await ctx.runAction(internal.functions.sync.dataSync.syncAllShows, {});
    
    // Print detailed summary to console for terminal visibility
    console.log("\n" + "=".repeat(60));
    console.log("SYNC COMPLETE - SUMMARY");
    console.log("=".repeat(60));
    console.log(`Duration: ${(result.duration / 1000).toFixed(1)}s`);
    console.log(`Shows Scanned: ${result.showsScanned.toLocaleString()}`);
    console.log(`New Shows: ${result.newShows.toLocaleString()}`);
    console.log(`Updated Shows: ${result.updatedShows.toLocaleString()}`);
    console.log(`Deleted Shows: ${result.deletedShows.toLocaleString()}`);
    console.log(`Errors: ${result.errors}`);
    
    if (result.extractionSummary) {
      console.log("\nSources:");
      result.extractionSummary.showsPerSource?.forEach((item: any) => {
        console.log(`  ${item.source}: ${item.count} shows`);
      });
    }
    
    if (result.errorDetails && result.errorDetails.length > 0) {
      console.log(`\nErrors (${result.errorDetails.length}):`);
      result.errorDetails.slice(0, 10).forEach((err: string, idx: number) => {
        console.log(`  ${idx + 1}. ${err.substring(0, 100)}${err.length > 100 ? "..." : ""}`);
      });
      if (result.errorDetails.length > 10) {
        console.log(`  ... and ${result.errorDetails.length - 10} more errors`);
      }
    }
    console.log("=".repeat(60) + "\n");
    
    return result;
  },
});
