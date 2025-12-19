"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function RankingsManager() {
  const userId = useQuery(api.functions.profile.getFirstUser);
  const rankings = useQuery(
    api.functions.profile.getUserRankings,
    userId ? { userId } : "skip"
  );
  const allShows = useQuery(api.functions.shows.getShows, {});
  const upsertUserShow = useMutation(api.functions.profile.upsertUserShow);
  const updateRanking = useMutation(api.functions.profile.updateRanking);
  const [selectedShowId, setSelectedShowId] = useState<Id<"shows"> | null>(
    null
  );

  const handleAddToRankings = async (showId: Id<"shows">, rank: number) => {
    if (!userId) {
      alert("Please seed the database first");
      return;
    }

    try {
      // Get current max rank
      const maxRank = rankings?.length || 0;
      const newRank = rank || maxRank + 1;

      // If inserting in the middle, shift other rankings
      if (rank && rank <= maxRank) {
        // Shift existing rankings down
        for (const ranking of rankings || []) {
          if (ranking.rank && ranking.rank >= newRank) {
            await updateRanking({
              userId,
              showId: ranking.showId,
              newRank: ranking.rank + 1,
            });
          }
        }
      }

      await upsertUserShow({
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
    if (!userId || !rankings) return;

    const currentRanking = rankings.find((r) => r.showId === showId);
    if (!currentRanking || !currentRanking.rank) return;

    const newRank =
      direction === "up"
        ? currentRanking.rank - 1
        : currentRanking.rank + 1;

    if (newRank < 1 || newRank > rankings.length) return;

    try {
      await updateRanking({
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
    if (!userId) return;

    try {
      const ranking = rankings?.find((r) => r.showId === showId);
      if (!ranking || !ranking.rank) return;

      // Remove the show from rankings (set rank to undefined)
      await upsertUserShow({
        userId,
        showId,
        status: "seen",
        rank: undefined,
      });

      // Shift other rankings up
      for (const r of rankings || []) {
        if (r.rank && r.rank > ranking.rank) {
          await updateRanking({
            userId,
            showId: r.showId,
            newRank: r.rank - 1,
          });
        }
      }
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
        Please seed the database first to create a user.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Ranked Shows</h3>
        {rankings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            You haven't ranked any shows yet. Mark shows as "Seen" and add them
            to your rankings.
          </p>
        ) : (
          <div className="space-y-2">
            {rankings.map((ranking) => {
              if (!ranking.show) return null;
              return (
                <div
                  key={ranking._id}
                  className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex-shrink-0 w-8 text-center font-semibold">
                    #{ranking.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{ranking.show.title}</p>
                    {ranking.show.theatre && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ranking.show.theatre}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleMoveRanking(ranking.showId, "up")
                      }
                      disabled={ranking.rank === 1}
                      className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() =>
                        handleMoveRanking(ranking.showId, "down")
                      }
                      disabled={ranking.rank === rankings.length}
                      className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemoveFromRankings(ranking.showId)}
                      className="px-2 py-1 border rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Add Show to Rankings</h3>
        <div className="space-y-2">
          <select
            value={selectedShowId || ""}
            onChange={(e) =>
              setSelectedShowId(
                e.target.value ? (e.target.value as Id<"shows">) : null
              )
            }
            className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
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
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToRankings(selectedShowId, 0)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add to End
              </button>
              <select
                onChange={(e) => {
                  const rank = parseInt(e.target.value);
                  if (rank) {
                    handleAddToRankings(selectedShowId, rank);
                  }
                }}
                className="px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              >
                <option value="">Or insert at position...</option>
                {Array.from({ length: rankings.length + 1 }, (_, i) => i + 1).map(
                  (rank) => (
                    <option key={rank} value={rank}>
                      Position {rank}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

