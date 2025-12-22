import { mutation } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Public mutation to update a show's imageUrl
 * Used by the playbill image fetcher
 */
export const updateShowImageUrl = mutation({
  args: {
    showId: v.id("shows"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const show = await ctx.db.get(args.showId);
    if (!show) {
      throw new Error("Show not found");
    }

    await ctx.db.patch(args.showId, {
      imageUrl: args.imageUrl,
    });

    return { success: true };
  },
});

