import { query, mutation, action } from "../_generated/server";
import { api } from "../_generated/api";
import { v } from "convex/values";
import { generateRecommendationPrompt, formatUserRankings, formatElementRankings } from "../lib/ai/recommendations";
import { searchRedditForShow, formatRedditPostsForPrompt } from "../lib/reddit";

// Helper to call OpenAI API
async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Helper to call Anthropic API
async function callAnthropic(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "";
}

// Call AI API (tries OpenAI first, falls back to Anthropic)
async function callAI(prompt: string): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await callOpenAI(prompt);
    } catch (error) {
      console.error("OpenAI call failed, trying Anthropic:", error);
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return await callAnthropic(prompt);
  }

  throw new Error("No AI API key configured (OPENAI_API_KEY or ANTHROPIC_API_KEY)");
}

// Get AI recommendation for a show
export const getRecommendation = action({
  args: {
    userId: v.id("users"),
    showIds: v.array(v.id("shows")), // Can be single or multiple for comparison
    conversationHistory: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // For now, handle single show recommendations
    if (args.showIds.length === 0) {
      throw new Error("At least one show ID required");
    }

    const showId = args.showIds[0]; // Focus on first show for now

    // Fetch user rankings (using public API since we're authenticated by userId)
    const rankings = await ctx.runQuery(api.functions.profile.getUserRankings, {
      userId: args.userId,
      token: null,
    });

    // Fetch user preferences
    const preferences = await ctx.runQuery(api.functions.profile.getUserPreferences, {
      userId: args.userId,
      token: null,
    });

    // Fetch show details
    const show = await ctx.runQuery(api.functions.shows.getShow, { showId });

    if (!show) {
      throw new Error("Show not found");
    }

    // Format data for prompt
    const filteredRankings = (rankings || [])
      .filter((r) => r.rank !== undefined && r.show !== null)
      .map((r) => ({
        rank: r.rank!,
        show: {
          title: r.show!.title,
          theatre: r.show!.theatre,
          district: r.show!.district,
          description: r.show!.description,
        },
      }));
    
    const userRankingsText = formatUserRankings(filteredRankings);
    const totalRankedShows = filteredRankings.length;
    const elementRankingsText = preferences?.rankedElements
      ? formatElementRankings(preferences.rankedElements as Array<{ element: string; rank: number }>)
      : "No preferences set";

    const emotionalResponses = preferences?.emotionalResponses as Record<string, "neutral" | "positive" | "negative"> | undefined;
    const positiveEmotions = emotionalResponses
      ? Object.entries(emotionalResponses)
          .filter(([_, state]) => state === "positive")
          .map(([emotion]) => emotion)
      : [];
    const negativeEmotions = emotionalResponses
      ? Object.entries(emotionalResponses)
          .filter(([_, state]) => state === "negative")
          .map(([emotion]) => emotion)
      : [];

    // Search Reddit for reviews and discussions
    console.log(`Searching Reddit for reviews of: ${show.title}`);
    const redditResults = await searchRedditForShow(show.title);
    const redditContext = formatRedditPostsForPrompt(redditResults.posts);
    console.log(`Found ${redditResults.posts.length} Reddit posts about ${show.title}`);

    // Generate prompt
    const prompt = generateRecommendationPrompt({
      userRankings: userRankingsText || "No shows ranked yet",
      userElementRankings: elementRankingsText,
      totalRankedShows: totalRankedShows,
      avgTicketPrice: preferences?.avgTicketPrice,
      audiencePreference: preferences?.audiencePreference,
      seatingPreference: preferences?.seatingPreference,
      emotionalResponses: positiveEmotions.length > 0 || negativeEmotions.length > 0
        ? [
            ...positiveEmotions.map((e) => `Want to feel: ${e}`),
            ...negativeEmotions.map((e) => `Don't want to feel: ${e}`),
          ]
        : [],
      showTitle: show.title,
      showDistrict: show.district,
      showTheatre: show.theatre,
      showDescription: show.description,
      showGenreThemes: undefined, // Could be extracted from description or added to schema
      redditContext: redditContext,
    });

    // Call AI
    const aiResponse = await callAI(prompt);

    // Try to parse JSON response
    let parsedResponse: any;
    try {
      // Extract JSON from response (might have markdown formatting)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = { reasoning: aiResponse };
      }
    } catch (error) {
      // If parsing fails, use raw response
      parsedResponse = { reasoning: aiResponse };
    }

    // Format the response with rating and projected ranking summary
    let finalReasoning = parsedResponse.reasoning || parsedResponse.recommendation || aiResponse;
    
    // Add summary at the end with rating and projected ranking
    if (parsedResponse.ratingOutOf10 !== undefined || parsedResponse.projectedRanking !== undefined) {
      const summaryParts = [];
      if (parsedResponse.ratingOutOf10 !== undefined) {
        summaryParts.push(`Rating: ${parsedResponse.ratingOutOf10}/10`);
      }
      if (parsedResponse.projectedRanking !== undefined && rankings && rankings.length > 0) {
        summaryParts.push(`Projected Ranking: #${parsedResponse.projectedRanking} of ${rankings.length}`);
      }
      if (summaryParts.length > 0) {
        finalReasoning += `\n\n**${summaryParts.join(" | ")}**`;
      }
    }

    return {
      recommendation: parsedResponse.prediction || "uncertain",
      reasoning: finalReasoning,
      questions: parsedResponse.questions || [],
      ratingOutOf10: parsedResponse.ratingOutOf10,
      projectedRanking: parsedResponse.projectedRanking,
    };
  },
});

// Get user context for AI recommendations
export const getUserContext = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // TODO: Fetch and format user context:
    // - Show rankings
    // - Preferences
    // - Previously seen shows
    return null;
  },
});

// Save user feedback on recommendation
export const saveRecommendationFeedback = mutation({
  args: {
    userId: v.id("users"),
    showId: v.id("shows"),
    wasAccurate: v.boolean(),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Save feedback to improve future recommendations
    return null;
  },
});

