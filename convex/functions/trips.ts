import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Create a new trip with initial days
export const createTrip = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    startTime: v.optional(v.string()),
    endDate: v.number(),
    endTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Create the trip
    const tripId = await ctx.db.insert("trips", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      startDate: args.startDate,
      startTime: args.startTime,
      endDate: args.endDate,
      endTime: args.endTime,
      createdAt: now,
      updatedAt: now,
    });

    // Generate days for the trip
    const start = new Date(args.startDate);
    const end = new Date(args.endDate);
    const days: string[] = [];
    
    // Get all dates between start and end (inclusive)
    const currentDate = new Date(start);
    currentDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate).getTime().toString());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create trip days
    const tripDayIds = [];
    for (const dayTimestamp of days) {
      const dayId = await ctx.db.insert("tripDays", {
        tripId,
        date: parseInt(dayTimestamp),
        createdAt: now,
      });
      tripDayIds.push(dayId);
    }

    // Create default slots for each day
    for (let i = 0; i < tripDayIds.length; i++) {
      const dayId = tripDayIds[i];
      const isFirstDay = i === 0;
      const isLastDay = i === tripDayIds.length - 1;

      // Flight on first day (morning)
      if (isFirstDay) {
        await ctx.db.insert("tripDaySlots", {
          tripDayId: dayId,
          tripId,
          type: "flight",
          title: "Flight In",
          startTime: "07:00",
          endTime: "9:00",
          createdAt: now,
        });
      }

      // Matinee slot
      await ctx.db.insert("tripDaySlots", {
        tripDayId: dayId,
        tripId,
        type: "show",
        title: "Matinee",
        startTime: "14:00",
        endTime: "16:30",
        createdAt: now,
      });

      // Evening slot
      await ctx.db.insert("tripDaySlots", {
        tripDayId: dayId,
        tripId,
        type: "show",
        title: "Evening",
        startTime: "19:00",
        endTime: "21:30",
        createdAt: now,
      });

      // Flight on last day (evening)
      if (isLastDay) {
        await ctx.db.insert("tripDaySlots", {
          tripDayId: dayId,
          tripId,
          type: "flight",
          title: "Flight Out",
          startTime: "20:00",
          endTime: "22:00",
          createdAt: now,
        });
      }
    }

    return tripId;
  },
});

// Get all trips for a user
export const getUserTrips = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const trips = await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return trips;
  },
});

// Get a single trip with all days and slots
export const getTrip = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async (ctx, args) => {
    const trip = await ctx.db.get(args.tripId);
    if (!trip) {
      return null;
    }

    // Get all days for this trip
    const days = await ctx.db
      .query("tripDays")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .collect();

    // Get all slots for each day
    const daysWithSlots = await Promise.all(
      days.map(async (day) => {
        const slots = await ctx.db
          .query("tripDaySlots")
          .withIndex("by_trip_day", (q) => q.eq("tripDayId", day._id))
          .collect();

        // Sort slots by startTime
        slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

        return {
          ...day,
          slots,
        };
      })
    );

    // Sort days by date
    daysWithSlots.sort((a, b) => a.date - b.date);

    return {
      ...trip,
      days: daysWithSlots,
    };
  },
});

// Update trip metadata
export const updateTrip = mutation({
  args: {
    tripId: v.id("trips"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    startTime: v.optional(v.string()),
    endDate: v.optional(v.number()),
    endTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { tripId, ...updates } = args;
    const trip = await ctx.db.get(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }

    await ctx.db.patch(tripId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return tripId;
  },
});

// Delete a trip (and all associated days and slots)
export const deleteTrip = mutation({
  args: {
    tripId: v.id("trips"),
  },
  handler: async (ctx, args) => {
    // Get all days for this trip
    const days = await ctx.db
      .query("tripDays")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .collect();

    // Delete all slots for each day
    for (const day of days) {
      const slots = await ctx.db
        .query("tripDaySlots")
        .withIndex("by_trip_day", (q) => q.eq("tripDayId", day._id))
        .collect();

      for (const slot of slots) {
        await ctx.db.delete(slot._id);
      }

      // Delete the day
      await ctx.db.delete(day._id);
    }

    // Delete the trip
    await ctx.db.delete(args.tripId);

    return { success: true };
  },
});

// Add a day to an existing trip
export const addTripDay = mutation({
  args: {
    tripId: v.id("trips"),
    date: v.number(), // Unix timestamp
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const dayId = await ctx.db.insert("tripDays", {
      tripId: args.tripId,
      date: args.date,
      createdAt: now,
    });

    // Create default slots for the new day
    await ctx.db.insert("tripDaySlots", {
      tripDayId: dayId,
      tripId: args.tripId,
      type: "show",
      title: "Matinee",
      startTime: "14:00",
      endTime: "16:30",
      createdAt: now,
    });

    await ctx.db.insert("tripDaySlots", {
      tripDayId: dayId,
      tripId: args.tripId,
      type: "show",
      title: "Evening",
      startTime: "19:00",
      endTime: "21:30",
      createdAt: now,
    });

    return dayId;
  },
});

// Add a slot to a trip day
export const addTripSlot = mutation({
  args: {
    tripDayId: v.id("tripDays"),
    tripId: v.id("trips"),
    type: v.union(
      v.literal("show"),
      v.literal("meal"),
      v.literal("transport"),
      v.literal("flight"),
      v.literal("custom")
    ),
    title: v.string(),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    showId: v.optional(v.id("shows")),
    backupShowIds: v.optional(v.array(v.id("shows"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { tripDayId, tripId, ...slotData } = args;
    
    const slotId = await ctx.db.insert("tripDaySlots", {
      tripDayId,
      tripId,
      ...slotData,
      createdAt: Date.now(),
    });

    return slotId;
  },
});

// Update a trip slot
export const updateTripSlot = mutation({
  args: {
    slotId: v.id("tripDaySlots"),
    type: v.optional(
      v.union(
        v.literal("show"),
        v.literal("meal"),
        v.literal("transport"),
        v.literal("flight"),
        v.literal("custom")
      )
    ),
    title: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    showId: v.optional(v.id("shows")),
    backupShowIds: v.optional(v.array(v.id("shows"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { slotId, ...updates } = args;
    const slot = await ctx.db.get(slotId);
    if (!slot) {
      throw new Error("Slot not found");
    }

    await ctx.db.patch(slotId, updates);

    return slotId;
  },
});

// Delete a trip slot
export const deleteTripSlot = mutation({
  args: {
    slotId: v.id("tripDaySlots"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.slotId);
    return { success: true };
  },
});

// Reorder slots within a day (by updating their startTime or using an order field)
// For now, we'll use startTime as the ordering mechanism
export const reorderTripSlots = mutation({
  args: {
    slotIds: v.array(v.id("tripDaySlots")),
    newStartTimes: v.array(v.string()), // Array of start times in new order
  },
  handler: async (ctx, args) => {
    if (args.slotIds.length !== args.newStartTimes.length) {
      throw new Error("Slot IDs and start times arrays must have the same length");
    }

    for (let i = 0; i < args.slotIds.length; i++) {
      const slot = await ctx.db.get(args.slotIds[i]);
      if (slot) {
        await ctx.db.patch(args.slotIds[i], {
          startTime: args.newStartTimes[i],
        });
      }
    }

    return { success: true };
  },
});

