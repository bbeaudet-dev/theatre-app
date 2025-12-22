import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    passwordHash: v.string(), // Hashed password
    phone: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  // Sessions for authentication
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(), // Unix timestamp
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  // Shows metadata
  shows: defineTable({
    title: v.string(),
    location: v.optional(v.string()), 
    venue: v.optional(v.string()),
    theatre: v.optional(v.string()),
    district: v.optional(
      v.union(
        v.literal("broadway"),
        v.literal("off-broadway"),
        v.literal("touring"),
        v.literal("local")
      )
    ),
    showtimes: v.optional(
      v.object({
        monday: v.union(v.array(v.string()), v.null()),
        tuesday: v.union(v.array(v.string()), v.null()),
        wednesday: v.union(v.array(v.string()), v.null()),
        thursday: v.union(v.array(v.string()), v.null()),
        friday: v.union(v.array(v.string()), v.null()),
        saturday: v.union(v.array(v.string()), v.null()),
        sunday: v.union(v.array(v.string()), v.null()),
      })
    ),
    openingDate: v.optional(v.number()), // Unix timestamp
    previewDate: v.optional(v.number()),
    closingDate: v.optional(v.number()), // null for open runs
    isOpenRun: v.optional(v.boolean()), 
    isInPreviews: v.optional(v.boolean()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    playbillImageId: v.optional(v.id("_storage")), // Convex file storage
    // Data sync tracking fields
    sourceId: v.optional(v.string()), // External API/page identifier
    sourceUrl: v.optional(v.string()), // URL where data was fetched from
    lastSyncedAt: v.optional(v.number()), // Timestamp of last sync
    syncSource: v.optional(v.string()), // Which source provided this data (e.g., "playbill", "broadway.com")
    confidenceScore: v.optional(v.number()), // AI confidence (0-1) for extracted data
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // User-show relationships (seen, interested, rankings)
  userShows: defineTable({
    userId: v.id("users"),
    showId: v.id("shows"),
    status: v.union(
      v.literal("seen"),
      v.literal("watchlist"),
      v.literal("considering"),
      v.literal("not-interested")
    ),
    rank: v.optional(v.number()), // For ranking seen shows (1 = best)
    notes: v.optional(v.string()),
    review: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_show", ["showId"])
    .index("by_user_status", ["userId", "status"]),

  // Individual show visits (multiple viewings of the same show)
  userShowVisits: defineTable({
    userId: v.id("users"),
    userShowId: v.id("userShows"), // Reference to the userShow relationship
    showId: v.id("shows"), // Denormalized for easier queries
    visitDate: v.number(), // Unix timestamp
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
    notes: v.optional(v.string()), // Optional notes about the visit (cast, special circumstances, etc.)
    chronologicalOrder: v.optional(v.number()), // Overall chronological order across all shows
    createdAt: v.number(),
  })
    .index("by_user_show", ["userShowId"])
    .index("by_user", ["userId"])
    .index("by_show", ["showId"]),

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
    // Force-ranked theatre elements
    rankedElements: v.optional(
      v.array(
        v.object({
          element: v.string(),
          rank: v.number(),
        })
      )
    ),
    // Force-ranked themes
    rankedThemes: v.optional(
      v.array(
        v.object({
          theme: v.string(),
          rank: v.number(),
        })
      )
    ),
    // Additional preferences
    avgTicketPrice: v.optional(v.number()),
    audiencePreference: v.optional(v.string()), // "any", "adults", "family", "kids"
    seatingPreference: v.optional(v.string()), // "close", "orchestra", "mezzanine", "balcony", "any"
    emotionalResponses: v.optional(v.any()), // Record<string, "neutral" | "positive" | "negative">
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

  // User lists (custom lists like "Want to See", "Interested In", etc.)
  userLists: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    showIds: v.array(v.id("shows")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Trips
  trips: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(), // Unix timestamp
    startTime: v.optional(v.string()), // "HH:MM" format
    endDate: v.number(), // Unix timestamp
    endTime: v.optional(v.string()), // "HH:MM" format
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Trip days
  tripDays: defineTable({
    tripId: v.id("trips"),
    date: v.number(), // Unix timestamp (start of day)
    createdAt: v.number(),
  })
    .index("by_trip", ["tripId"]),

  // Trip day slots
  tripDaySlots: defineTable({
    tripDayId: v.id("tripDays"),
    tripId: v.id("trips"), // Denormalized for easier queries
    type: v.union(
      v.literal("show"),
      v.literal("meal"),
      v.literal("transport"),
      v.literal("flight"),
      v.literal("custom")
    ),
    title: v.string(),
    startTime: v.string(), // "HH:MM" format
    endTime: v.optional(v.string()), // "HH:MM" format
    showId: v.optional(v.id("shows")), // Primary show for show-type slots
    backupShowIds: v.optional(v.array(v.id("shows"))), // Backup shows
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_trip_day", ["tripDayId"])
    .index("by_trip", ["tripId"]),

  // Sync reports for tracking data sync operations
  syncReports: defineTable({
    syncDate: v.number(),
    showsScanned: v.number(),
    newShows: v.array(v.id("shows")),
    updatedShows: v.array(v.id("shows")),
    deletedShows: v.array(v.id("shows")),
    errors: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_syncDate", ["syncDate"]),
});

