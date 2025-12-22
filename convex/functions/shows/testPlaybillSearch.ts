import { action } from "../../_generated/server";
import { v } from "convex/values";
import { api } from "../../_generated/api";

/**
 * Test function to verify playbill image search is working
 * Call this from the Convex dashboard or via an action to test
 */
export const testPlaybillSearch = action({
  args: {
    showTitle: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`Testing playbill search for: "${args.showTitle}"`);
    
    try {
      const imageUrl = await ctx.runAction(
        api.functions.shows.getPlaybillImage.searchPlaybillImage,
        {
          showTitle: args.showTitle,
        }
      );

      if (imageUrl) {
        console.log(`✅ Success! Found image: ${imageUrl}`);
        return {
          success: true,
          imageUrl,
          message: "Image found successfully",
        };
      } else {
        console.log(`❌ No image found for "${args.showTitle}"`);
        return {
          success: false,
          message: "No image found",
        };
      }
    } catch (error) {
      console.error(`❌ Error searching for image: ${error}`);
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
});

