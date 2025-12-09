import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get user profile
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // TODO: Fetch user profile
    return null;
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Update user profile
    return null;
  },
});

// Get user's show rankings
export const getUserRankings = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // TODO: Fetch user's ranked shows (theatre cloud data)
    return [];
  },
});

// Add or update a show in user's rankings
export const upsertUserShow = mutation({
  args: {
    userId: v.id("users"),
    showId: v.id("shows"),
    status: v.union(
      v.literal("interested"),
      v.literal("seen"),
      v.literal("planning")
    ),
    rank: v.optional(v.number()),
    timesSeen: v.optional(v.number()),
    notes: v.optional(v.string()),
    review: v.optional(v.string()),
    seenDates: v.optional(v.array(v.number())),
    seenLocations: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // TODO: Implement user show upsert
    // If marking as "seen" and was "interested", remove from interested
    return null;
  },
});

// Update show ranking order
export const updateRanking = mutation({
  args: {
    userId: v.id("users"),
    showId: v.id("shows"),
    newRank: v.number(),
  },
  handler: async (ctx, args) => {
    // TODO: Update ranking order (may need to reorder other shows)
    return null;
  },
});

// Get user preferences
export const getUserPreferences = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // TODO: Fetch user theatre preferences
    return null;
  },
});

// Update user preferences
export const updateUserPreferences = mutation({
  args: {
    userId: v.id("users"),
    danceAppreciation: v.optional(v.number()),
    liveOrchestraAppreciation: v.optional(v.boolean()),
    listensToSoundtracks: v.optional(v.boolean()),
    appreciatesStageElements: v.optional(v.number()),
    appreciatesPropEfficiency: v.optional(v.number()),
    valuesMessageMoral: v.optional(v.number()),
    valuesActorQuality: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: Update user preferences
    return null;
  },
});

