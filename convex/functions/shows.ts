import { query } from "../_generated/server";
import { v } from "convex/values";

// Get all shows with optional filters
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
    isOpenRun: v.optional(v.boolean()),
    isInPreviews: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let shows = await ctx.db.query("shows").collect();

    // Apply filters
    if (args.district) {
      shows = shows.filter((show) => show.district === args.district);
    }

    if (args.isOpenRun !== undefined) {
      shows = shows.filter((show) => show.isOpenRun === args.isOpenRun);
    }

    if (args.isInPreviews !== undefined) {
      shows = shows.filter((show) => show.isInPreviews === args.isInPreviews);
    }

    // Sort by title
    shows.sort((a, b) => a.title.localeCompare(b.title));

    // Apply limit if provided
    if (args.limit) {
      shows = shows.slice(0, args.limit);
    }

    return shows;
  },
});

// Get a single show by ID
export const getShow = query({
  args: {
    showId: v.id("shows"),
  },
  handler: async (ctx, args) => {
    const show = await ctx.db.get(args.showId);
    return show;
  },
});

// Search shows by title or description
export const searchShows = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase();
    let shows = await ctx.db.query("shows").collect();

    // Filter shows that match the search term
    shows = shows.filter((show) => {
      const titleMatch = show.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = show.description
        ?.toLowerCase()
        .includes(searchTerm);
      const theatreMatch = show.theatre?.toLowerCase().includes(searchTerm);
      return titleMatch || descriptionMatch || theatreMatch;
    });

    // Sort by relevance (title matches first)
    shows.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return a.title.localeCompare(b.title);
    });

    // Apply limit if provided
    if (args.limit) {
      shows = shows.slice(0, args.limit);
    }

    return shows;
  },
});

// Get shows by district
export const getShowsByDistrict = query({
  args: {
    district: v.union(
      v.literal("broadway"),
      v.literal("off-broadway"),
      v.literal("touring"),
      v.literal("local")
    ),
  },
  handler: async (ctx, args) => {
    const shows = await ctx.db.query("shows").collect();
    return shows
      .filter((show) => show.district === args.district)
      .sort((a, b) => a.title.localeCompare(b.title));
  },
});

// Get shows active in a date range
export const getShowsByDateRange = query({
  args: {
    startDate: v.number(), // Unix timestamp
    endDate: v.number(), // Unix timestamp
  },
  handler: async (ctx, args) => {
    const shows = await ctx.db.query("shows").collect();
    const now = Date.now();

    return shows.filter((show) => {
      // Check if show is active during the date range
      const showStart = show.previewDate || show.openingDate || 0;
      const showEnd = show.closingDate || (show.isOpenRun ? Infinity : 0);

      // Show is active if:
      // 1. It starts before or during the range AND
      // 2. It ends after or during the range (or is an open run)
      const startsBeforeRangeEnd = showStart <= args.endDate;
      const endsAfterRangeStart =
        showEnd === Infinity || showEnd >= args.startDate;

      return startsBeforeRangeEnd && endsAfterRangeStart;
    });
  },
});

