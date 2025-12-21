import { query, mutation, internalMutation } from "../_generated/server";
import { v } from "convex/values";

// Get all shows for calendar view
export const getShows = query({
  args: {
    district: v.optional(
      v.union(
        v.literal("broadway"),
        v.literal("off-broadway"),
        v.literal("touring"),
        v.literal("local")
      )
    ),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let shows = await ctx.db.query("shows").collect();

    // Apply district filter
    if (args.district) {
      shows = shows.filter((show) => show.district === args.district);
    }

    // Apply location filter (if location field exists)
    if (args.location) {
      shows = shows.filter(
        (show) =>
          show.location?.toLowerCase().includes(args.location!.toLowerCase()) ||
          show.theatre?.toLowerCase().includes(args.location!.toLowerCase())
      );
    }

    // Sort by title
    shows.sort((a, b) => a.title.localeCompare(b.title));

    return shows;
  },
});

// Add or update a show
export const upsertShow = internalMutation({
  args: {
    title: v.string(),
    district: v.optional(
      v.union(
        v.literal("broadway"),
        v.literal("off-broadway"),
        v.literal("touring"),
        v.literal("local")
      )
    ),
    location: v.optional(v.string()),
    venue: v.optional(v.string()),
    theatre: v.optional(v.string()),
    openingDate: v.optional(v.number()),
    previewDate: v.optional(v.number()),
    closingDate: v.optional(v.number()),
    isOpenRun: v.boolean(),
    isInPreviews: v.optional(v.boolean()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    showtimes: v.optional(
      v.object({
        monday: v.union(v.string(), v.null()),
        tuesday: v.union(v.string(), v.null()),
        wednesday: v.union(v.string(), v.null()),
        thursday: v.union(v.string(), v.null()),
        friday: v.union(v.string(), v.null()),
        saturday: v.union(v.string(), v.null()),
        sunday: v.union(v.string(), v.null()),
      })
    ),
    sourceId: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    syncSource: v.optional(v.string()),
    lastSyncedAt: v.optional(v.number()),
    confidenceScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Try to find existing show by title + theatre (or sourceId if available)
    let existingShow = null;
    if (args.sourceId) {
      const shows = await ctx.db.query("shows").collect();
      existingShow = shows.find((s) => s.sourceId === args.sourceId);
    }
    
    // If not found by sourceId, try title + theatre
    if (!existingShow && args.title && args.theatre) {
      const shows = await ctx.db.query("shows").collect();
      existingShow = shows.find(
        (s) => s.title.toLowerCase() === args.title.toLowerCase() && s.theatre?.toLowerCase() === args.theatre.toLowerCase()
      );
    }
    
    if (existingShow) {
      // Update existing show
      await ctx.db.patch(existingShow._id, {
        ...args,
        updatedAt: now,
      });
      return existingShow._id;
    } else {
      // Create new show
      const showId = await ctx.db.insert("shows", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
      return showId;
    }
  },
});

// Update an existing show
export const updateShow = internalMutation({
  args: {
    showId: v.id("shows"),
    title: v.optional(v.string()),
    district: v.optional(
      v.union(
        v.literal("broadway"),
        v.literal("off-broadway"),
        v.literal("touring"),
        v.literal("local")
      )
    ),
    location: v.optional(v.string()),
    venue: v.optional(v.string()),
    theatre: v.optional(v.string()),
    openingDate: v.optional(v.number()),
    previewDate: v.optional(v.number()),
    closingDate: v.optional(v.number()),
    isOpenRun: v.optional(v.boolean()),
    isInPreviews: v.optional(v.boolean()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    showtimes: v.optional(
      v.object({
        monday: v.union(v.string(), v.null()),
        tuesday: v.union(v.string(), v.null()),
        wednesday: v.union(v.string(), v.null()),
        thursday: v.union(v.string(), v.null()),
        friday: v.union(v.string(), v.null()),
        saturday: v.union(v.string(), v.null()),
        sunday: v.union(v.string(), v.null()),
      })
    ),
    sourceId: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    syncSource: v.optional(v.string()),
    lastSyncedAt: v.optional(v.number()),
    confidenceScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { showId, ...updates } = args;
    const show = await ctx.db.get(showId);
    if (!show) {
      throw new Error("Show not found");
    }
    
    await ctx.db.patch(showId, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return showId;
  },
});

// Export calendar to Google Calendar format
export const exportToGoogleCalendar = query({
  args: {
    showIds: v.array(v.id("shows")),
  },
  handler: async (ctx, args) => {
    // TODO: Implement Google Calendar export
    return null;
  },
});

