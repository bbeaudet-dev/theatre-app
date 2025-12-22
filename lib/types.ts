/**
 * Centralized Type Definitions
 * 
 * Single source of truth for all types used across the application.
 * Re-exports Convex Doc types and defines extended/utility types.
 */

import { Doc, Id } from "@/convex/_generated/dataModel";

// ============================================================================
// Re-export Convex Doc types for convenience
// ============================================================================

export type User = Doc<"users">;
export type Show = Doc<"shows">;
export type UserShow = Doc<"userShows">;
export type UserShowVisit = Doc<"userShowVisits">;
export type Trip = Doc<"trips">;
export type TripDay = Doc<"tripDays">;
export type TripDaySlot = Doc<"tripDaySlots">;
export type UserList = Doc<"userLists">;
export type UserPreferences = Doc<"userPreferences">;
export type Notification = Doc<"notifications">;
export type NotificationPreferences = Doc<"notificationPreferences">;
export type ShowSchedule = Doc<"showSchedules">;
export type SyncReport = Doc<"syncReports">;

// ============================================================================
// District and Enum Types
// ============================================================================

export type ShowDistrict = 
  | "broadway" 
  | "off-broadway" 
  | "touring" 
  | "local"
  | "Broadway" 
  | "Playhouse Square" 
  | "West End" 
  | "Off-Broadway" 
  | "Touring"
  | "Other";

export type UserShowStatus = "seen" | "watchlist" | "considering" | "not-interested";

export type SlotType = "show" | "meal" | "transport" | "flight" | "custom";

export type ViewMode = "grid" | "list";

export type NotificationType = 
  | "opening" 
  | "closing" 
  | "preview" 
  | "cast_change" 
  | "news" 
  | "review" 
  | "new_show";

// ============================================================================
// Showtimes Type
// ============================================================================

export interface Showtimes {
  monday: string[] | null;
  tuesday: string[] | null;
  wednesday: string[] | null;
  thursday: string[] | null;
  friday: string[] | null;
  saturday: string[] | null;
  sunday: string[] | null;
}

// ============================================================================
// Extended Types (with populated relationships)
// ============================================================================

export interface RankingItem {
  _id: Id<"userShows">;
  showId: Id<"shows">;
  rank?: number;
  show: Show | null;
}

export interface DayWithSlots extends TripDay {
  slots: TripDaySlot[];
}

export interface TripWithDays extends Trip {
  days: DayWithSlots[];
}

// ============================================================================
// User Preferences Types
// ============================================================================

export type TheatreElement = 
  | "Storytelling/Plot"
  | "Music/Orchestration/Singalong"
  | "Dance/Choreography"
  | "Unique Stage Elements/Prop Efficiency"
  | "Wow Moments"
  | "Message/Morality/Resonance"
  | "Star Actors/Actresses";

export type ThemeElement =
  | "Self-Discovery"
  | "Hero's Journey/Adventure"
  | "Social Justice/Activism"
  | "Love/Romance"
  | "Family Dynamics"
  | "Personal Growth/Transformation"
  | "Overcoming Adversity/Underdog/Defying Odds"
  | "Historical Events"
  | "True Story/Biographical"
  | "Social/Political Commentary"
  | "Moral Complexity/Ethics"
  | "Satire/Comedy";

export interface RankedElement {
  element: TheatreElement;
  rank: number;
}

export interface RankedTheme {
  theme: ThemeElement;
  rank: number;
}

export type EmotionalResponseState = "neutral" | "positive" | "negative";

export interface EmotionalResponses {
  [key: string]: EmotionalResponseState;
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface ShowCardProps {
  show: Show;
  viewMode?: ViewMode;
  tripId?: Id<"trips"> | null;
  draggable?: boolean;
}

export interface TripSlotProps {
  slot: {
    _id: Id<"tripDaySlots">;
    type: SlotType;
    title: string;
    startTime: string;
    endTime?: string;
    showId?: Id<"shows">;
    backupShowIds?: Id<"shows">[];
    notes?: string;
  };
  onEdit: (event: React.MouseEvent) => void;
  tripId: Id<"trips">;
  tripDayId: Id<"tripDays">;
}

// ============================================================================
// AI Recommendation Types
// ============================================================================

export interface RecommendationPromptParams {
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
}

export interface RecommendationResponse {
  prediction: "yes" | "no" | "uncertain";
  reasoning: string;
  questions?: string[];
  ratingOutOf10?: number;
  projectedRanking?: number;
}

// ============================================================================
// Theatre Cloud Types
// ============================================================================

export interface PositionedShow {
  show: RankingItem;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TheatreCloudConfig {
  minWidth?: number;
  maxWidth?: number;
  aspectRatio?: number;
  containerWidth?: number;
  containerHeight?: number;
  padding?: number;
  spiralStep?: number;
  spiralMaxIterations?: number;
  waveDelay?: number;
  waveDuration?: number;
  hoverScale?: number;
  blurAmount?: string;
  minSize?: number;
  evenRankSizeAdjustment?: number;
}

