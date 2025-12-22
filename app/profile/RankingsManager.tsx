"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser, getAuthToken } from "@/lib/auth-client";

// District badge component
function ShowDistrictBadges({ userShowId }: { userShowId: Id<"userShows"> }) {
  const visits = useQuery(
    api.functions.profile.getUserShowVisits,
    { userShowId }
  );

  if (!visits || visits.length === 0) return null;

  // Get unique districts
  const districts = Array.from(new Set(visits.map((v) => v.district)));

  const getDistrictColor = (district: string) => {
    switch (district) {
      case "Broadway":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Playhouse Square":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "West End":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Off-Broadway":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Touring":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Local":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="flex gap-1">
      {districts.map((district) => (
        <span
          key={district}
          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${getDistrictColor(district)}`}
          title={district}
        >
          {district === "Playhouse Square" ? "PS" : district === "Off-Broadway" ? "OB" : district.substring(0, 2)}
        </span>
      ))}
    </div>
  );
}

// Show details panel component
function ShowDetailsPanel({
  userShowId,
  show,
}: {
  userShowId: Id<"userShows">;
  show: {
    title: string;
    theatre?: string;
    district?: string;
    description?: string;
  };
}) {
  const visits = useQuery(
    api.functions.profile.getUserShowVisits,
    { userShowId }
  );

  if (!visits) {
    return <div className="px-2 py-2 text-xs text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-2 py-2 bg-gray-50 dark:bg-zinc-800 border-l-2 border-blue-500">
      <div className="space-y-2 text-xs">
        <div>
          <p className="font-semibold text-sm mb-1">Visits ({visits.length})</p>
          {visits.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No visits recorded yet</p>
          ) : (
            <div className="space-y-1">
              {visits.map((visit, idx) => (
                <div key={visit._id} className="text-xs">
                  <span className="font-medium">
                    {new Date(visit.visitDate).toLocaleDateString()}
                  </span>
                  {" - "}
                  <span>{visit.theatre}</span>
                  {" ("}
                  <span>{visit.district}</span>
                  {")"}
                  {visit.notes && (
                    <>
                      <br />
                      <span className="text-gray-600 dark:text-gray-400 italic">
                        {visit.notes}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RankingsManager() {
  const userId = useCurrentUser();
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const rankings = useQuery(
    api.functions.profile.getUserRankings,
    userId && token ? { userId, token } : "skip"
  );
  const updateRanking = useMutation(api.functions.profile.updateRanking);
  const deleteUserShow = useMutation(api.functions.profile.deleteUserShow);
  const [draggedRankingId, setDraggedRankingId] = useState<Id<"userShows"> | null>(null);
  const [dragOverRankingId, setDragOverRankingId] = useState<Id<"userShows"> | null>(null);
  const [expandedShowId, setExpandedShowId] = useState<Id<"userShows"> | null>(null);

  const handleDragStart = (e: React.DragEvent, rankingId: Id<"userShows">) => {
    setDraggedRankingId(rankingId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("rankingId", rankingId);
  };

  const handleDragOver = (e: React.DragEvent, rankingId: Id<"userShows">) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedRankingId && draggedRankingId !== rankingId) {
      setDragOverRankingId(rankingId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverRankingId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetRankingId: Id<"userShows">) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverRankingId(null);

    const sourceRankingId = e.dataTransfer.getData("rankingId") as Id<"userShows">;
    
    if (!userId || !token || !rankings || !sourceRankingId || sourceRankingId === targetRankingId) {
      setDraggedRankingId(null);
      return;
    }

    const sourceRanking = rankings.find((r) => r._id === sourceRankingId);
    const targetRanking = rankings.find((r) => r._id === targetRankingId);

    if (!sourceRanking || !targetRanking || !sourceRanking.rank || !targetRanking.rank) {
      setDraggedRankingId(null);
      return;
    }

    try {
      await updateRanking({
        token,
        userId,
        showId: sourceRanking.showId,
        newRank: targetRanking.rank,
      });
    } catch (error) {
      console.error("Error updating ranking:", error);
      alert("Failed to update ranking");
    } finally {
      setDraggedRankingId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedRankingId(null);
    setDragOverRankingId(null);
  };

  const handleRemoveFromRankings = async (showId: Id<"shows">) => {
    if (!userId || !token) return;

    try {
      await deleteUserShow({
        token,
        userId,
        showId,
      });
    } catch (error) {
      console.error("Error removing from rankings:", error);
      alert("Failed to remove from rankings");
    }
  };

  if (userId === undefined || rankings === undefined) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        Please sign in to view your rankings.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Ranked Shows</h3>
      {rankings.length === 0 ? (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          You haven't ranked any shows yet. Search and add shows to your rankings.
        </p>
      ) : (
        <div>
          {rankings.map((ranking) => {
            if (!ranking.show) return null;
            const isDragging = draggedRankingId === ranking._id;
            const isDragOver = dragOverRankingId === ranking._id;
            const isExpanded = expandedShowId === ranking._id;
            return (
              <div key={ranking._id}>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, ranking._id)}
                  onDragOver={(e) => handleDragOver(e, ranking._id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, ranking._id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-grab active:cursor-grabbing ${
                    isDragging ? "opacity-50" : ""
                  } ${isDragOver ? "bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-500" : ""}`}
                >
                  <div className="shrink-0 w-8 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                    #{ranking.rank}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{ranking.show.title}</p>
                    <ShowDistrictBadges userShowId={ranking._id} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedShowId(isExpanded ? null : ranking._id);
                    }}
                    className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
                    title={isExpanded ? "Hide details" : "Show details"}
                  >
                    {isExpanded ? "−" : "+"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromRankings(ranking.showId);
                    }}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
                {isExpanded && (
                  <ShowDetailsPanel userShowId={ranking._id} show={ranking.show} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Search component to be placed on the right side
export function RankingsSearch() {
  const userId = useCurrentUser();
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const rankings = useQuery(
    api.functions.profile.getUserRankings,
    userId && token ? { userId, token } : "skip"
  );
  const allShows = useQuery(api.functions.shows.getShows, {});
  const upsertUserShow = useMutation(api.functions.profile.upsertUserShow);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToRankings = async (showId: Id<"shows">) => {
    if (!userId || !token) {
      alert("Please sign in first");
      return;
    }

    try {
      const maxRank = rankings?.length || 0;
      const newRank = maxRank + 1;

      await upsertUserShow({
        token,
        userId,
        showId,
        status: "seen",
        rank: newRank,
      });
      setSearchQuery("");
    } catch (error) {
      console.error("Error adding to rankings:", error);
      alert("Failed to add show to rankings");
    }
  };

  const availableShows = useMemo(() => {
    if (!allShows || !rankings) return [];
    
    const rankedShowIds = new Set(rankings.map(r => r.showId));
    return allShows
      .filter(show => !rankedShowIds.has(show._id))
      .filter(show => 
        show.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [allShows, rankings, searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && availableShows.length > 0) {
      handleAddToRankings(availableShows[0]._id);
    }
  };

  if (userId === undefined || rankings === undefined) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Add Show to Rankings</h3>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search shows... (Press Enter to add top result)"
          className="w-full px-3 py-2 text-sm border rounded-md dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && availableShows.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {availableShows.map((show, index) => (
              <button
                key={show._id}
                onClick={() => handleAddToRankings(show._id)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm border-b last:border-b-0 ${
                  index === 0 ? "border-l-4 border-l-green-500" : ""
                }`}
              >
                {show.title}
                {show.theatre && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    @ {show.theatre}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        {searchQuery && availableShows.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border rounded-md shadow-lg px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            No shows found
          </div>
        )}
      </div>
      {searchQuery && availableShows.length > 0 && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Press Enter to add "{availableShows[0].title}" or click any result
        </p>
      )}
    </div>
  );
}