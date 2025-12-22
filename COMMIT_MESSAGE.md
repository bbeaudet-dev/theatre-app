Major feature updates: Trip Planner enhancements, AI recommendations, and profile preferences overhaul

Key Changes:

1. Trip Planner Improvements:
   - Reordered navigation: Trip Planner is now the primary tab
   - Added Find/Recs/My Lists/Trip List panel visible on trips list view
   - Panel shows even when not viewing a specific trip (Trip List tab disabled/grayed)
   - Created Recommendations (Recs) tab for future AI-powered suggestions
   - Fixed drag-and-drop for shows throughout the trip planner

2. Profile Preferences Complete Overhaul:
   - Replaced slider-based preferences with force-ranked drag-and-drop list
   - Theatre elements now rankable: Storytelling, Dance, Choreography, Orchestration, etc.
   - Added additional preferences:
     * Average ticket price slider
     * Audience preference (any/adults/family/kids)
     * Seating preference dropdown
     * Three-state emotional responses (neutral/positive/negative) with visual indicators
   - Updated schema to support new preference structure

3. AI Recommendation System:
   - Created comprehensive recommendation prompt using user rankings and preferences
   - Integrated Reddit search for real theatre-goer reviews
   - Added rating (out of 10) and projected ranking predictions
   - Personalized tone: AI addresses user directly with "you/your"
   - Drag-and-drop show recommendations via floating chat button
   - Loading spinner during AI processing

4. Show Details in Rankings:
   - Click-to-expand show details with visit history
   - District badges (Broadway, Playhouse Square, West End, etc.) showing where shows were seen
   - Visit information including dates, theatres, districts, and notes

5. Navigation & UI Updates:
   - Trip Planner moved to first position in navigation
   - Home page redirects to Trip Planner
   - Removed home page and blue plus button from nav
   - Sign Out button moved to Profile page
   - Sign In button changes to "Profile" when authenticated
   - Added footer with copyright and About link

6. New Pages:
   - About page with mission, credits, and acknowledgments
   - Footer component added to all pages

7. File Organization:
   - Moved sync functions to convex/functions/sync/
   - Created convex/config/dataSources.ts for data source configuration
   - Created convex/lib/ai/recommendations.ts for AI prompt logic
   - Created convex/lib/reddit.ts for Reddit search functionality

8. Bug Fixes:
   - Fixed isOpenRun type to be optional throughout
   - Fixed preferences mutation schema to match new structure
   - Fixed drag-and-drop handling for recommendations
   - Improved error handling and logging

