"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser, getAuthToken } from "@/lib/auth-client";

export default function RankingsManager() {
  const userId = useCurrentUser();
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const rankings = useQuery(
    api.functions.profile.getUserRankings,
    userId && token ? { userId, token } : "skip"
  );
  const allShows = useQuery(api.functions.shows.getShows, {});
  const upsertUserShow = useMutation(api.functions.profile.upsertUserShow);
  const updateRanking = useMutation(api.functions.profile.updateRanking);
  const deleteUserShow = useMutation(api.functions.profile.deleteUserShow);
  const [selectedShowId, setSelectedShowId] = useState<Id<"shows"> | null>(
    null
  );

  const handleAddToRankings = async (showId: Id<"shows">) => {
    if (!userId || !token) {
      alert("Please sign in first");
      return;
    }

    try {
      // Get current max rank and add to end
      const maxRank = rankings?.length || 0;
      const newRank = maxRank + 1;

      await upsertUserShow({
        token,
        userId,
        showId,
        status: "seen",
        rank: newRank,
      });
      setSelectedShowId(null);
    } catch (error) {
      console.error("Error adding to rankings:", error);
      alert("Failed to add show to rankings");
    }
  };

  const handleMoveRanking = async (
    showId: Id<"shows">,
    direction: "up" | "down"
  ) => {
    if (!userId || !token || !rankings) return;

    const currentRanking = rankings.find((r) => r.showId === showId);
    if (!currentRanking || !currentRanking.rank) return;

    const newRank =
      direction === "up"
        ? currentRanking.rank - 1
        : currentRanking.rank + 1;

    if (newRank < 1 || newRank > rankings.length) return;

    try {
      await updateRanking({
        token,
        userId,
        showId,
        newRank,
      });
    } catch (error) {
      console.error("Error updating ranking:", error);
      alert("Failed to update ranking");
    }
  };

  const handleRemoveFromRankings = async (showId: Id<"shows">) => {
    if (!userId || !token) return;

    try {
      // Delete the userShow record entirely
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
    <div className="space-y-2 text-xs">
      <div>
        <h3 className="text-sm font-semibold mb-1.5">Add Show to Rankings</h3>
        <div className="space-y-1.5 mb-3">
          <select
            value={selectedShowId || ""}
            onChange={(e) =>
              setSelectedShowId(
                e.target.value ? (e.target.value as Id<"shows">) : null
              )
            }
            className="w-full px-2 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="">Select a show...</option>
            {allShows
              ?.filter(
                (show) => !rankings.some((r) => r.showId === show._id)
              )
              .map((show) => (
                <option key={show._id} value={show._id}>
                  {show.title}
                </option>
              ))}
          </select>
          {selectedShowId && (
            <button
              onClick={() => handleAddToRankings(selectedShowId)}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add to Rankings
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1.5">Ranked Shows</h3>
        {rankings.length === 0 ? (
          <p className="text-[10px] text-gray-600 dark:text-gray-400">
            You haven't ranked any shows yet. Mark shows as "Seen" and add them
            to your rankings.
          </p>
        ) : (
          <div className="space-y-1">
            {rankings.map((ranking) => {
              if (!ranking.show) return null;
              return (
                <div
                  key={ranking._id}
                  className="flex items-center gap-1.5 p-1.5 border rounded hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex-shrink-0 w-6 text-center text-[10px] font-semibold">
                    #{ranking.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{ranking.show.title}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() =>
                        handleMoveRanking(ranking.showId, "up")
                      }
                      disabled={ranking.rank === 1}
                      className="px-1 py-0.5 text-[10px] border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-700"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() =>
                        handleMoveRanking(ranking.showId, "down")
                      }
                      disabled={ranking.rank === rankings.length}
                      className="px-1 py-0.5 text-[10px] border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-700"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemoveFromRankings(ranking.showId)}
                      className="px-1 py-0.5 text-[10px] border rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

