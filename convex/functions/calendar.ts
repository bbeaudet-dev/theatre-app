import { query, mutation } from "../_generated/server";
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
    // TODO: Implement show fetching with filters
    return [];
  },
});

// Add or update a show
export const upsertShow = mutation({
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
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Implement show upsert logic
    return null;
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

