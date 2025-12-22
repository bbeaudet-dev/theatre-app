import { action } from "../../_generated/server";
import { v } from "convex/values";
import { api } from "../../_generated/api";

/**
 * Helper function to search for playbill image (extracted for reuse)
 * Tries Google Custom Search API first, then falls back to DuckDuckGo
 */
async function searchForPlaybillImage(searchQuery: string): Promise<string | null> {
  console.log(`Searching for playbill image: "${searchQuery}"`);

  // Try Google Custom Search API first (if configured)
  const apiKey = process.env.GOOGLE_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;

  if (apiKey && cseId) {
    try {
      const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=5`;
      
      const response = await fetch(googleUrl);

      if (response.ok) {
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          // Prefer playbill.com images
          const playbillImage = data.items.find((item: any) => 
            item.link && item.link.includes('playbill.com')
          );
          
          if (playbillImage) {
            console.log(`Found playbill.com image via Google: ${playbillImage.link}`);
            return playbillImage.link;
          }
          
          // Fallback to first result
          console.log(`Found image via Google: ${data.items[0].link}`);
          return data.items[0].link;
        }
      } else {
        const errorText = await response.text();
        console.warn(`Google Custom Search failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.warn(`Google Custom Search failed, trying fallback: ${error}`);
    }
  } else {
    console.log("Google API key or CSE ID not configured, using DuckDuckGo fallback");
  }

  // Fallback: Try DuckDuckGo
  try {
    const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&iax=images&ia=images`;
    
    const response = await fetch(ddgUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.ok) {
      const html = await response.text();
      
      // Look for playbill.com images first
      const playbillImageRegex = /https?:\/\/[^"'\s<>]*playbill\.com[^"'\s<>]*\.(jpg|jpeg|png|webp|gif)/gi;
      const playbillMatches = html.match(playbillImageRegex);
      
      if (playbillMatches && playbillMatches.length > 0) {
        const imageUrl = playbillMatches[0].replace(/[<>"']/g, '');
        console.log(`Found playbill.com image via DuckDuckGo: ${imageUrl}`);
        return imageUrl;
      }

      // Fallback: look for any image URL
      const imageUrlRegex = /https?:\/\/[^"'\s<>]*\.(jpg|jpeg|png|webp|gif)/gi;
      const allMatches = html.match(imageUrlRegex);
      
      if (allMatches && allMatches.length > 0) {
        const playbillLike = allMatches.find((url: string) => {
          const cleanUrl = url.replace(/[<>"']/g, '');
          return cleanUrl.includes('playbill') || 
                 cleanUrl.includes('broadway') ||
                 cleanUrl.includes('theatre') ||
                 cleanUrl.includes('theater') ||
                 cleanUrl.includes('musical');
        });
        
        if (playbillLike) {
          const cleanUrl = playbillLike.replace(/[<>"']/g, '');
          console.log(`Found playbill-like image: ${cleanUrl}`);
          return cleanUrl;
        }
        
        const firstUrl = allMatches[0].replace(/[<>"']/g, '');
        console.log(`Found image (not from playbill.com): ${firstUrl}`);
        return firstUrl;
      }
    }

    console.log("No images found in search results");
    return null;

  } catch (error) {
    console.error(`Error searching for playbill image: ${error}`);
    return null;
  }
}

/**
 * Search for a playbill image for a given show title
 * Tries Google Custom Search API first (if configured), then falls back to DuckDuckGo
 * Returns the first image URL found, preferring playbill.com images
 */
export const searchPlaybillImage = action({
  args: {
    showTitle: v.string(),
  },
  handler: async (ctx, args): Promise<string | null> => {
    const searchQuery = `${args.showTitle} playbill`;
    return await searchForPlaybillImage(searchQuery);
  },
});

/**
 * Alternative: Use Google Custom Search API (requires API key and CSE ID)
 * Set GOOGLE_API_KEY and GOOGLE_CSE_ID environment variables to use this
 */
export const searchPlaybillImageGoogle = action({
  args: {
    showTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;

    if (!apiKey || !cseId) {
      throw new Error("GOOGLE_API_KEY and GOOGLE_CSE_ID must be set in environment variables");
    }

    const searchQuery = `${args.showTitle} playbill`;
    console.log(`Searching Google Images for: "${searchQuery}"`);

    try {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1`;
      
      const response = await fetch(searchUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Custom Search failed: ${response.status} - ${errorText}`);
        throw new Error(`Google Custom Search failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const imageUrl = data.items[0].link;
        console.log(`Found image via Google: ${imageUrl}`);
        return imageUrl;
      }

      console.log("No images found in Google search results");
      return null;

    } catch (error) {
      console.error(`Error searching Google for playbill image: ${error}`);
      throw error;
    }
  },
});


/**
 * Update a show's imageUrl with a playbill image
 */
export const updateShowPlaybillImage = action({
  args: {
    showId: v.id("shows"),
    showTitle: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; imageUrl?: string; message?: string }> => {
    // Search for the image
    const searchQuery = `${args.showTitle} playbill`;
    const imageUrl = await searchForPlaybillImage(searchQuery);

    if (!imageUrl) {
      return { success: false, message: "No playbill image found" };
    }

    // Update the show in the database
    await ctx.runMutation(api.functions.shows.updateShowImage.updateShowImageUrl, {
      showId: args.showId,
      imageUrl: imageUrl,
    });

    return { success: true, imageUrl };
  },
});

