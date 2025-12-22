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
    // Using Reddit's JSON API - add keywords like "review", "thoughts", "opinion" to find reviews
    const searchTerms = [
      `${showTitle} review`,
      `${showTitle} thoughts`,
      `${showTitle} opinion`,
      `${showTitle} r/broadway`,
      `${showTitle} r/musicals`,
    ];

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
        const url = `https://www.reddit.com/search.json?q=${encodedTerm}&sort=relevance&limit=5&type=link`;
        
        const response = await fetch(url, {
          headers: {
            "User-Agent": "TheatreApp/1.0 (by /u/theatreapp)",
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
              // Filter out low-quality posts (very low scores or removed/deleted)
              return (
                post.score > 0 &&
                !post.removed_by_category &&
                post.selftext !== "[removed]" &&
                post.selftext !== "[deleted]"
              );
            })
            .map((post: any) => ({
              title: post.title,
              score: post.score,
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

