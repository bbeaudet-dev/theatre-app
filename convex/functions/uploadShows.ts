import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

// Data structure for Broadway shows
interface ShowInput {
  title: string;
  theatre: string;
  openingDate: string; // "Month Day, Year" format
  runningTime: string;
  isOpening?: boolean; // true if "Opening" instead of "Opened"
}

// Parse date string like "November 17, 2022" to timestamp
function parseDate(dateStr: string): number {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  return date.getTime();
}

// Upload Broadway shows to the database
export const uploadBroadwayShows = action({
  args: {
    shows: v.array(
      v.object({
        title: v.string(),
        theatre: v.string(),
        openingDate: v.string(),
        runningTime: v.string(),
        isOpening: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = {
      inserted: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const show of args.shows) {
      try {
        const openingTimestamp = parseDate(show.openingDate);
        
        await ctx.runMutation(internal.functions.calendar.upsertShow, {
          title: show.title,
          district: "broadway",
          theatre: show.theatre,
          openingDate: openingTimestamp,
          isOpenRun: true, // All current shows are open runs
          isInPreviews: show.isOpening || false,
          syncSource: "manual-upload",
        });

        // Check if it was an update or insert by checking if show exists
        // (upsertShow handles this internally, so we'll just count successes)
        results.inserted++;
      } catch (error: any) {
        results.errors.push(`${show.title}: ${error.message}`);
      }
    }

    return results;
  },
});

// Pre-defined Off-Broadway shows data
const OFF_BROADWAY_SHOWS_DATA: ShowInput[] = [
  { title: "The Ark", theatre: "The Shed", openingDate: "January 9, 2026", runningTime: "TBD", isOpening: true },
  { title: "The Disappear", theatre: "Audible's Minetta Lane Theatre", openingDate: "January 15, 2026", runningTime: "TBD", isOpening: true },
  { title: "Data", theatre: "Lucille Lortel Theatre", openingDate: "January 25, 2026", runningTime: "TBD", isOpening: true },
  { title: "Ulysses", theatre: "The Public Theater/Martinson Hall", openingDate: "January 25, 2026", runningTime: "TBD", isOpening: true },
  { title: "Blackout Songs", theatre: "The Robert W. Wilson MCC Theater Space/Susan & Ronald Frankel Theater", openingDate: "January 27, 2026", runningTime: "TBD", isOpening: true },
  { title: "High Spirits", theatre: "New York City Center", openingDate: "February 4, 2026", runningTime: "TBD", isOpening: true },
  { title: "The Other Place", theatre: "The Shed", openingDate: "February 5, 2026", runningTime: "TBD", isOpening: true },
  { title: "Making a Show of Myself", theatre: "Irish Repertory Theatre/W. Scott McLucas Studio Theatre", openingDate: "February 8, 2026", runningTime: "TBD", isOpening: true },
  { title: "11 to Midnight", theatre: "Orpheum Theatre", openingDate: "February 11, 2026", runningTime: "TBD", isOpening: true },
  { title: "The Unknown", theatre: "Studio Seaview", openingDate: "February 12, 2026", runningTime: "TBD", isOpening: true },
  { title: "The Tragedy of Coriolanus", theatre: "Theatre for a New Audience/Polonsky Shakespeare Center", openingDate: "February 14, 2026", runningTime: "TBD", isOpening: true },
  { title: "The Dinosaurs", theatre: "Playwrights Horizons/The Judy Theater", openingDate: "February 16, 2026", runningTime: "TBD", isOpening: true },
  { title: "Marcel on the Train", theatre: "Classic Stage Company/Lynn F. Angelson Theater", openingDate: "February 22, 2026", runningTime: "TBD", isOpening: true },
  { title: "You Got Older", theatre: "Cherry Lane Theatre", openingDate: "February 23, 2026", runningTime: "TBD", isOpening: true },
  { title: "Mother Russia", theatre: "The Pershing Square Signature Theatre Center/Romulus Linney Courtyard Theatre", openingDate: "February 24, 2026", runningTime: "TBD", isOpening: true },
  { title: "The Reservoir", theatre: "Atlantic Theater Company/Linda Gross Theater", openingDate: "February 24, 2026", runningTime: "TBD", isOpening: true },
  { title: "Meat Suit, or the Shitshow of Motherhood", theatre: "Second Stage Theater at Pershing Square Center/Irene Diamond Stage", openingDate: "February 25, 2026", runningTime: "TBD", isOpening: true },
  { title: "Chinese Republicans", theatre: "Roundabout Theatre Company/Laura Pels Theatre", openingDate: "February 26, 2026", runningTime: "TBD", isOpening: true },
  { title: "Bigfoot!", theatre: "New York City Center/Stage I", openingDate: "March 1, 2026", runningTime: "TBD", isOpening: true },
  { title: "What We Did Before Our Moth Days", theatre: "Greenwich House Theater", openingDate: "March 5, 2026", runningTime: "TBD", isOpening: true },
  { title: "Cold War Choir Practice", theatre: "MCC Theater/Newman Mills Theater", openingDate: "March 10, 2026", runningTime: "TBD", isOpening: true },
  { title: "Antigone (This Play I Read in High School)", theatre: "The Public Theater/Anspacher Theater", openingDate: "March 11, 2026", runningTime: "TBD", isOpening: true },
  { title: "Bughouse", theatre: "Vineyard Theatre", openingDate: "March 11, 2026", runningTime: "TBD", isOpening: true },
  { title: "Ulster American", theatre: "Irish Repertory Theatre/Francis J. Greenburger Mainstage", openingDate: "March 15, 2026", runningTime: "TBD", isOpening: true },
  { title: "My Joy is Heavy", theatre: "New York Theatre Workshop", openingDate: "March 17, 2026", runningTime: "TBD", isOpening: true },
  { title: "The Wild Party", theatre: "New York City Center", openingDate: "March 18, 2026", runningTime: "TBD", isOpening: true },
  { title: "Monte Cristo", theatre: "The York Theatre/Theatre at St. Jean's", openingDate: "March 19, 2026", runningTime: "TBD", isOpening: true },
  { title: "Jesa", theatre: "Ma-Yi Theatre Company at The Public Theater/Shiva Theater", openingDate: "March 20, 2026", runningTime: "TBD", isOpening: true },
  { title: "Public Charge", theatre: "The Public Theater/Newman Theater", openingDate: "March 25, 2026", runningTime: "TBD", isOpening: true },
  { title: "Titus Andronicus", theatre: "Red Bull Theater at The Pershing Square Signature Center/Alice Griffin Jewel Box Theatre", openingDate: "March 29, 2026", runningTime: "TBD", isOpening: true },
  { title: "Seagull: True Story", theatre: "The Public Theater/LuEsther Hall", openingDate: "March 30, 2026", runningTime: "TBD", isOpening: true },
  { title: "Girl, Interrupted", theatre: "The Public Theater/Martinson Hall", openingDate: "June 4, 2026", runningTime: "TBD", isOpening: true },
  { title: "Tartuffe", theatre: "New York Theatre Workshop", openingDate: "December 16, 2025", runningTime: "1 hour and 50 minutes, no intermission" },
  { title: "Anna Christie", theatre: "St. Ann's Warehouse", openingDate: "December 11, 2025", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "A Christmas Carol", theatre: "Perelman Performing Arts Center", openingDate: "November 23, 2025", runningTime: "2 hours, including intermission" },
  { title: "Kyoto", theatre: "Mitzi E. Newhouse Theatre", openingDate: "November 3, 2025", runningTime: "2 hours and 45 minutes, including intermission" },
  { title: "Masquerade", theatre: "218 W. 57th St", openingDate: "September 29, 2025", runningTime: "2 hours, no intermission" },
  { title: "House of McQueen", theatre: "The Mansion at Hudson Yards", openingDate: "September 9, 2025", runningTime: "2 hours, including intermission" },
  { title: "Heathers: The Musical", theatre: "New World Stages - Stage I", openingDate: "June 30, 2025", runningTime: "2 hours and 30 minutes, including intermission" },
];

// Pre-defined Broadway shows data
const BROADWAY_SHOWS_DATA: ShowInput[] = [
  { title: "& Juliet", theatre: "Stephen Sondheim Theatre", openingDate: "November 17, 2022", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Aladdin", theatre: "New Amsterdam Theatre", openingDate: "March 20, 2014", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "All Out: Comedy About Ambition", theatre: "Nederlander Theatre", openingDate: "December 12, 2025", runningTime: "1 hour and 25 minutes minutes, no intermission" },
  { title: "Beetlejuice", theatre: "Palace Theatre", openingDate: "October 8, 2025", runningTime: "2 hours and 30 minutes, including intermission", isOpening: true },
  { title: "The Book of Mormon", theatre: "Eugene O'Neill Theatre", openingDate: "March 24, 2011", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Buena Vista Social Club", theatre: "Gerald Schoenfeld Theatre", openingDate: "March 19, 2025", runningTime: "2 hours and 10 minutes, including intermission" },
  { title: "Bug", theatre: "Samuel J. Friedman Theatre", openingDate: "January 8, 2025", runningTime: "1 hour and 55 minutes, including intermission", isOpening: true },
  { title: "Chess", theatre: "Imperial Theatre", openingDate: "November 16, 2025", runningTime: "2 hours and 40 minutes, including intermission" },
  { title: "Chicago", theatre: "Ambassador Theatre", openingDate: "November 14, 1996", runningTime: "2 hours and 30 minutes minutes, including intermission" },
  { title: "Death Becomes Her", theatre: "Lunt-Fontanne Theatre", openingDate: "November 21, 2024", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "The Great Gatsby", theatre: "Broadway Theatre", openingDate: "April 25, 2024", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Hadestown", theatre: "Walter Kerr Theatre", openingDate: "April 17, 2019", runningTime: "2 hours and 25 minutes, including intermission" },
  { title: "Hamilton", theatre: "Richard Rodgers Theatre", openingDate: "August 6, 2015", runningTime: "2 hours and 55 minutes, including intermission" },
  { title: "Harry Potter and the Cursed Child", theatre: "Lyric Theatre", openingDate: "December 7, 2021", runningTime: "2 hours and 50 minutes, including intermission" },
  { title: "Hell's Kitchen", theatre: "Shubert Theatre", openingDate: "April 20, 2024", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Just in Time", theatre: "Circle in the Square", openingDate: "April 26, 2025", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Liberation", theatre: "James Earl Jones Theatre", openingDate: "October 28, 2025", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "The Lion King", theatre: "Minskoff Theatre", openingDate: "November 13, 1997", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Maybe Happy Ending", theatre: "Belasco Theatre", openingDate: "November 12, 2024", runningTime: "1 hour and 40 minutes, no intermission" },
  { title: "Mamma Mia!", theatre: "Winter Garden Theatre", openingDate: "August 14, 2025", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Marjorie Prime", theatre: "Helen Hayes Theater", openingDate: "December 8, 2025", runningTime: "1 hour and 30 minutes, no intermission" },
  { title: "MJ", theatre: "Neil Simon Theatre", openingDate: "February 1, 2022", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Moulin Rouge!", theatre: "Al Hirschfeld Theatre", openingDate: "July 25, 2019", runningTime: "2 hours and 45 minutes, including intermission" },
  { title: "Oedipus", theatre: "Studio 54", openingDate: "November 13, 2025", runningTime: "2 hours, no intermission" },
  { title: "Oh, Mary!", theatre: "Lyceum Theatre", openingDate: "July 11, 2024", runningTime: "1 hour and 20 minutes, no intermission" },
  { title: "Operation Mincemeat", theatre: "John Golden Theatre", openingDate: "March 20, 2025", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "The Outsiders", theatre: "Bernard B. Jacobs Theatre", openingDate: "April 11, 2024", runningTime: "2 hours and 25 minutes, including intermission" },
  { title: "Ragtime", theatre: "Vivian Beaumont Theatre", openingDate: "October 16, 2025", runningTime: "2 hours and 45 minutes, including intermission" },
  { title: "Six", theatre: "Lena Horne Theatre", openingDate: "October 3, 2021", runningTime: "1 hour and 20 minutes minutes, no intermission" },
  { title: "Stranger Things: The First Shadow", theatre: "Marquis Theatre", openingDate: "April 22, 2025", runningTime: "2 hours and 45 minutes, including intermission" },
  { title: "Two Strangers (Carry a Cake Across New York)", theatre: "Longacre Theatre", openingDate: "November 20, 2025", runningTime: "2 hours and 15 minutes, including intermission" },
  { title: "Waiting for Godot", theatre: "Hudson Theatre", openingDate: "September 28, 2025", runningTime: "2 hours and 15 minutes, including intermission" },
  { title: "Wicked", theatre: "Gershwin Theatre", openingDate: "October 30, 2003", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "The Queen of Versailles", theatre: "St. James Theatre", openingDate: "November 9, 2025", runningTime: "2 hours and 30 minutes, including intermission" },
  { title: "Little Bear Ridge Road", theatre: "Booth Theatre", openingDate: "October 30, 2025", runningTime: "95 minutes, no intermission" },
  { title: "Art", theatre: "Music Box Theatre", openingDate: "September 16, 2025", runningTime: "1 hour and 40 minutes, no intermission" },
];

// Convenience action to upload all pre-defined Broadway shows
export const uploadAllBroadwayShows = action({
  args: {},
  handler: async (ctx) => {
    const results = {
      inserted: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const show of BROADWAY_SHOWS_DATA) {
      try {
        const openingTimestamp = parseDate(show.openingDate);
        
        await ctx.runMutation(internal.functions.calendar.upsertShow, {
          title: show.title,
          district: "broadway",
          theatre: show.theatre,
          openingDate: openingTimestamp,
          isOpenRun: true, // All current shows are open runs
          isInPreviews: show.isOpening || false,
          syncSource: "manual-upload",
        });

        results.inserted++;
      } catch (error: any) {
        results.errors.push(`${show.title}: ${error.message}`);
      }
    }

    return results;
  },
});

// Convenience action to upload all pre-defined Off-Broadway shows
export const uploadAllOffBroadwayShows = action({
  args: {},
  handler: async (ctx) => {
    const results = {
      inserted: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const show of OFF_BROADWAY_SHOWS_DATA) {
      try {
        const openingTimestamp = parseDate(show.openingDate);
        
        await ctx.runMutation(internal.functions.calendar.upsertShow, {
          title: show.title,
          district: "off-broadway",
          theatre: show.theatre,
          openingDate: openingTimestamp,
          isOpenRun: true, // All upcoming shows are open runs
          isInPreviews: show.isOpening || false,
          syncSource: "manual-upload",
        });

        results.inserted++;
      } catch (error: any) {
        results.errors.push(`${show.title}: ${error.message}`);
      }
    }

    return results;
  },
});

// Convenience action to upload all shows (Broadway + Off-Broadway)
export const uploadAllShows = action({
  args: {},
  handler: async (ctx) => {
    const broadwayResults = {
      inserted: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const show of BROADWAY_SHOWS_DATA) {
      try {
        const openingTimestamp = parseDate(show.openingDate);
        await ctx.runMutation(internal.functions.calendar.upsertShow, {
          title: show.title,
          district: "broadway",
          theatre: show.theatre,
          openingDate: openingTimestamp,
          isOpenRun: true,
          isInPreviews: show.isOpening || false,
          syncSource: "manual-upload",
        });
        broadwayResults.inserted++;
      } catch (error: any) {
        broadwayResults.errors.push(`${show.title}: ${error.message}`);
      }
    }

    const offBroadwayResults = {
      inserted: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const show of OFF_BROADWAY_SHOWS_DATA) {
      try {
        const openingTimestamp = parseDate(show.openingDate);
        await ctx.runMutation(internal.functions.calendar.upsertShow, {
          title: show.title,
          district: "off-broadway",
          theatre: show.theatre,
          openingDate: openingTimestamp,
          isOpenRun: true,
          isInPreviews: show.isOpening || false,
          syncSource: "manual-upload",
        });
        offBroadwayResults.inserted++;
      } catch (error: any) {
        offBroadwayResults.errors.push(`${show.title}: ${error.message}`);
      }
    }

    return {
      broadway: broadwayResults,
      offBroadway: offBroadwayResults,
      total: {
        inserted: broadwayResults.inserted + offBroadwayResults.inserted,
        updated: broadwayResults.updated + offBroadwayResults.updated,
        errors: [...broadwayResults.errors, ...offBroadwayResults.errors],
      },
    };
  },
});

