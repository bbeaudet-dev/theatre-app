import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Query to inspect a sync report and see all errors
 * Usage: npx convex run functions/inspectSyncReport:getSyncReport --args '{"reportId": "mh75w2b35cxfxrpc71fpfhet5s7xqgjz"}'
 */
export const getSyncReport = query({
  args: {
    reportId: v.id("syncReports"),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    return report;
  },
});

/**
 * Get the most recent sync report
 */
export const getLatestSyncReport = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db
      .query("syncReports")
      .withIndex("by_syncDate")
      .order("desc")
      .take(1);
    
    return reports[0] || null;
  },
});

