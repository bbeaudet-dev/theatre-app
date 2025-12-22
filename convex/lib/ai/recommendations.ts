/**
 * AI Prompt for Show Recommendation Predictions
 * 
 * This prompt uses multimodal data (user rankings, preferences, show characteristics)
 * to predict whether a user will enjoy a specific show.
 */

/**
 * Generate the recommendation prompt with user data
 */
export function generateRecommendationPrompt(params: {
  userRankings: string;
  userElementRankings: string;
  userThemeRankings?: string;
  totalRankedShows?: number;
  avgTicketPrice?: number;
  audiencePreference?: string;
  seatingPreference?: string;
  emotionalResponses?: string[];
  showTitle: string;
  showDistrict?: string;
  showTheatre?: string;
  showDescription?: string;
  showGenreThemes?: string;
  redditContext?: string;
}) {
  const {
    userRankings,
    userElementRankings,
    userThemeRankings,
    totalRankedShows,
    avgTicketPrice = 100,
    audiencePreference = "any",
    seatingPreference = "any",
    emotionalResponses = [],
    showTitle,
    showDistrict,
    showTheatre,
    showDescription,
    showGenreThemes,
    redditContext,
  } = params;

  return `You are an expert theatre recommendation assistant. I am a theatre-goer who is interested in knowing if I would enjoy a specific show. Based on my past rankings, preferences, and the show's characteristics, tell me if I would like this show.

## My Theatre Profile

### Shows I've Ranked (most to least favorite):
${userRankings}
${totalRankedShows !== undefined && totalRankedShows > 0 ? `\nTotal shows currently ranked: ${totalRankedShows}` : ''}

### Theatre Elements I Value (ranked from most to least important to me):
${userElementRankings}

### Themes I Value (ranked from most to least important to me):
${userThemeRankings || "No theme preferences set"}

### My Additional Preferences:
- Average Ticket Price I'll Pay: $${avgTicketPrice}
- Audience Preference: ${audiencePreference}
- Seating Preference: ${seatingPreference}
- Emotional Responses: ${emotionalResponses.length > 0 ? emotionalResponses.join(", ") : "Not specified"}

## Show Being Evaluated

**Show Title:** ${showTitle}
${showDistrict ? `- District: ${showDistrict}` : ""}
${showTheatre ? `- Theatre: ${showTheatre}` : ""}
${showDescription ? `- Description: ${showDescription}` : ""}
${showGenreThemes ? `- Genre/Themes: ${showGenreThemes}` : ""}

${redditContext ? `\n## ${redditContext}\n\nUse the Reddit reviews and discussions above as additional context to help inform your recommendation. Consider what real theatre-goers have said about this show, but also keep in mind that individual experiences vary.` : ""}

## Analysis Instructions

1. **Pattern Recognition**: Analyze my top-ranked shows to identify common elements, themes, structures, and characteristics. Look for:
   - Storytelling styles (hero's journey, allegorical tales, comedies, dramas, etc.)
   - Musical styles (sung-through, jukebox, traditional book musicals)
   - Thematic content (morality, social commentary, romance, etc.)
   - Production elements (dance, choreography, unique staging, etc.)
   - Emotional tone (whimsical, dark, uplifting, thought-provoking, etc.)

2. **Bottom Shows Analysis**: Examine shows ranked low to identify patterns in what they DON'T enjoy. Look for common negative elements.

3. **Element and Theme Matching**: Compare the show in question against:
   - My element preference rankings (prioritize elements ranked higher - e.g., if "Message/Morality/Resonance" is #1, this is CRITICAL)
   - My theme rankings - THIS IS EQUALLY IMPORTANT AS ELEMENTS! Themes are the core of what makes a show resonate with me. If I rank "Overcoming Adversity/Underdog/Defying Odds" highly, shows like Shrek (where the underdog defies all odds) should score very well, even if they seem whimsical on the surface. If I rank "Personal Growth/Transformation" highly, shows with strong transformation arcs should score well.
   - Patterns from my top shows (strong matches = positive indicator)
   - Patterns from my bottom shows (strong matches = negative indicator)
   - **Theme analysis is just as critical as element analysis** - don't undervalue themes!

4. **Deep Theme Analysis (EQUALLY IMPORTANT AS ELEMENTS)**: Go beyond surface descriptions. Analyze:
   - What themes are ACTUALLY present in the show (not just what it seems like on the surface)
   - How themes align with my ranked theme preferences - this is CRITICAL! If a show strongly matches my top-ranked themes, it should score highly regardless of surface-level descriptions
   - Whether the show has depth even if it seems light/whimsical (many great shows do! For example, Shrek seems whimsical but explores themes of personal transformation, defying odds, self-discovery - if these are my top themes, Shrek should score well)
   - The complexity and resonance of the themes, not just their presence
   - **Themes are weighted EQUALLY to elements** - a show that perfectly matches my top themes should score as well as a show that perfectly matches my top elements

5. **Preference Alignment**: Check how well the show aligns with:
   - Emotional responses I want to feel
   - My audience type preferences
   - Any other specific preferences I have

6. **Prediction & Confidence**: 
   - Provide a prediction (Likely I'll enjoy / Uncertain / Unlikely I'll enjoy)
   - Give a confidence level (0-100%)
   - Explain key reasons based on the analysis above, written directly to me (the person asking)
   - Mention specific elements AND THEMES that align or conflict with my preferences - give themes equal weight in your explanation
   - Reference my ranked preferences explicitly (e.g., "Given that you rank Overcoming Adversity/Underdog/Defying Odds as your #3 theme, this show's underdog narrative strongly aligns with what you love...")
   - **Remember: Theme alignment is just as important as element alignment** - if themes match well, emphasize that!

7. **Nuance & Disclaimers**: 
   - Acknowledge that theatre is complex and surprises are possible
   - Note that even if all elements point one way, I might still have a different experience
   - Suggest what aspects might surprise me positively or negatively

## Output Format

Return a JSON object with this structure:
{
  "prediction": "likely" | "uncertain" | "unlikely",
  "confidence": number (0-100),
  "ratingOutOf10": number (1-10),
  "projectedRanking": number (estimated position in my ranked list, where 1 is best),
  "reasoning": "Main explanation written directly to me, the person asking. Use 'you' and 'your' when addressing me.",
  "keyAlignments": ["element1", "element2", ...],
  "keyConflicts": ["element1", "element2", ...],
  "surprisePotential": "Brief note on what might surprise me",
  "recommendation": "Should I see it? Why or why not? Written directly to me using 'you' and 'your'."
}

IMPORTANT NOTES:
- "ratingOutOf10": Give this show a rating from 1-10 based on how much I would likely enjoy it, considering my preferences and past rankings. This is a raw enjoyment score.
- "projectedRanking": Based on my current ranked list of ${totalRankedShows || 'unknown number of'} shows and this rating, estimate where this show would fall in my rankings (1 = best, ${totalRankedShows ? `${totalRankedShows}` : 'N'} = worst). Consider the distribution of quality in my existing rankings - if my top shows are all 9-10/10 and this show is 7/10, it might rank lower. If I have ${totalRankedShows ? totalRankedShows : 'many'} shows ranked and this would be better than about 10 of them, the projected ranking would be around #11-15. Be realistic and consider where shows of similar quality/rating fall in my current list.
- Write your reasoning and recommendation as if you are speaking directly to me (the person asking). Use "you" and "your" when addressing me. Be conversational and personal.

Remember: The goal is to help me avoid spending money on shows I won't enjoy, while not discouraging me from shows I might discover and love. Be honest but nuanced in your analysis.`;
}

/**
 * Helper function to format user rankings for the prompt
 */
export function formatUserRankings(rankings: Array<{
  rank: number;
  show: {
    title: string;
    theatre?: string;
    district?: string;
    description?: string;
  };
}>) {
  return rankings
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .map((r) => {
      const parts = [`${r.rank}. ${r.show.title}`];
      if (r.show.district) parts.push(`(${r.show.district})`);
      return parts.join(" ");
    })
    .join("\n");
}

/**
 * Helper function to format element rankings for the prompt
 */
export function formatElementRankings(rankedElements: Array<{
  element: string;
  rank: number;
}>) {
  return rankedElements
    .sort((a, b) => a.rank - b.rank)
    .map((r) => `${r.rank}. ${r.element}`)
    .join("\n");
}

/**
 * Helper function to format theme rankings for the prompt
 */
export function formatThemeRankings(rankedThemes: Array<{
  theme: string;
  rank: number;
}>) {
  return rankedThemes
    .sort((a, b) => a.rank - b.rank)
    .map((r) => `${r.rank}. ${r.theme}`)
    .join("\n");
}

