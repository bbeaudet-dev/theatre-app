import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Daily sync at 2 AM UTC (adjust time as needed)
// This runs syncAllShows once per day to update show data
crons.daily(
  "sync-all-shows",
  {
    hourUTC: 2, // 2 AM UTC
    minuteUTC: 0,
  },
  internal.functions.sync.dataSync.syncAllShows,
  {}
);

export default crons;

