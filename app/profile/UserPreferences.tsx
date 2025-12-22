"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser, getAuthToken } from "@/lib/auth-client";

// Theatre elements that users can rank (consolidated and refined)
const THEATRE_ELEMENTS = [
  "Storytelling/Plot",
  "Music/Orchestration/Singalong",
  "Dance/Choreography",
  "Unique Stage Elements/Prop Efficiency",
  "Wow Moments",
  "Message/Morality/Resonance",
  "Star Actors/Actresses",
] as const;

// Thematic elements that users can rank
const THEME_ELEMENTS = [
  "Self-Discovery",
  "Hero's Journey/Adventure",
  "Social Justice/Activism",
  "Love/Romance",
  "Family Dynamics",
  "Personal Growth/Transformation",
  "Overcoming Adversity/Underdog/Defying Odds",
  "Historical Events",
  "True Story/Biographical",
  "Social/Political Commentary",
  "Moral Complexity/Ethics",
  "Satire/Comedy",
] as const;

type TheatreElement = typeof THEATRE_ELEMENTS[number];
type ThemeElement = typeof THEME_ELEMENTS[number];

interface RankedElement {
  element: TheatreElement;
  rank: number;
}

interface RankedTheme {
  theme: ThemeElement;
  rank: number;
}

export default function UserPreferences() {
  const userId = useCurrentUser();
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const preferences = useQuery(
    api.functions.profile.getUserPreferences,
    userId && token ? { userId, token } : "skip"
  );
  const updatePreferences = useMutation(
    api.functions.profile.updateCurrentUserPreferences
  );

  // Force-ranked theatre elements
  const [rankedElements, setRankedElements] = useState<RankedElement[]>(() => {
    return THEATRE_ELEMENTS.map((el, idx) => ({
      element: el,
      rank: idx + 1,
    }));
  });
  
  // Force-ranked themes
  const [rankedThemes, setRankedThemes] = useState<RankedTheme[]>(() => {
    return THEME_ELEMENTS.map((theme, idx) => ({
      theme,
      rank: idx + 1,
    }));
  });
  
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOverElement, setDragOverElement] = useState<string | null>(null);
  const [draggedTheme, setDraggedTheme] = useState<string | null>(null);
  const [dragOverTheme, setDragOverTheme] = useState<string | null>(null);

  // Additional preferences
  const [avgTicketPrice, setAvgTicketPrice] = useState<number>(100);
  const [audiencePreference, setAudiencePreference] = useState<string>("any");
  const [seatingPreference, setSeatingPreference] = useState<string>("close");
  // Emotional responses: "neutral" | "positive" | "negative"
  const [emotionalResponses, setEmotionalResponses] = useState<Record<string, "neutral" | "positive" | "negative">>({});

  useEffect(() => {
    if (preferences) {
      // Load ranked elements if stored - but only if they match current element names
      if (preferences.rankedElements) {
        const savedElements = preferences.rankedElements as RankedElement[];
        const currentElementNames = new Set(THEATRE_ELEMENTS);
        const validElements = savedElements.filter(e => currentElementNames.has(e.element as TheatreElement));
        
        // If we have valid saved elements, use them; otherwise use defaults
        if (validElements.length === THEATRE_ELEMENTS.length) {
          setRankedElements(savedElements as RankedElement[]);
        } else {
          // Migration needed - reset to defaults
          setRankedElements(THEATRE_ELEMENTS.map((el, idx) => ({
            element: el,
            rank: idx + 1,
          })));
        }
      }
      
      // Load ranked themes if stored
      if (preferences.rankedThemes) {
        const savedThemes = preferences.rankedThemes as RankedTheme[];
        const currentThemeNames = new Set(THEME_ELEMENTS);
        const validThemes = savedThemes.filter(t => currentThemeNames.has(t.theme as ThemeElement));
        
        if (validThemes.length === THEME_ELEMENTS.length) {
          setRankedThemes(savedThemes as RankedTheme[]);
        } else {
          // Reset to defaults
          setRankedThemes(THEME_ELEMENTS.map((theme, idx) => ({
            theme,
            rank: idx + 1,
          })));
        }
      }
      
      setAvgTicketPrice(preferences.avgTicketPrice || 100);
      setAudiencePreference(preferences.audiencePreference || "any");
      setSeatingPreference(preferences.seatingPreference || "close");
      setEmotionalResponses(preferences.emotionalResponses || {} as Record<string, "neutral" | "positive" | "negative">);
    }
  }, [preferences]);

  const handleDragStart = (e: React.DragEvent, element: TheatreElement) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, element: TheatreElement) => {
    e.preventDefault();
    if (draggedElement && draggedElement !== element) {
      setDragOverElement(element);
    }
  };

  const handleDragLeave = () => {
    setDragOverElement(null);
  };

  const handleDrop = (e: React.DragEvent, targetElement: TheatreElement) => {
    e.preventDefault();
    setDragOverElement(null);

    if (!draggedElement || draggedElement === targetElement) {
      setDraggedElement(null);
      return;
    }

    const sourceRank = rankedElements.find((r) => r.element === draggedElement)?.rank || 0;
    const targetRank = rankedElements.find((r) => r.element === targetElement)?.rank || 0;

    const newRanked = [...rankedElements];
    const sourceIdx = newRanked.findIndex((r) => r.element === draggedElement);
    const targetIdx = newRanked.findIndex((r) => r.element === targetElement);

    // Swap ranks
    newRanked[sourceIdx].rank = targetRank;
    newRanked[targetIdx].rank = sourceRank;

    // Re-sort by rank
    newRanked.sort((a, b) => a.rank - b.rank);

    setRankedElements(newRanked);
    setDraggedElement(null);
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
    setDragOverElement(null);
  };

  const cycleEmotionalResponse = (response: string) => {
    setEmotionalResponses((prev) => {
      const current = prev[response] || "neutral";
      const next = current === "neutral" ? "positive" : current === "positive" ? "negative" : "neutral";
      return { ...prev, [response]: next };
    });
  };

  const getEmotionalResponseState = (response: string): "neutral" | "positive" | "negative" => {
    return emotionalResponses[response] || "neutral";
  };

  // Theme drag handlers
  const handleThemeDragStart = (e: React.DragEvent, theme: ThemeElement) => {
    setDraggedTheme(theme);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleThemeDragOver = (e: React.DragEvent, theme: ThemeElement) => {
    e.preventDefault();
    if (draggedTheme && draggedTheme !== theme) {
      setDragOverTheme(theme);
    }
  };

  const handleThemeDragLeave = () => {
    setDragOverTheme(null);
  };

  const handleThemeDrop = (e: React.DragEvent, targetTheme: ThemeElement) => {
    e.preventDefault();
    setDragOverTheme(null);

    if (!draggedTheme || draggedTheme === targetTheme) {
      setDraggedTheme(null);
      return;
    }

    const sourceRank = rankedThemes.find((r) => r.theme === draggedTheme)?.rank || 0;
    const targetRank = rankedThemes.find((r) => r.theme === targetTheme)?.rank || 0;

    const newRanked = [...rankedThemes];
    const sourceIdx = newRanked.findIndex((r) => r.theme === draggedTheme);
    const targetIdx = newRanked.findIndex((r) => r.theme === targetTheme);

    newRanked[sourceIdx].rank = targetRank;
    newRanked[targetIdx].rank = sourceRank;

    newRanked.sort((a, b) => a.rank - b.rank);
    setRankedThemes(newRanked);
    setDraggedTheme(null);
  };

  const handleThemeDragEnd = () => {
    setDraggedTheme(null);
    setDragOverTheme(null);
  };

  const handleSave = async () => {
    if (!userId || !token) {
      alert("Please sign in first");
      return;
    }

    try {
      await updatePreferences({
        token,
        rankedElements: rankedElements,
        rankedThemes: rankedThemes,
        avgTicketPrice,
        audiencePreference,
        seatingPreference,
        emotionalResponses,
      });
      alert("Preferences saved!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences");
    }
  };

  if (userId === undefined || preferences === undefined) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        Please sign in to view your preferences.
      </div>
    );
  }

  const sortedElements = [...rankedElements].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">Theatre Preferences</h2>

      {/* Force-ranked elements */}
        <div>
        <h3 className="text-lg font-medium mb-3">
          Rank Theatre Elements (Drag to reorder)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Rank these elements from most important (1) to least important ({THEATRE_ELEMENTS.length})
        </p>
        <div className="space-y-1">
          {sortedElements.map(({ element, rank }) => {
            const isDragging = draggedElement === element;
            const isDragOver = dragOverElement === element;
            return (
              <div
                key={element}
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                onDragOver={(e) => handleDragOver(e, element)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, element)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-grab active:cursor-grabbing ${
                  isDragging ? "opacity-50" : ""
                } ${isDragOver ? "bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-500" : ""}`}
              >
                <div className="shrink-0 w-8 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                  #{rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{element}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Force-ranked themes */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-3">
          Rank Themes (Drag to reorder)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Rank these thematic elements from most important (1) to least important ({THEME_ELEMENTS.length})
        </p>
        <div className="space-y-1">
          {[...rankedThemes].sort((a, b) => a.rank - b.rank).map(({ theme, rank }) => {
            const isDragging = draggedTheme === theme;
            const isDragOver = dragOverTheme === theme;
            return (
              <div
                key={theme}
                draggable
                onDragStart={(e) => handleThemeDragStart(e, theme)}
                onDragOver={(e) => handleThemeDragOver(e, theme)}
                onDragLeave={handleThemeDragLeave}
                onDrop={(e) => handleThemeDrop(e, theme)}
                onDragEnd={handleThemeDragEnd}
                className={`flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-grab active:cursor-grabbing ${
                  isDragging ? "opacity-50" : ""
                } ${isDragOver ? "bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-500" : ""}`}
              >
                <div className="shrink-0 w-8 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                  #{rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{theme}</p>
                </div>
              </div>
            );
          })}
        </div>
        </div>

      {/* Additional preferences */}
      <div className="space-y-6 border-t pt-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Average Ticket Price I'll Pay: ${avgTicketPrice}
          </label>
          <input
            type="range"
            min="20"
            max="500"
            step="10"
            value={avgTicketPrice}
            onChange={(e) => setAvgTicketPrice(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Audience Preference
          </label>
          <select
            value={audiencePreference}
            onChange={(e) => setAudiencePreference(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="any">Any audience type</option>
            <option value="adults">Prefer adult-oriented shows</option>
            <option value="family">Enjoy family-friendly shows</option>
            <option value="kids">Don't mind shows with many kids</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Seating Preference
          </label>
          <select
            value={seatingPreference}
            onChange={(e) => setSeatingPreference(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="close">As close as possible (front mezzanine is worst)</option>
            <option value="orchestra">Prefer orchestra</option>
            <option value="mezzanine">Prefer mezzanine</option>
            <option value="balcony">Prefer balcony</option>
            <option value="any">Any seating</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">
            How do you want to feel after seeing a show?
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Click to cycle: Neutral → Want to feel this → Don't want to feel this
          </p>
          <div className="space-y-2">
            {[
              "Inspired",
              "Moved",
              "Happy",
              "Joyful",
              "Face hurts from laughing",
              "Thrilled",
              "Spooked",
              "Horrified",
              "Thoughtful",
              "Emotional",
            ].map((response) => {
              const state = getEmotionalResponseState(response);
              return (
                <button
                  key={response}
                  type="button"
                  onClick={() => cycleEmotionalResponse(response)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded border transition-colors ${
                    state === "positive"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200"
                      : state === "negative"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200"
                      : "bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300"
                  } hover:opacity-80`}
                >
                  <span>{response}</span>
                  <span className="text-xs font-medium">
                    {state === "positive" ? "✓ Want" : state === "negative" ? "✗ Avoid" : "○ Neutral"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
    </div>
  );
}
