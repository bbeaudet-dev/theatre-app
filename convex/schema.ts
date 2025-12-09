import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Shows metadata (Broadway, Off-Broadway, touring, local)
  shows: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("broadway"),
      v.literal("off-broadway"),
      v.literal("touring"),
      v.literal("local")
    ),
    location: v.optional(v.string()), // For touring/local shows
    venue: v.optional(v.string()),
    openingDate: v.optional(v.number()), // Unix timestamp
    previewDate: v.optional(v.number()),
    closingDate: v.optional(v.number()), // null for open runs
    isOpenRun: v.boolean(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    playbillImageId: v.optional(v.id("_storage")), // Convex file storage
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // User-show relationships (seen, interested, rankings)
  userShows: defineTable({
    userId: v.id("users"),
    showId: v.id("shows"),
    status: v.union(
      v.literal("interested"),
      v.literal("seen"),
      v.literal("planning")
    ),
    rank: v.optional(v.number()), // For ranking seen shows (1 = best)
    timesSeen: v.optional(v.number()),
    notes: v.optional(v.string()),
    review: v.optional(v.string()),
    seenDates: v.optional(v.array(v.number())), // Array of timestamps
    seenLocations: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_show", ["showId"])
    .index("by_user_status", ["userId", "status"]),

  // Notification preferences and history
  notifications: defineTable({
    userId: v.id("users"),
    showId: v.optional(v.id("shows")), // null for general announcements
    notificationType: v.union(
      v.literal("opening"),
      v.literal("closing"),
      v.literal("preview"),
      v.literal("cast_change"),
      v.literal("news"),
      v.literal("review"),
      v.literal("new_show")
    ),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    sentVia: v.optional(v.array(v.union(v.literal("email"), v.literal("sms")))),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "read"]),

  // User notification preferences
  notificationPreferences: defineTable({
    userId: v.id("users"),
    showId: v.optional(v.id("shows")), // null for global preferences
    emailEnabled: v.boolean(),
    smsEnabled: v.boolean(),
    notifyOnOpening: v.boolean(),
    notifyOnClosing: v.boolean(),
    notifyOnPreview: v.boolean(),
    notifyOnCastChange: v.boolean(),
    notifyOnNews: v.boolean(),
    notifyOnReview: v.boolean(),
    notifyOnNewShow: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_show", ["userId", "showId"]),

  // User general theatre preferences (profile questions)
  userPreferences: defineTable({
    userId: v.id("users"),
    // General preferences
    danceAppreciation: v.optional(v.number()), // 1-5 scale
    liveOrchestraAppreciation: v.optional(v.boolean()),
    listensToSoundtracks: v.optional(v.boolean()),
    appreciatesStageElements: v.optional(v.number()), // 1-5 scale
    appreciatesPropEfficiency: v.optional(v.number()), // 1-5 scale
    valuesMessageMoral: v.optional(v.number()), // 1-5 scale
    valuesActorQuality: v.optional(v.number()), // 1-5 scale
    // Additional preferences can be added as needed
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Show schedules for Plan feature
  showSchedules: defineTable({
    showId: v.id("shows"),
    dayOfWeek: v.number(), // 0-6 (Sunday-Saturday)
    time: v.string(), // "14:00" format
    ticketOptions: v.optional(
      v.object({
        rush: v.optional(v.boolean()),
        lottery: v.optional(v.boolean()),
        student: v.optional(v.boolean()),
        standingRoom: v.optional(v.boolean()),
        other: v.optional(v.array(v.string())),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_show", ["showId"])
    .index("by_show_day", ["showId", "dayOfWeek"]),
});

