import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get show schedules for planning
export const getShowSchedules = query({
  args: {
    showIds: v.optional(v.array(v.id("shows"))),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: Implement schedule fetching
    return [];
  },
});

// Get ticket options for a show
export const getTicketOptions = query({
  args: {
    showId: v.id("shows"),
  },
  handler: async (ctx, args) => {
    // TODO: Fetch ticket options (rush, lottery, student, etc.)
    return null;
  },
});

// Create a trip plan
export const createTripPlan = mutation({
  args: {
    userId: v.id("users"),
    startDate: v.number(),
    endDate: v.number(),
    showSelections: v.array(
      v.object({
        showId: v.id("shows"),
        date: v.number(),
        time: v.string(),
        ticketType: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // TODO: Implement trip plan creation
    return null;
  },
});

// Get closing alerts for user's interested shows
export const getClosingAlerts = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // TODO: Get shows on user's interested list that are closing soon
    return [];
  },
});

