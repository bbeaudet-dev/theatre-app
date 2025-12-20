import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Get first user (for development - will be replaced with auth)
export const getFirstUser = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").first();
    return users?._id;
  },
});

// Get user profile
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
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
    const { userId, ...updates } = args;
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// Get user's show rankings
export const getUserRankings = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userShows = await ctx.db
      .query("userShows")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", args.userId).eq("status", "seen")
      )
      .collect();

    // Get show details for each userShow
    const rankings = await Promise.all(
      userShows
        .filter((us) => us.rank !== undefined)
        .map(async (userShow) => {
          const show = await ctx.db.get(userShow.showId);
          return {
            ...userShow,
            show,
          };
        })
    );

    // Sort by rank (1 = best)
    rankings.sort((a, b) => (a.rank || 0) - (b.rank || 0));

    return rankings;
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
      v.literal("planning"),
      v.literal("want-to-see"),
      v.literal("interested-in"),
      v.literal("look-into"),
      v.literal("not-interested")
    ),
    rank: v.optional(v.number()),
    timesSeen: v.optional(v.number()),
    notes: v.optional(v.string()),
    review: v.optional(v.string()),
    seenDates: v.optional(v.array(v.number())),
    seenLocations: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId, showId, ...data } = args;
    const now = Date.now();

    // Check if userShow already exists
    const existing = await ctx.db
      .query("userShows")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("showId"), showId))
      .first();

    if (existing) {
      // If marking as "seen" and was "interested" or similar, we keep the record but update status
      // The old status is replaced, so no need to delete
      await ctx.db.patch(existing._id, {
        ...data,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new userShow
      const userShowId = await ctx.db.insert("userShows", {
        userId,
        showId,
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      return userShowId;
    }
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
    // Get the userShow to update
    const userShow = await ctx.db
      .query("userShows")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("showId"), args.showId))
      .first();

    if (!userShow || userShow.rank === undefined) {
      throw new Error("User show not found or not ranked");
    }

    const oldRank = userShow.rank;

    // Get all ranked shows for this user
    const allRanked = await ctx.db
      .query("userShows")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", args.userId).eq("status", "seen")
      )
      .filter((q) => q.neq(q.field("rank"), undefined))
      .collect();

    // Update the moved show
    await ctx.db.patch(userShow._id, {
      rank: args.newRank,
      updatedAt: Date.now(),
    });

    // Reorder other shows if necessary
    if (oldRank < args.newRank) {
      // Moving down: shift shows between oldRank and newRank up by 1
      for (const ranked of allRanked) {
        if (
          ranked._id !== userShow._id &&
          ranked.rank !== undefined &&
          ranked.rank > oldRank &&
          ranked.rank <= args.newRank
        ) {
          await ctx.db.patch(ranked._id, {
            rank: ranked.rank - 1,
            updatedAt: Date.now(),
          });
        }
      }
    } else if (oldRank > args.newRank) {
      // Moving up: shift shows between newRank and oldRank down by 1
      for (const ranked of allRanked) {
        if (
          ranked._id !== userShow._id &&
          ranked.rank !== undefined &&
          ranked.rank >= args.newRank &&
          ranked.rank < oldRank
        ) {
          await ctx.db.patch(ranked._id, {
            rank: ranked.rank + 1,
            updatedAt: Date.now(),
          });
        }
      }
    }

    return { success: true };
  },
});

// Delete a userShow (remove from rankings)
export const deleteUserShow = mutation({
  args: {
    userId: v.id("users"),
    showId: v.id("shows"),
  },
  handler: async (ctx, args) => {
    let userShow = await ctx.db
      .query("userShows")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("showId"), args.showId))
      .first();

    // If not found, try searching all userShows
    if (!userShow) {
      const allUserShows = await ctx.db
        .query("userShows")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
      const found = allUserShows.find((us) => us.showId === args.showId);
      if (found) {
        userShow = found;
      }
    }

    if (!userShow) {
      throw new Error("User show not found");
    }

    const oldRank = userShow.rank;

    // Delete the userShow
    await ctx.db.delete(userShow._id);

    // Shift other rankings up if it was ranked
    if (oldRank !== undefined && oldRank !== null) {
      const allRanked = await ctx.db
        .query("userShows")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", args.userId).eq("status", "seen")
        )
        .collect();

      for (const ranked of allRanked) {
        if (ranked.rank !== undefined && ranked.rank !== null && ranked.rank > oldRank) {
          await ctx.db.patch(ranked._id, {
            rank: ranked.rank - 1,
            updatedAt: Date.now(),
          });
        }
      }
    }

    return { success: true };
  },
});

// Get user preferences
export const getUserPreferences = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    return preferences;
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
    const { userId, ...updates } = args;
    const now = Date.now();

    // Check if preferences exist
    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...updates,
        updatedAt: now,
      });
      return existing._id;
    } else {
      const prefId = await ctx.db.insert("userPreferences", {
        userId,
        ...updates,
        createdAt: now,
        updatedAt: now,
      });
      return prefId;
    }
  },
});

// Get all lists for a user
export const getUserLists = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const lists = await ctx.db
      .query("userLists")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return lists;
  },
});

// Create a new list
export const createList = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const listId = await ctx.db.insert("userLists", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      showIds: [],
      createdAt: now,
      updatedAt: now,
    });
    return listId;
  },
});

// Update list metadata or shows
export const updateList = mutation({
  args: {
    listId: v.id("userLists"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    showIds: v.optional(v.array(v.id("shows"))),
  },
  handler: async (ctx, args) => {
    const { listId, ...updates } = args;
    const list = await ctx.db.get(listId);
    if (!list) {
      throw new Error("List not found");
    }

    await ctx.db.patch(listId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return listId;
  },
});

// Delete a list
export const deleteList = mutation({
  args: {
    listId: v.id("userLists"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.listId);
    return { success: true };
  },
});

// Add a show to a list
export const addShowToList = mutation({
  args: {
    listId: v.id("userLists"),
    showId: v.id("shows"),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    // Check if show is already in the list
    if (list.showIds.includes(args.showId)) {
      return list._id; // Already in list
    }

    await ctx.db.patch(args.listId, {
      showIds: [...list.showIds, args.showId],
      updatedAt: Date.now(),
    });

    return args.listId;
  },
});

// Remove a show from a list
export const removeShowFromList = mutation({
  args: {
    listId: v.id("userLists"),
    showId: v.id("shows"),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    await ctx.db.patch(args.listId, {
      showIds: list.showIds.filter((id) => id !== args.showId),
      updatedAt: Date.now(),
    });

    return args.listId;
  },
});

// Get all visits for a userShow
export const getUserShowVisits = query({
  args: {
    userShowId: v.id("userShows"),
  },
  handler: async (ctx, args) => {
    const visits = await ctx.db
      .query("userShowVisits")
      .withIndex("by_user_show", (q) => q.eq("userShowId", args.userShowId))
      .collect();

    // Sort by date (oldest first)
    visits.sort((a, b) => a.visitDate - b.visitDate);

    return visits;
  },
});

// Add a visit to a userShow
export const addUserShowVisit = mutation({
  args: {
    userId: v.id("users"),
    userShowId: v.id("userShows"),
    showId: v.id("shows"),
    visitDate: v.number(),
    theatre: v.string(),
    district: v.union(
      v.literal("Broadway"),
      v.literal("Playhouse Square"),
      v.literal("West End"),
      v.literal("Off-Broadway"),
      v.literal("Local"),
      v.literal("Touring"),
      v.literal("Other")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all visits to determine chronological order
    const allVisits = await ctx.db
      .query("userShowVisits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const chronologicalOrder = allVisits.length;

    const visitId = await ctx.db.insert("userShowVisits", {
      userId: args.userId,
      userShowId: args.userShowId,
      showId: args.showId,
      visitDate: args.visitDate,
      theatre: args.theatre,
      district: args.district,
      notes: args.notes,
      chronologicalOrder,
      createdAt: Date.now(),
    });

    return visitId;
  },
});

// Update a visit
export const updateUserShowVisit = mutation({
  args: {
    visitId: v.id("userShowVisits"),
    visitDate: v.optional(v.number()),
    theatre: v.optional(v.string()),
    district: v.optional(
      v.union(
        v.literal("Broadway"),
        v.literal("Playhouse Square"),
        v.literal("West End"),
        v.literal("Off-Broadway"),
        v.literal("Local"),
        v.literal("Touring"),
        v.literal("Other")
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { visitId, ...updates } = args;
    const visit = await ctx.db.get(visitId);
    if (!visit) {
      throw new Error("Visit not found");
    }

    await ctx.db.patch(visitId, updates);

    return visitId;
  },
});

// Delete a visit
export const deleteUserShowVisit = mutation({
  args: {
    visitId: v.id("userShowVisits"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.visitId);
    return { success: true };
  },
});

