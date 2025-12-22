import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { Doc } from "../../_generated/dataModel";

type Show = Doc<"shows">;

export const batchUpdateAllPlaybillImages = action({
  args: {},
  handler: async (ctx): Promise<{
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ title: string; error: string }>;
  }> => {
    const shows: Show[] = await ctx.runQuery(api.functions.shows.getShows, {});

    console.log(`Found ${shows.length} total shows`);

    const showsWithoutImages: Show[] = shows.filter((show: Show) => !show.imageUrl);
    console.log(`Found ${showsWithoutImages.length} shows without images`);

    const results: {
      total: number;
      successful: number;
      failed: number;
      errors: Array<{ title: string; error: string }>;
    } = {
      total: showsWithoutImages.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    // Process each show with rate limiting
    for (let i = 0; i < showsWithoutImages.length; i++) {
      const show = showsWithoutImages[i];
      console.log(`Processing ${i + 1}/${showsWithoutImages.length}: ${show.title}`);

      try {
        const result = await ctx.runAction(
          api.functions.shows.getPlaybillImage.updateShowPlaybillImage,
          {
            showId: show._id,
            showTitle: show.title,
          }
        );

        if (result.success) {
          results.successful++;
          console.log(`✅ Successfully updated ${show.title}`);
        } else {
          results.failed++;
          results.errors.push({ title: show.title, error: result.message || "Unknown error" });
          console.log(`❌ Failed to update ${show.title}: ${result.message}`);
        }

        // Rate limiting - wait 1 second between requests to avoid hitting API limits
        // Google Custom Search API has 100 queries per day on free tier
        if (i < showsWithoutImages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push({ title: show.title, error: errorMessage });
        console.error(`❌ Error updating ${show.title}: ${errorMessage}`);
      }
    }

    console.log(`Batch update complete: ${results.successful} successful, ${results.failed} failed`);
    return results;
  },
});

