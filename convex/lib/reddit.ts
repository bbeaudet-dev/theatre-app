/**
 * Search Reddit for posts about a show
 * Uses Reddit's public JSON API (no auth required)
 */
export async function searchRedditForShow(showTitle: string): Promise<{
  posts: Array<{
    title: string;
    score: number;
    url: string;
    subreddit: string;
    selftext?: string;
    permalink: string;
    created_utc: number;
  }>;
}> {
  try {
    // Search Reddit for the show title
    // Using Reddit's JSON API - try simpler searches first, then more specific ones
    const searchTerms = [
      showTitle, // Basic title search
      `${showTitle} musical`,
      `${showTitle} broadway`,
      `site:reddit.com/r/broadway ${showTitle}`,
      `site:reddit.com/r/musicals ${showTitle}`,
    ];
    
    // Also try direct subreddit searches
    const subreddits = ["broadway", "musicals", "Theatre"];

    const allPosts: Array<{
      title: string;
      score: number;
      url: string;
      subreddit: string;
      selftext?: string;
      permalink: string;
      created_utc: number;
    }> = [];

    // Search multiple terms and combine results
    for (const term of searchTerms) {
      try {
        const encodedTerm = encodeURIComponent(term);
        const url = `https://www.reddit.com/search.json?q=${encodedTerm}&sort=relevance&limit=10&type=link&t=all`;
        
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!response.ok) {
          console.warn(`Reddit search failed for "${term}": ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.data && data.data.children) {
          const posts = data.data.children
            .map((child: any) => child.data)
            .filter((post: any) => {
              // Filter out low-quality posts (removed/deleted, but allow low scores)
              return (
                !post.removed_by_category &&
                post.selftext !== "[removed]" &&
                post.selftext !== "[deleted]" &&
                post.title &&
                post.title.toLowerCase().includes(showTitle.toLowerCase())
              );
            })
            .map((post: any) => ({
              title: post.title,
              score: post.score || 0,
              url: post.url,
              subreddit: post.subreddit,
              selftext: post.selftext?.substring(0, 500), // Limit text length
              permalink: `https://reddit.com${post.permalink}`,
              created_utc: post.created_utc,
            }));

          allPosts.push(...posts);
        }
      } catch (error) {
        console.error(`Error searching Reddit for "${term}":`, error);
        continue;
      }
    }
    
    // Also try searching specific subreddits directly
    for (const subreddit of subreddits) {
      try {
        const encodedTerm = encodeURIComponent(showTitle);
        const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodedTerm}&restrict_sr=1&sort=relevance&limit=5&t=all`;
        
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        
        if (data.data && data.data.children) {
          const posts = data.data.children
            .map((child: any) => child.data)
            .filter((post: any) => {
              return (
                !post.removed_by_category &&
                post.selftext !== "[removed]" &&
                post.selftext !== "[deleted]" &&
                post.title
              );
            })
            .map((post: any) => ({
              title: post.title,
              score: post.score || 0,
              url: post.url,
              subreddit: post.subreddit,
              selftext: post.selftext?.substring(0, 500),
              permalink: `https://reddit.com${post.permalink}`,
              created_utc: post.created_utc,
            }));

          allPosts.push(...posts);
        }
      } catch (error) {
        // Silently continue if subreddit search fails
        continue;
      }
    }

    // Deduplicate by permalink (same post might appear in multiple searches)
    const seen = new Set<string>();
    const uniquePosts = allPosts.filter((post) => {
      if (seen.has(post.permalink)) {
        return false;
      }
      seen.add(post.permalink);
      return true;
    });

    // Sort by score (highest first) and limit to top 10
    uniquePosts.sort((a, b) => b.score - a.score);
    
    return {
      posts: uniquePosts.slice(0, 10),
    };
  } catch (error) {
    console.error("Error searching Reddit:", error);
    return { posts: [] };
  }
}

/**
 * Format Reddit posts for inclusion in AI prompt
 */
export function formatRedditPostsForPrompt(posts: Array<{
  title: string;
  score: number;
  url: string;
  subreddit: string;
  selftext?: string;
  permalink: string;
  created_utc: number;
}>): string {
  if (posts.length === 0) {
    return "No Reddit reviews found for this show.";
  }

  const formatted = posts
    .map((post, idx) => {
      const date = new Date(post.created_utc * 1000).toLocaleDateString();
      const text = post.selftext ? `\n  Content: ${post.selftext}...` : "";
      return `${idx + 1}. **${post.title}** (r/${post.subreddit}, ${post.score} upvotes, ${date})${text}\n   Link: ${post.permalink}`;
    })
    .join("\n\n");

  return `Reddit Reviews and Discussions:\n${formatted}`;
}

